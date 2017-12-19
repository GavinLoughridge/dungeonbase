// setup requierments
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser');

// setup routes
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const herosRoute = require('./routes/herosRoute');
const questsRoute = require('./routes/questsRoute');
const questgiversRoute = require('./routes/questgiversRoute');

// setup middleware
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: 'uL30nZDNyMWcCq5wCaDV',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))

app.use(bodyParser.urlencoded({
  extended: true
}))

app.set('view engine', 'ejs')

app.use(function (req, res, next) {
  console.log('session is:', req.session);

  next();
});

// route requests
app.use('/signup', signupRoute);

app.use('/login', loginRoute);

app.use(function (req, res, next) {
  if(!req.session.email) {
    console.log('redirecting');
    res.redirect('/login')
  } else {
    console.log('not redirecting');
    next();
  }
});

app.get('/', function (req, res) {
  console.log('redering index');
  res.render('index');
  //res.redirect('/quests')
})

app.use('/heros', herosRoute);

app.use('/quests', questsRoute);

app.use('/questgivers', questgiversRoute);

// if another route has not sent a response, send 'not found'
app.use(function (req, res) {
  if (!res.headersSent) res.sendStatus(404);
})

app.listen(PORT, function () {console.log('listening on port', PORT)})

module.exports = app;
