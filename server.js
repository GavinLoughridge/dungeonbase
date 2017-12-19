const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path')
const loginRoute = require('./routes/loginRoute');
const herosRoute = require('./routes/herosRoute');
const questsRoute = require('./routes/questsRoute');
const questgiversRoute = require('./routes/questgiversRoute');
const APIherosRoute = require('./routes/APIherosRoute');
const APIquestsRoute = require('./routes/APIquestsRoute');
const APIquestgiversRoute = require('./routes/APIquestgiversRoute');
const session = require('express-session')

app.use('/public', express.static(path.join(__dirname, '/public')));

// app.use(session({
//   secret: 'uL30nZDNyMWcCq5wCaDV',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false
//   }
// }))

app.use(function (req, res, next) {
  console.log('session is:', req.session);

  next();
});

app.set('view engine', 'ejs')

// app.use('/login', loginRoute);
//
// app.use(function (req, res, next) {
//   if(!req.session.user) {
//     res.redirect('/login')
//   }
//
//   next();
// });

app.get('/', function (req, res) {
  res.redirect('/quests')
})

// app.use('/heros', herosRoute);
//
// app.use('/quests', questsRoute);
//
// app.use('/questgivers', questgiversRoute);

app.use('/api/heros', APIherosRoute);

app.use('/api/quests', APIquestsRoute);

app.use('/api/questgivers', APIquestgiversRoute);

// if another route has not sent a respons, send 'not found'
app.use(function (req, res) {
  if (!res.headersSent) res.sendStatus(404);
})

app.listen(PORT, function () {console.log('listening on port', PORT)})

module.exports = app;
