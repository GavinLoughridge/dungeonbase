const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.set('view engine', 'ejs')

// set up routes
const herosRoute = require('./routes/herosRoute');
const questsRoute = require('./routes/questsRoute');
const questgiversRoute = require('./routes/questgiversRoute');

app.use('/api/heros', herosRoute);

app.use('/api/quests', questsRoute);

app.use('/api/questgivers', questgiversRoute);

// if another route has not sent a respons, send 'not found'
app.use(function (req, res) {
  if (!res.headersSent) res.sendStatus(404);
})

app.listen(3000)

module.exports = app;
