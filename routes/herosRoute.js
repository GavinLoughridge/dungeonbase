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

function formatHero(heroData) {
  // create hero object from first object in hero data
  let hero = heroData[0];

  // combine hero nicknames into a single nicknames array
  let nicknames = []
  for (let i = 0; i < heroData.length; i++) {
    if (heroData[i].nickname != null) {
      nicknames.push(heroData[i].nickname)
    }
  }
  delete hero.nickname;
  hero.nicknames = nicknames;

  return hero
}

function validNicknames(nicknames) {
  let valid = true;

  for (let i = 0; i < nicknames.length; i++) {
    if (typeof nicknames[i] != 'string') valid = false;
  }

  return valid;
}

// a valid hero must be an object with all hero attributes present and of the correct type
function validHero(hero) {
  return (
    typeof hero === 'object' && hero.constructor === Object &&
    typeof hero.name === 'string' &&
    typeof hero.nicknames === 'object' && hero.nicknames.constructor === Array &&
    validNicknames(hero.nicknames) &&
    typeof hero.talent === 'string' &&
    typeof hero.contact === 'string' &&
    Number.isInteger(hero.age) &&
    Number.isInteger(hero.price) &&
    typeof hero.rating === 'number' &&
    Number.isInteger(hero.level) &&
    Object.keys(hero).length === 8
  )
}

router
/*
  GET INFORMATION FROM THE HEROS TABLE
*/
  // if the path does not specify a hero id return the full hero list
  .get('/', function (req, res, next) {
    knex('heros').join('persons', 'persons.id', 'heros.person_id').leftJoin('nicknames', 'nicknames.hero_id', 'heros.id')
    .select({id: 'heros.id'}, {name: 'person_name'}, 'nickname', 'talent', 'contact', 'age', 'price', 'rating', 'level')
    .then(function (herosData) {
      // create heros array to add formatted hero objects to
      let heros = [];

      while (herosData.length > 0) {
        // set id for current hero
        let heroId = herosData[0].id;

        // find collect all rows for that hero from heros data
        let heroData = herosData.filter(function (hero) {
          return hero.id === heroId;
        })

        // format the hero data into a object
        heros.push(formatHero(heroData));

        // remove all rows for that hero from heros data
        herosData = herosData.filter(function (hero) {
          return hero.id != heroId;
        })
      }

      res.status(200);
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(heros));
    })
  })
  // if the path specifies a numeric hero id, attempt to retrive that hero
  .get('/:hero_id', function (req, res, next) {
    if (validId(req.params.hero_id)) {
      // retrive hero name, nicknames, and other info from database
      knex('heros').join('persons', 'persons.id', 'heros.person_id').leftJoin('nicknames', 'nicknames.hero_id', 'heros.id')
      .select({id: 'heros.id'}, {name: 'person_name'}, 'nickname', 'talent', 'contact', 'age', 'price', 'rating', 'level')
      .where('heros.id', req.params.hero_id)
      .then(function (heroData) {
        // if the specified hero does not exist, return 'not found'
        if (heroData.length === 0) {
          res.sendStatus(404);
          return next();
        }
        // create formatted hero object
        let hero = formatHero(heroData);

        // return formatted hero
        res.status(200);
        res.set({'Content-Type': 'application/json'});
        res.send(JSON.stringify(hero));
      })
    // if the path specifies a non-numeric hero id, send 'bad request'
    } else {
      res.sendStatus(400);
      return next();
    }
  })
  /*
    POST INFORMATION TO THE HEROS TABLE
  */
  .post('/', function (req, res, next) {
    let hero = req.body;

    // if the request body is not a valid hero, send 400
    if (!validHero(hero)) {
      res.sendStatus(400);
      return next();
    }
    // otherwise add hero to database
    else {
      // add hero to person database and return person id
      let personData = {
        person_name: hero.name
      }
      knex('persons').insert(personData, 'id')
      // add hero to hero database and return hero id
      .then(function (person_ids) {
        let heroData = {
          person_id: person_ids[0],
          talent: hero.talent,
          contact: hero.contact,
          age: hero.age,
          price: hero.price,
          rating: hero.rating,
          level: hero.level
        }
        return knex('heros').insert(heroData, 'id')
      })
      // add hero nicknames to nicknames database
      .then(function (hero_ids) {
        hero.id = hero_ids[0]; // store hero id on hero object to use when retriving from database
        let nicknames = [];
        for (let i = 0; i < hero.nicknames.length; i++) {
          nicknames.push({
            hero_id: hero.id,
            nickname: hero.nicknames[i]
          })
        }

        if (nicknames.length > 0) return knex('nicknames').insert(nicknames)
      })
      // retrive newly created hero from database
      .then(function () {
        return knex('heros').join('persons', 'persons.id', 'heros.person_id').leftJoin('nicknames', 'nicknames.hero_id', 'heros.id')
        .select({id: 'heros.id'}, {name: 'person_name'}, 'nickname', 'talent', 'contact', 'age', 'price', 'rating', 'level')
        .where('heros.id', hero.id)
      })
      // format and send newly created hero
      .then(function (heroData) {
        // if the specified hero does not exist, return 'not found'
        if (heroData.length === 0) {
          res.sendStatus(500);
          return next();
        }
        // create formatted hero object
        let hero = formatHero(heroData);

        // return formatted hero
        res.status(200);
        res.set({'Content-Type': 'application/json'});
        res.send(JSON.stringify(hero));
      })
    }
  })
  .put('/index', function (req, res) {
    // if the request body is not a valid hero, send 400
    console.log('puting hero with id', req.params.hero_id);
    res.sendStatus(200);
  })
  .patch(function (req, res) {
    console.log('patching hero with id', req.params.hero_id);
    res.sendStatus(200);
  })
  .delete(function (req, res) {
    console.log('deleting hero with id', req.params.hero_id);
    res.sendStatus(200);
  })
  .use(function (req, res) {
    if (!res.headersSent) {
      res.sendStatus(400);
    }
  })

module.exports = router;
