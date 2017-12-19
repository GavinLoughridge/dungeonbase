// Store csv files
const fs = require('fs');
const questsFile = fs.readFileSync('./data/Quests.csv','utf8');

// Transform quests file into an array of quest strings
let questsStrings = questsFile.replace(/"/gi, '').split('\n').slice(1,-1);

function tableLookup(table, returnCol, valueCol, value) {
  for (let row = 0; row < table.length; row++) {
    if (table[row][valueCol] === value) {
      return table[row][returnCol]
    }
  }
}

exports.seed = function(knex, Promise) {
  return knex('dungeons').crossJoin('questgivers').join('users','questgivers.user_id','users.id').select({dungeon_id: 'dungeons.id'}, {dungeon_name: 'dungeons.name'}, {questgiver_id: 'questgivers.id'}, {questgiver_email: 'users.email'})
  .then(function (dungeonId_name_questgiverId_email) {
    let duplicateCheck = [];
    let quests = [];

    // add unique quests
    for (let i = 0; i < questsStrings.length; i++) {
      let quest = questsStrings[i].split(', ');
      // use a combinaton of dungeon name and questgiver email to check uniqueness
      let compositeName = quest[0].concat(quest[4].replace(/\s/g, '').toLowerCase().concat('@dungeonbase.net'));

      if (!duplicateCheck.includes(compositeName)) {
        duplicateCheck.push(compositeName);

        quests.push({
          questgiver_id: tableLookup(dungeonId_name_questgiverId_email, 'questgiver_id', 'questgiver_email', quest[4].replace(/\s/g, '').toLowerCase().concat('@dungeonbase.net')),
          dungeon_id: tableLookup(dungeonId_name_questgiverId_email, 'dungeon_id', 'dungeon_name', quest[0]),
          reward: quest[5]
        })
      }
    }

    // insert quests into quests table
    return knex('quests').insert(quests);
  })
};
