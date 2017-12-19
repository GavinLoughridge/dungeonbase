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
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

function validBody(signupBody) {
  return (
    // loginBody must be an object with two keys
    typeof signupBody === 'object' &&
    signupBody.constructor === Object &&
    Object.keys(signupBody).length === 9 &&
    // email and password values must be strings
    typeof signupBody.email === 'string' &&
    typeof signupBody.password === 'string' &&
    typeof signupBody.name === 'string' &&
    typeof signupBody.role === 'string' &&
    typeof signupBody.nicknames === 'string' &&
    typeof signupBody.talent === 'string' &&
    typeof signupBody.age === 'string' &&
    typeof signupBody.price === 'string' &&
    typeof signupBody.rating === 'string' &&
    typeof signupBody.level === 'string'
  )
}

router
  .get('/', function (req, res) {
    res.render('signup', {repeat: false});
  })
  .post('/', function (req, res, next) {
    // req.body = formatBody(req.body);


    console.log('body was', req.body);

    if (!validBody(req.body)) throw 400;

    req.body.questgiver = req.body.role;

    knex('users')
    .where('email', req.body.email)
    .then(function (usersData) {
      if (usersData.length != 0) throw 400;

      return knex('users')
      .insert({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
      })
      .returning('id')
    })
    .then(function (usersData) {
      if (usersData.length === 0) throw 400;
      req.body.person_id = usersData[0].id;

      //if (req.body.role === 'questgiver' || req.body.role === 'both')
    })
    .then(function() {

      if (!bcrypt.compareSync(req.body.password, user.password)) throw 400;

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
