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
  return knex('users').select('id', 'email')
  .then(function (id_email) {
    let duplicateCheck = [];
    let questgivers = [];

    // add unique questgivers
    for (let i = 0; i < questsStrings.length; i++) {
      let quest = questsStrings[i].split(', ');
      let email = quest[4].replace(/\s/g, '').toLowerCase().concat('@dungeonbase.net');

      if (!duplicateCheck.includes(email)) {
        duplicateCheck.push(email);

        questgivers.push({
          user_id: tableLookup(id_email, 'id', 'email', email)
        })
      }
    }

    // insert questgivers into questgivers table
    return knex('questgivers').insert(questgivers);
  })
};
