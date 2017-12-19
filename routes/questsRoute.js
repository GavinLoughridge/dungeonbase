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

function fetchQuests(req) {
  return knex('quests')
  .join('dungeons', 'dungeons.id', 'quests.dungeon_id')
  .join('questgivers', 'questgivers.id', 'quests.questgiver_id')
  .join('users as questgivers_users', 'questgivers_users.id', 'questgivers.user_id')
  .leftJoin('users as completed_by_users', 'completed_by_users.id', 'quests.completed_by')
  .select({id: 'quests.id'}, {dungeon: 'dungeons.name'}, 'location', 'map', 'threat', {questgiver: 'questgivers_users.name'}, 'reward', 'completed', {completed_by: 'completed_by_users.name'})
  .modify(function (queryBuilder) {
    if (!req.session.roles.includes('hero')) {
      queryBuilder.where('questgivers_users.email', req.session.user)
    }
  });
}

function validBody(questBody) {
  return (
    // questBody must be an object
    (typeof questBody === 'object') &&
    // questBody must not be an array
    (questBody.constructor === Object) &&
    // questBody must not be empty
    Object.keys(questBody).length > 0 &&
    // questBody must only contain valid quest attributes
    Object.keys(questBody).length === [
    (typeof questBody.dungeon === 'string'),
    (typeof questBody.location === 'string'),
    (typeof questBody.map === 'string'),
    (Number.isInteger(questBody.threat)),
    (typeof questBody.email === 'string'),
    (Number.isInteger(questBody.reward)),
    ].filter((test) => test).length
  );
}

