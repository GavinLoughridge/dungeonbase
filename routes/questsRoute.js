const express = require('express');
const router = express.Router();

router
  .get('/', function (req, res) {
    console.log('getting all quests');
    res.sendStatus(200);
  })
  .get('/:quest_id', function (req, res) {
    console.log('getting quests with id', quest_id);
    res.sendStatus(200);
  })
  .post('/', function (req, res) {
    console.log('posting hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .put('/', function (req, res) {
    console.log('puting hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .patch('/', function (req, res) {
    console.log('patching hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .delete('/', function (req, res) {
    console.log('deleting hero with id', req.params.quest_id);
    res.sendStatus(200);
  })
  .use(function (req, res) {
    if (!res.headersSent) {
      res.sendStatus(400);
    }
  })

module.exports = router;
