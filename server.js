const express = require('express');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const winston = require('winston');
const passport = require('passport');
const config = require('./config');

const newsRoutes = require('./routes/news');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const mongoURI = config.mongodb.mongoURI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const app = express();
require('./services/passport');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use(express.json());
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs());
app.use(passport.initialize());

app.use('/news', newsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

// app.use((req, res, next) => {
//   logger.info(`${new Date()} : ${req.method} ${req.url}`);
//   next();
// });

// // Error request!!!
// app.get('/error', (req, res) => {
//   throw new Error('Error!!!');
// });

// //Default response
// app.use((req, res, next) => {
//   res.send(news);
//   next();
// });

// // Error handler
// app.use((err, req, res, next) => {
//   logger.error(err);
//   res.status(500);
//   res.render('error', { error: err });
// });

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
server.on('error', (err) => {
  logger.error(err);
  console.error(err);
});
