const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.WEB_URI, 
  credentials: true,              
}));

app.get('/', (req, res) => {
  res.send('API Goalpp working');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goal'));

app.use(errorHandler);

module.exports = app;
