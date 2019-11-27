const express = require('express');
const hbs = require('express-handlebars');
const winston = require('winston');

const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

let news = [
  { id: 1, content: 'news 1' },
  { id: 2, content: 'news 2' },
  { id: 3, content: 'news 3' },
  { id: 4, content: 'news 4' },
  { id: 5, content: 'news 5' },
  { id: 6, content: 'news 6' }
];

app.use(express.json());
app.set('view engine', 'handlebars');

app.engine('handlebars', hbs());

app.use((req, res, next) => {
  logger.info(`${new Date()} : ${req.method} ${req.url}`);
  next();
});

app.get('/news', (req, res) => {
  res.send(news);
});
app.get('/news/:id', (req, res) => {
  const found = news.find(item => +item.id === +req.params.id);
  if (found) {
    res.send(found);
  } else {
    const message = `Item with id: ${id} not found`;
    res.status(400).send({ message });
  }
});
app.post('/news', (req, res) => {
  const item = req.body;
  if (item) {
    news.push(req.body);
    res.send(item);
  } else {
    const message = 'Something went wrong';
    res.status(400).send({ message });
  }
});
app.put('/news/:id', (req, res) => {
  if (!req.params.id || !req.body || !req.body.content) {
    const message = 'Incorrect request parameters or request body';
    res.status(400).send(message);
  }
  news = news.map(item => {
    item.content = +item.id === +req.params.id ? req.body.content : item.content;
    return item;
  });
  res.send({ message: 'success' });
});
app.delete('/news/:id', (req, res) => {
  if (!req.params.id) {
    const message = `Request query parameter id is required`;
    req.status(400).send({ message });
  }
  news = news.filter(item => +item.id !== +req.params.id);
  res.send({ message: 'success' });
});

// Error request!!!
app.get('/error', (req, res) => {
  throw new Error('Error!!!');
});

//Default response
app.use((req, res, next) => {
  res.send(news);
  next();
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500);
  res.render('error', { error: err });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
