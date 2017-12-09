// Store csv of quests file
const fs = require('fs');
const questsFile = fs.readFileSync('./data/Quest.csv','utf8');

// Store the quests as an array of quests each of which is an array of attributes
let quests = questsFile.trim().replace(/"/gi, '').split('\n').map((quest) => (quest.split(', ')));
let headers = quests.shift();

function getIdFromContact(contact, ids_contacts) {
  // search thorugh id_contacts for contact and return id, or return false
  for (let i = 0; i < ids_contacts.length; i++) {
    if (ids_contacts[i].contact === contact) {
      return ids_contacts[i].id;
    }
  }

  return false;
}

// save dungeon ids outside of promise for use while building quests
let dungeonIds = [];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('quests').del()
    .then(function() {
      return knex('questgivers').del();
    })
    .then(function() {
      return knex('dungeons').del();
    })
    .then(function () {
      // create a formatted dungeon object for each unique dungeon
      // use dungeon name to determin uniqueness
      let dungeonsFormatted = [];
      let duplicateCheck = [];

      for (let i = 0; i < quests.length; i++) {
        let dungeonName = quests[i][headers.indexOf('Dungeon Name')];

        if (!duplicateCheck.includes(dungeonName)) {
          duplicateCheck.push(dungeonName);

          let dungeon = {};
          dungeon['name'] = dungeonName;
          dungeon['location'] = quests[i][headers.indexOf('Dungeon Location')];
          dungeon['map'] = quests[i][headers.indexOf('Dungeon Map')];
          dungeon['danger'] = quests[i][headers.indexOf('Dungeon Threat')];
          dungeonsFormatted.push(dungeon);
        }
      }

      // insert formated dungeons into the dungeons table and return their dungeon id
      return knex('dungeons').insert(dungeonsFormatted, 'id');
    })
    .then(function(dungeon_ids) {
      // store dungeon ids outside of promise for use while building quests
      dungeonIds = dungeon_ids;
      // create a formatted questgiver object for each unique questgiver
      // use contact info to determin uniqueness
      let questgiversFormatted = [];
      let duplicateCheck = [];

      for (let i = 0; i < quests.length; i++) {
        let contact = quests[i][headers.indexOf('Contact Info')];

        if (!duplicateCheck.includes(contact)) {
          duplicateCheck.push(contact);

          let quest = {};
          quest['_id'] = person_ids.shift();
          quest['talent'] = quests[i][headers.indexOf('Talent')];
          quest['contact'] = contact;
          quest['age'] = quests[i][headers.indexOf('Age')];
          quest['price'] = quests[i][headers.indexOf('Price')];
          quest['rating'] = quests[i][headers.indexOf('Rating')];
          quest['level'] = quests[i][headers.indexOf('Level')];
          questsFormatted.push(quest);
        }
      }

      // insert formated quests into the quests table and return their quest id and contact info
      return knex('quests').insert(questsFormatted, ['id','contact']);
    })
    .then(function (ids_contacts) {
      // create a formatted nickname object for each quest, regardless of uniqueness
      let nicknamesFormatted = [];

      for (let i = 0; i < quests.length; i++) {
        let nickname = {};
        let contact = quests[i][headers.indexOf('Contact Info')];

        nickname['quest_id'] = getIdFromContact(contact, ids_contacts);
        nickname['nickname'] = quests[i][headers.indexOf('Nickname')];

        // only push nickname if getIdFromContact returned a valid quest_id
        if (nickname['quest_id'] && nickname['nickname']) {
          nicknamesFormatted.push(nickname);
        }
      }

      // insert formated nickname into the nicknames table
      return knex('nicknames').insert(nicknamesFormatted);
    });
};
