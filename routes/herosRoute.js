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

// check if a given id is valid
function validId(id) {
  return !isNaN(parseInt(id));
}

// a valid hero must be an object with all hero attributes present and of the correct type
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
    (typeof heroBody.contact === 'string'),
    (Number.isInteger(heroBody.age)),
    (Number.isInteger(heroBody.price)),
    (typeof heroBody.rating === 'number'),
    (Number.isInteger(heroBody.level))
    ].filter((test) => test).length
  );
}

// select heros joined with persons table
function selectHeros() {
  return knex('heros').join('persons', 'persons.id', 'heros.person_id')
  .select({id: 'heros.id'}, {name: 'person_name'}, 'talent', 'contact', 'age', 'price', 'rating', 'level');
}

// append nicknames to a hero
function appendNickname(hero) {
  return knex('nicknames')
  .select('nickname')
  .where('hero_id', hero.id)
  .then(function (nicknames) {
    hero.nicknames = nicknames.map((nickname) => nickname.nickname);
    return hero;
  })
}

// append nicknames to the next hero in an array
function appendNextNickname(herosData, index, resolve) {
  if (index < herosData.length) {
    appendNickname(herosData[index])
    .then(function(hero) {
      herosData[index] = hero;
      appendNextNickname(herosData, index + 1, resolve);
    })
  } else {
    resolve(herosData);
  }
}

// send back formatted hero data
function sendHeroData(heroData, res, next) {
  // if the specified hero does not exist, return 'not found'
  if (heroData.length === 0) {
    res.sendStatus(404);
    return next();
  }

  // otherwise add nicknames and send hero
  appendNickname(heroData[0])
  .then(function (hero) {
    res.set({'Content-Type': 'application/json'});
    res.send(JSON.stringify(hero));
  })
}

router
  // if the path does not specify a hero id return the full hero list
  .get('/', function (req, res, next) {
    selectHeros()
    .then(function (herosData) {
      // create heros array to add formatted hero objects to
      return new Promise ((resolve, reject) => {
        appendNextNickname(herosData, 0, resolve)
      })
    })
    .then(function (heros) {
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(heros));
    })
  })
  // if the path specifies a numeric hero id, attempt to retrive that hero
  .get('/:hero_id', function (req, res, next) {
    if (!validId(req.params.hero_id)) {
      res.sendStatus(400);
      return next();
    }

    selectHeros()
    .where('heros.id', req.params.hero_id)
    .then(function (heroData) {
      sendHeroData(heroData, res, next);
    })
  })
  .post('/', function (req, res, next) {
    let hero = req.body;

    // if the request body is not a complete valid hero, send 400
    if (!validBody(hero) || Object.keys(hero).length != 8) {
      res.sendStatus(400);
      return next();
    }
    // add hero to person database and return person id
    knex('persons').insert({person_name: hero.name}, 'id')
    // add hero to hero database and return hero id
    .then(function (person_ids) {
      return knex('heros').insert({
        person_id: person_ids[0],
        talent: hero.talent,
        contact: hero.contact,
        age: hero.age,
        price: hero.price,
        rating: hero.rating,
        level: hero.level
      }, 'id')
    })
    // add hero nicknames to nicknames database
    .then(function (hero_ids) {
      hero.id = hero_ids[0]; // store hero id on hero object to use when retriving from database

      let nicknames = hero.nicknames.map((nickname) => {
        return {
          hero_id: hero.id,
          nickname: nickname
        }
      });

      if (nicknames.length > 0) return knex('nicknames').insert(nicknames)
    })
    // retrive newly created hero from database
    .then(function () {
      return selectHeros().where('heros.id', hero.id)
    })
    // format and send newly created hero
    .then(function (heroData) {
      sendHeroData(heroData, res, next);
    })
  })
  .patch('/:hero_id', function (req, res, next) {
    let updates = req.body;

    // if body is invalid send 400
    if (!validBody(updates) || !validId(req.params.hero_id)) {
      res.sendStatus(400);
      return next();
    }

    // try to retrive data about the hero
    selectHeros().where('heros.id', req.params.hero_id)
    .then(function (heroData) {
      // if the specified hero does not exist, return 'not found'
      if (heroData.length === 0) {
        throw 'invalid id';
      }
    })
    // if the update includes a name check the persons table for it
    .then(function () {
      if (typeof updates.name === 'string') {
        return knex('persons').where('person_name', updates.name);
      }
    })
    .then(function (personsData) {
      // if the update includes an existing name, store it's id
      if (typeof personsData === 'object' && Object.keys(personsData).length > 0) {
        updates.person_id = personsData[0].id;
      // if the update includes a new name, insert it
      } else if (typeof personsData === 'object' && Object.keys(personsData).length === 0) {
        return knex('persons').insert({person_name: updates.name}, 'id');
      }
    })
    // if a new person was inserted, store it's id
    .then(function(personData) {
      if (typeof personData === 'object') {
        updates.person_id = personData[0];
      }
    })
    // if the update inclues nicknames, insert them
    .then(function() {
      if (typeof updates.nicknames === 'object') {
        return knex('nicknames').insert(updates.nicknames.map((nickname) => {
          return {
            hero_id: req.params.hero_id,
            nickname: nickname
          }
        }))
      }
    })
    // if the update inclueds other attributes, update them
    .then(function () {
      delete updates.name;
      delete updates.nicknames;

      return knex('heros').update(updates).where('id', req.params.hero_id)
    })
    // retive the updated hero
    .then(function () {
      return selectHeros()
      .where('heros.id', req.params.hero_id)
      .then(function (heroData) {
        sendHeroData(heroData, res, next);
      })
    })
    .catch(function (err) {
      if (err === 'invalid id') res.sendStatus(404);
      else res.sendStatus(500);
    })

  })
  .delete('/:hero_id', function (req, res, next) {
    // if id is not a number, send 400
    if (!validId(req.params.hero_id)) {
      res.sendStatus(400);
      return next();
    }
    // attempt to retrive hero
    selectHeros().where('heros.id', req.params.hero_id)
    .then(function (heroData) {
      // if the specified hero does not exist, return 404
      if (heroData.length === 0) throw 'invalid id';

      // otherwise add nicknames to hero
      return appendNickname(heroData[0])
    })
    .then(function (hero) {
      // return hero and then delete from database
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(hero));
      return knex('heros').del().where('id', req.params.hero_id)
    })
    .catch(function (err) {
      if (err === 'invalid id') res.sendStatus(404);
      else res.sendStatus(500);
    })
  })
  .put(/(.*?)/, function (req, res) {
    res.sendStatus(405);
  })
  .use(function (req, res) {
    if (!res.headersSent) res.sendStatus(400);
  })

module.exports = router;
