const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Goalpp working');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goal'));

app.use(errorHandler);

module.exports = app;
