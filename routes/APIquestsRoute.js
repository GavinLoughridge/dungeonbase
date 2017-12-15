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

function fetchQuests() {
  return knex('quests')
  .join('dungeons', 'dungeons.id', 'quests.dungeon_id')
  .join('questgivers', 'questgivers.id', 'quests.questgiver_id')
  .join('persons as questgivers_persons', 'questgivers_persons.id', 'questgivers.person_id')
  .leftJoin('persons as completed_by_persons', 'completed_by_persons.id', 'quests.completed_by')
  .select({id: 'quests.id'}, {dungeon: 'dungeons.name'}, 'location', 'map', 'threat', {questgiver: 'questgivers_persons.name'}, 'reward', 'completed', {completed_by: 'completed_by_persons.name'});
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
    (typeof questBody.contact === 'string'),
    (Number.isInteger(questBody.reward)),
    ].filter((test) => test).length
  );
}

router
  .get('/', function (req, res, next) {
    fetchQuests()
    .then(function (questsData) {
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(questsData));
    })
  })
  .get('/:quest_id', function (req, res, next) {
    if (isNaN(parseInt(req.params.quest_id))) throw 400;

    fetchQuests()
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(questsData[0]));
    })
    .catch(function (err) {
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .post('/', function (req, res, next) {
    let quest = req.body;

    if (!validBody(quest) || Object.keys(quest).length != 6) {
          throw 400;
        }

    fetchQuests()
    .where('questgivers_persons.contact', quest.contact)
    .andWhere('dungeons.name', quest.dungeon)
    .then(function (questsData) {
      if (questsData.length > 0) throw 400;

      return knex('questgivers')
      .join('persons', 'persons.id', 'questgivers.person_id')
      .select('questgivers.id')
      .where('persons.contact', quest.contact)
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
      return fetchQuests().where('quests.id', quest_id[0])
    })
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(questsData[0]));
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .patch('/:quest_id', function (req, res, next) {
    let quest = req.body;

    if (!validBody(quest)) throw 400;

    fetchQuests()
    .select('questgivers_persons.contact')
    .select({dungeon_id: 'dungeons.id'})
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      res.locals.quest = questsData[0];

      if (questsData.length === 0) throw 404;

      if (typeof quest.contact != 'undefined' &&
          quest.contact != questsData[0].contact) {
            throw 400
          }

      delete quest.contact;

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
      return fetchQuests()
      .where('quests.id', quest_id[0])
    })
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(questsData[0]));
    })
    .catch(function (err) {
      if (err === 400) res.sendStatus(400);
      if (err === 404) res.sendStatus(404);
      if (!res.headersSent) console.error(err);
    })
  })
  .delete('/:quest_id', function (req, res, next) {
    if (isNaN(parseInt(req.params.quest_id))) throw 400;

    fetchQuests()
    .where('quests.id', req.params.quest_id)
    .then(function (questsData) {
      if (questsData.length === 0) throw 404;

      res.locals.quest = questsData[0];

      return knex('quests')
      .del()
      .where('id', req.params.quest_id)
    })
    .then(function () {
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(res.locals.quest));
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