router
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(function (req, res, next) {
    req.body.email = req.session.user;

    next();
  })
  .use(function (req, res, next) {
    if (typeof req.body.threat != 'undefined') req.body.threat = parseInt(req.body.threat);
    if (typeof req.body.reward != 'undefined') req.body.reward = parseInt(req.body.reward);

    next();
  })
  .get('/', function (req, res, next) {

    fetchQuests(req)
    .then(function (questsData) {
      res.render('quests/questsList', {
        questsData: questsData,
        questgiver: req.session.roles.includes('questgiver')
      });
    })
  })
  .get('/new', function (req, res, next) {
    res.render('quests/newQuest')
  })
  .get('/:quest_id/:edit?', function (req, res, next) {
    if (isNaN(parseInt(req.params.quest_id))) throw 400;

    if (typeof req.params.edit != 'undefined' && req.params.edit != 'edit') throw 400;

    fetchQuests(req)
    .modify(function (queryBuilder) {
      if (req.session.roles.includes('questgiver')) {
        queryBuilder.select('questgivers_users.email');
      }
    })
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      questsData[0].editable = (typeof questsData[0].email != 'undefined' && questsData[0].email === req.session.user);

      questsData[0].hero = (req.session.roles.includes('hero'));

      if (req.params.edit === 'edit') {
        if (!questsData[0].editable) throw 400;
        res.render('quests/editQuest', questsData[0]);
      } else {
        res.render('quests/questsDetails', questsData[0]);
      }
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .post('/', function (req, res, next) {
    let quest = req.body;

    if (!validBody(quest) || Object.keys(quest).length != 6) {
          throw 400;
        }

    fetchQuests(req)
    .where('questgivers_users.email', quest.email)
    .andWhere('dungeons.name', quest.dungeon)
    .then(function (questsData) {
      if (questsData.length > 0) throw 400;

      return knex('questgivers')
      .join('users', 'users.id', 'questgivers.user_id')
      .select('questgivers.id')
      .where('users.email', quest.email)
    })
    .then(function (questgiver_id) {
      if (questgiver_id.length === 0) throw 400;

      res.locals.questgiver_id = questgiver_id[0].id;

      return knex('dungeons')
      .select('id')
      .where('name', quest.dungeon)
    })
    .then(function (dungeon_id) {
      let dungeon = {
        name: quest.dungeon,
        location: quest.location,
        map: quest.map,
        threat: quest.threat
      }

      if (dungeon_id.length > 0) {
        return knex('dungeons')
        .update(dungeon)
        .where('id', dungeon_id[0])
        .returning('id')
      } else {
        return knex('dungeons')
        .insert(dungeon)
        .returning('id')
      }
    })
    .then(function (dungeon_id) {
      return knex('quests')
      .insert({
        questgiver_id: res.locals.questgiver_id,
        dungeon_id: dungeon_id[0],
        reward: quest.reward
      })
      .returning('id')
    })
    .then(function (quest_id) {
      res.redirect(`/quests/${quest_id[0]}`)
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .post('/:quest_id', function (req, res, next) {
    let quest = req.body;

    if (!validBody(quest)) throw 400;

    fetchQuests(req)
    .select('questgivers_users.email')
    .select({dungeon_id: 'dungeons.id'})
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      res.locals.quest = questsData[0];

      if (questsData.length === 0) throw 404;

      if (typeof quest.email != 'undefined' &&
          quest.email != questsData[0].email) {
            throw 400
          }

      delete quest.email;

      if (typeof quest.dungeon === 'string') {
        return knex('dungeons')
        .select('id')
        .where('name', quest.dungeon)
      }
    })
    .then(function (dungeon_id) {
      let dungeon = {};

      if (typeof quest.dungeon === 'string') dungeon.name = quest.dungeon;
      if (typeof quest.location === 'string') dungeon.location = quest.location;
      if (typeof quest.map === 'string') dungeon.map = quest.map;
      if (Number.isInteger(quest.threat)) dungeon.threat = quest.threat;

      delete quest.dungeon;
      delete quest.location;
      delete quest.map;
      delete quest.threat;

      if (Object.keys(dungeon).length === 0) {
        return [res.locals.quest.dungeon_id];
      } else if (typeof dungeon_id === 'object' && dungeon_id.length > 0) {
        return knex('dungeons')
        .update(dungeon)
        .where('id', dungeon_id[0].id)
        .returning('id')
      } else if (Object.keys(dungeon).length === 4) {
        return knex('dungeons')
        .insert(dungeon)
        .returning('id')
      } else {
        throw 400;
      }
    })
    .then(function (dungeon_id) {
      quest.dungeon_id = dungeon_id[0];

      return knex('quests')
      .update(quest)
      .where('id', req.params.quest_id)
      .returning('id')
    })
    .then(function (quest_id) {
      res.redirect(`/quests/${quest_id[0]}`)
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .post('/:quest_id/:del', function (req, res, next) {
    if (isNaN(parseInt(req.params.quest_id))) throw 400;

    if (typeof req.params.del != 'undefined' && req.params.del != 'delete') return next();

    fetchQuests(req)
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      res.locals.quest = questsData[0];

      return knex('quests')
      .del()
      .where('id', req.params.quest_id)
    })
    .then(function () {
      res.redirect('/quests')
    })
    .catch(function (err) {
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .post('/:quest_id/:complete', function (req, res, next) {
    if (isNaN(parseInt(req.params.quest_id))) throw 400;

    if (typeof req.params.complete != 'undefined' && req.params.complete != 'complete') throw 400;

    if (!req.session.roles.includes('hero')) throw 400;

    fetchQuests(req)
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      res.locals.quest = questsData[0];

      return knex('users')
      .select('id')
      .where('email', req.session.user)
    })
    .then(function (user_id) {

      return knex('quests')
      .update({
        completed: true,
        completed_by: user_id[0].id
      })
      .where('id', req.params.quest_id)
    })
    .then(function () {
      res.redirect(`/quests/${req.params.quest_id}`)
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
    if (!res.headersSent) console.error(err);
  })
  .use(function (req, res) {
    if (!res.headersSent) res.sendStatus(400);
  })

module.exports = router;
