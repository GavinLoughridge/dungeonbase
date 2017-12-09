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
  return knex('persons').select('id', 'person_name')
  .then(function (person_ids) {
    let duplicateCheck = [];
    let questgivers = [];

    // add unique questgivers
    for (let i = 0; i < questsStrings.length; i++) {
      let quest = questsStrings[i].split(', ');
      let name = quest[4];

      if (!duplicateCheck.includes(name)) {
        duplicateCheck.push(name);

        questgivers.push({
          person_id: tableLookup(person_ids, 'id', 'person_name', name)
        })
      }
    }

    // insert questgivers into questgivers table
    return knex('questgivers').insert(questgivers);
  })
};
