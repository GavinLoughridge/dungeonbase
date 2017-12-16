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

function validBody(loginBody) {
  return (
    // loginBody must be an object
    (typeof loginBody === 'object') &&
    // loginBody must not be an array
    (loginBody.constructor === Object) &&
    (Object.keys(loginBody).length === 1) &&
    (typeof loginBody.user === 'string')
  );
}

router
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .get('/', function (req, res) {
    delete req.session.user;
    delete req.session.roles;

    res.render('login', {repeat: false});
  })
  .post('/', function (req, res, next) {
    if (!validBody(req.body)) {
      throw 400;
    }

    user = req.body.user;

    knex('persons')
    .where('contact', user)
    .then(function (personsData) {
      if (personsData.length === 0) throw 400;

      req.session.user = user;
      req.session.roles = [];

      res.locals.person_id = personsData[0].id;

      return knex('questgivers')
      .where('person_id', res.locals.person_id)
    })
    .then(function (questgiversData) {
      if (questgiversData.length > 0) {
        req.session.roles.push('questgiver');
      }

      return knex('heros')
      .where('person_id', res.locals.person_id)
    })
    .then(function (herosData) {
      if (herosData.length > 0) req.session.roles.push('hero');

      if (req.session.roles.length === 0) throw 400;

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
    res.render('login', {repeat: true});
  })
  .use(function (req, res) {
    if (!res.headersSent) res.sendStatus(400);
  })

module.exports = router;
