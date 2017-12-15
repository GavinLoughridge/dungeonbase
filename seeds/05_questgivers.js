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
  return knex('persons').select('id', 'contact')
  .then(function (id_contact) {
    let duplicateCheck = [];
    let questgivers = [];

    // add unique questgivers
    for (let i = 0; i < questsStrings.length; i++) {
      let quest = questsStrings[i].split(', ');
      let contact = quest[4].replace(/\s/g, '').toLowerCase().concat('@dungeonbase.net');

      if (!duplicateCheck.includes(contact)) {
        duplicateCheck.push(contact);

        questgivers.push({
          person_id: tableLookup(id_contact, 'id', 'contact', contact)
        })
      }
    }

    // insert questgivers into questgivers table
    return knex('questgivers').insert(questgivers);
  })
};
