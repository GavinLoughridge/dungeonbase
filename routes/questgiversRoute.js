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

function validBody(questgiverBody) {
  return (
    // questgiverBody must be an object
    (typeof questgiverBody === 'object') &&
    // questgiverBody must not be an array
    (questgiverBody.constructor === Object) &&
    (Object.keys(questgiverBody).length === 2) &&
    (typeof questgiverBody.name === 'string') &&
    (typeof questgiverBody.email === 'string')
  );
}

router
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .get(/(.*?)/, function (req, res) {
    throw 405;
  })
  .post('/', function (req, res, next) {
    let questgiver = req.body;

    if (!validBody(questgiver)) throw 400;

    knex('questgivers')
    .join('users', 'users.id', 'user_id')
    .where('users.email', questgiver.email)
    .then(function (questgiversData) {
      if (questgiversData.length > 0) throw 400;

      return knex('users')
      .select('id', 'name')
      .where('email', questgiver.email)
    })
    .then(function (usersData) {
      if (usersData.length > 0) {
        if (questgiver.name != usersData[0].name) throw 400;

        return [usersData[0].id]
      } else {
        return knex('users')
        .insert(questgiver)
        .returning('id')
      }
    })
    .then(function (user_id) {
      return knex('questgivers')
      .insert({user_id: user_id[0]})
      .returning('id')
    })
    .then(function (questgiver_id) {
      return knex('questgivers')
      .join('users', 'users.id', 'questgivers.user_id')
      .select('name', 'email')
      .where('questgivers.id', questgiver_id[0])
    })
    .then(function (questgiverData) {
      if (questgiverData.length === 0) throw 404;

      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(questgiverData[0]));
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) res.sendStatus(500);
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
    if (err === 400) res.sendStatus(400);
    if (err === 405) res.sendStatus(405);
    if (!res.headersSent) res.sendStatus(500);
  })
  .use(function (req, res) {
    if (!res.headersSent) res.sendStatus(400);
  })

module.exports = router;
