// Store csv files
const fs = require('fs');
const questsFile = fs.readFileSync('./data/Quests.csv','utf8');

// Transform quests file into an array of quest strings
let questsStrings = questsFile.replace(/"/gi, '').split('\n').slice(1,-1);

exports.seed = function(knex, Promise) {
  let duplicateCheck = [];
  let dungeons = [];

  // add unique dungeons
  for (let i = 0; i < questsStrings.length; i++) {
    let quest = questsStrings[i].split(', ');
    // use a dungeon name to check uniqueness
    let name = quest[0];

    if (!duplicateCheck.includes(name)) {
      duplicateCheck.push(name);

      dungeons.push({
        name: name,
        location: quest[1],
        map: quest[2],
        threat: quest[3]
      })
    }
  }

  // insert dungeons into dungeons table
  return knex('dungeons').insert(dungeons)
};
