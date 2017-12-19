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

function fetchHeros() {
  return knex('heros')
  .join('users', 'users.id', 'heros.user_id')
  .select({id: 'heros.id'}, 'name', 'talent', 'email', 'age', 'price', 'rating', 'level');
}

function appendNicknames(herosData) {
  return knex('nicknames')
  .then(function (nicknameData) {
    let nicknameTable = {};

    nicknameData.forEach(function(nickname) {
      if (typeof nicknameTable[nickname.hero_id] === 'undefined') nicknameTable[nickname.hero_id] = [];
      nicknameTable[nickname.hero_id].push(nickname.nickname);
    })

    herosData.forEach(function (hero) {
      hero.nicknames = nicknameTable[hero.id] || [];
    })

    return herosData;
  })
}

function validBody(heroBody) {
  return (
    // heroBody must be an object
    (typeof heroBody === 'object') &&
    // heroBody must not be an array
    (heroBody.constructor === Object) &&
    // heroBody must not be empty
    Object.keys(heroBody).length > 0 &&
    // heroBody must only contain valid hero attributes
    Object.keys(heroBody).length === [
    (typeof heroBody.name === 'string'),
    (typeof heroBody.nicknames === 'object') &&
    (heroBody.nicknames.constructor === Array) &&
    (heroBody.nicknames.filter((nickname) => typeof nickname != 'string').length === 0),
    (typeof heroBody.talent === 'string'),
    (typeof heroBody.email === 'string'),
    (Number.isInteger(heroBody.age)),
    (Number.isInteger(heroBody.price)),
    (typeof heroBody.rating === 'number'),
    (Number.isInteger(heroBody.level))
    ].filter((test) => test).length
  );
}

router
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .get('/', function (req, res, next) {
    fetchHeros()
    .then(function (herosData) {
      return appendNicknames(herosData);
    })
    .then(function (herosData) {
      res.render('heros/herosList', {herosData: herosData});
    })
    .catch(function (err) {
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .get('/:hero_id', function (req, res, next) {
    if (isNaN(parseInt(req.params.hero_id))) throw 400;

    fetchHeros()
    .where('heros.id', req.params.hero_id)
    .then(function (herosData) {
      return appendNicknames(herosData);
    })
    .then(function (herosData) {
      if (herosData.length === 0) throw 404;

      res.render('heros/herosDetails', herosData[0]);
    })
    .catch(function (err) {
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .post('/', function (req, res, next) {
    let hero = req.body;

    if (!validBody(hero) || Object.keys(hero).length != 8) throw 400;

    fetchHeros()
    .where('users.email', hero.email)
    .then(function (heroData) {
      if (heroData.length > 0) throw 400;

      return knex('users').where('email', hero.email)
    })
    .then(function (userData) {
      if (userData.length > 0 && userData[0].name != hero.name) throw 400;
      if (userData.length > 0) return [userData[0].id];

      return knex('users').insert({
        name: hero.name,
        email: hero.email
      }, 'id')
    })
    .then(function (user_id) {
      return knex('heros').insert({
        user_id: user_id[0],
        talent: hero.talent,
        age: hero.age,
        price: hero.price,
        rating: hero.rating,
        level: hero.level
      }, 'id')
    })
    .then(function (hero_id) {
      hero.id = hero_id[0];

      let nicknames = hero.nicknames.map((nickname) => {
        return {
          hero_id: hero_id[0],
          nickname: nickname
        }
      });

      return knex('nicknames').insert(nicknames)
    })
    .then(function() {
      return fetchHeros().where('heros.id', hero.id)
    })
    .then(function (herosData) {
      return appendNicknames(herosData);
    })
    .then(function (herosData) {
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(herosData[0]));
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (!res.headersSent) res.sendStatus(500);
    })
  })
  .patch('/:hero_id', function (req, res, next) {
    let hero = req.body;

    if (!validBody(hero)) throw 400;

    fetchHeros()
    .select({user_id: 'users.id'})
    .where('heros.id', req.params.hero_id)
    .then(function (heroData) {
      if (heroData.length === 0) throw 404;

      res.locals.user_id = heroData[0].user_id;

      if (typeof hero.email === 'string') {
          return knex('users')
          .whereNot('users.email', heroData[0].email)
          .andWhere('users.email', hero.email)
      }
    })
    .then(function(usersData) {
      if (typeof hero.email === 'string' && usersData.length > 0) throw 400;

      if (typeof hero.email === 'string') {
        return knex('users')
        .update({email: hero.email})
        .where('id', res.locals.user_id)
      }
    })
    .then(function(usersData) {
      if (typeof hero.name === 'string') {
        return knex('users')
        .update({name: hero.name})
        .where('id', res.locals.user_id)
      }
    })
    .then(function() {
      if (typeof hero.nicknames === 'object') {
        return knex('nicknames')
        .where('hero_id', req.params.hero_id)
        .del()
      }
    })
    .then(function() {
      if (typeof hero.nicknames === 'object') {
        let nicknames = hero.nicknames.map((nickname) => {
          return {
            hero_id: req.params.hero_id,
            nickname: nickname
          }
        });

        return knex('nicknames').insert(nicknames)
      }
    })
    .then(function() {
      delete hero.email;
      delete hero.name;
      delete hero.nicknames;

      return knex('heros')
      .update(hero)
      .where('id', req.params.hero_id)
    })
    .then(function() {
      return fetchHeros().where('heros.id', req.params.hero_id)
    })
    .then(function (herosData) {
      return appendNicknames(herosData);
    })
    .then(function (herosData) {
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(herosData[0]));
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) res.sendStatus(500);
    })
  })
  .delete('/:hero_id', function (req, res, next) {
    if (isNaN(parseInt(req.params.hero_id))) throw 400;

    fetchHeros()
    .where('heros.id', req.params.hero_id)
    .then(function (herosData) {
      return appendNicknames(herosData);
    })
    .then(function (herosData) {
      if (herosData.length === 0) throw 404;

      res.locals.hero = herosData[0];

      return knex('heros')
      .del()
      .where('id', req.params.hero_id)
    })
    .then(function () {
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(res.locals.hero));
    })
    .catch(function (err) {
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .put(/(.*?)/, function (req, res) {
    throw 405;
  })
  .use(function (err, req, res, next) {
    if (err === 400) res.sendStatus(400);
    if (err === 404) res.sendStatus(404);
    if (err === 405) res.sendStatus(405);
    if (err === 500) res.sendStatus(404);
    if (!res.headersSent) res.sendStatus(500);
  })
  .use(function (req, res) {
    if (!res.headersSent) res.sendStatus(400);
  })

module.exports = router;
