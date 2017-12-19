const knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'dungeonbase',
    user:     'xkrhtsbo',
    password: 'avwwoqbk'
  }
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

function validBody(loginBody) {
  return (
    // loginBody must be an object with two keys
    typeof loginBody === 'object' &&
    loginBody.constructor === Object &&
    Object.keys(loginBody).length === 2 &&
    // email and password values must be strings
    typeof loginBody.email === 'string' &&
    typeof loginBody.password === 'string'
  );
}

router
  .get('/', function (req, res) {
    delete req.session.email;
    delete req.session.roles;

    res.render('login', {repeat: false});
  })
  .post('/', function (req, res, next) {
    console.log('recived login info:', req.body);

    if (!validBody(req.body)) throw 400;

    console.log('valid body');

    knex('users')
    .where('email', req.body.email)
    .then(function (usersData) {
      if (usersData.length === 0) throw 400;
      user = usersData[0];

      console.log('found user:', user);

      if (!bcrypt.compareSync(req.body.password, user.password)) throw 400;

      console.log('valid password');

      req.session.email = user.email;

      res.locals.user_id = user.id;

      return knex('questgivers')
      .where('user_id', res.locals.user_id)
    })
    .then(function (questgiversData) {
      req.session.questgiver = questgiversData.length > 0;

      return knex('heros')
      .where('user_id', res.locals.user_id)
    })
    .then(function (herosData) {
      req.session.hero = herosData.length > 0;

      if (!req.session.hero && !req.session.questgiver) throw 400;

      res.redirect('/');
    })
    .catch(function (err) {
      res.render('login', {repeat: true});
    })
  })
  .patch(/(.*?)/, function (req, res, next) {
    throw 405;
  })
  .delete(/(.*?)/, function (req, res, next) {
    throw 405;
  })
  .put(/(.*?)/, function (req, res) {
    throw 405;
  })
  .use(function (err, req, res, next) {
    if (err === 400) res.render('login', {repeat: true});
    if (!res.headersSent) console.error(err);
  })
  .use(function (req, res) {
    if (!res.headersSent) res.sendStatus(400);
  })

module.exports = router;
