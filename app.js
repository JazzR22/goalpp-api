const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Goalpp working');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goal'));

module.exports = app;
