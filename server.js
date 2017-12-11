const knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'dungeonbase',
    user:     'xkrhtsbo',
    password: 'avwwoqbk'
  }
});
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
const jsonParser = bodyParser.json();
app.use(bodyParser.json())

// check if a given id is valid for it's entity type
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

function validHero(hero) {
  return false;
}

app.route('/heros/:hero_id?')
  // attempt to retrive information from the heros table
  .get(function (req, res, next) {
    // if the path does not specify a hero id return the full hero list
    if (typeof req.params.hero_id === 'undefined') {
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
    // if the path specifies a numeric hero id, attempt to retrive that hero
    } else if (validId(req.params.hero_id)) {
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
  // attempt to post information to the heros table
  .post(function (req, res, next) {
    let hero = req.body;

    // if the path incluedes extra parameters, return 'bad request'
    if (typeof req.params.hero_id != 'undefined') {
      res.sendStatus(400);
      return next();
    }
    // if the path incluedes extra parameters, return 'bad request'
    else if (!validHero(hero)) {
      res.sendStatus(400);
      return next();
    }
    // otherwise add hero to database
    else {

    }

    console.log('posting hero with id', req.params.hero_id);
    res.sendStatus(200);
  })
  .put(function (req, res) {
    console.log('puting hero with id', req.params.hero_id);
    res.sendStatus(200);
  })
  .delete(function (req, res) {
    console.log('deleting hero with id', req.params.hero_id);
    res.sendStatus(200);
  })
  .patch(function (req, res) {
    console.log('patching hero with id', req.params.hero_id);
    res.sendStatus(200);
  })

app.route('/quests/:quest_id?')
  .get(function (req, res) {
    console.log('getting heros with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .post(function (req, res) {
    console.log('posting hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .put(function (req, res) {
    console.log('puting hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .delete(function (req, res) {
    console.log('deleting hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .patch(function (req, res) {
    console.log('patching hero with id', req.params.quest_id);
    res.sendStatus(200);
  })

app.use(function (req, res) {
  // if another route has not sent a respons, send 'not found'
  if (!res.headersSent) {
    res.sendStatus(404);
  }
})

app.listen(3000, () => console.log('Server is running'))

module.exports = app;
