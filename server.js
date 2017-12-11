const knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'dungeonbase',
    user:     'xkrhtsbo',
    password: 'avwwoqbk'
  }
});
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
const jsonParser = bodyParser.json();
app.use(bodyParser.json())

// set up routes
const herosRoute = require('./routes/herosRoute');
const questsRoute = require('./routes/questsRoute');

app.use('/api/heros', herosRoute);

app.use('/api/quests', questsRoute);

// if another route has not sent a respons, send 'not found'
app.use(function (req, res) {
  if (!res.headersSent) {
    res.sendStatus(404);
  }
})

app.listen(3000)

module.exports = app;
