// Store csv files
const fs = require('fs');
const herosFile = fs.readFileSync('./data/Heros.csv','utf8');

// Transform heros file into an array of hero strings
let herosStrings = herosFile.replace(/"/gi, '').split('\n').slice(1,-1);

function tableLookup(table, returnCol, valueCol, value) {
  for (let row = 0; row < table.length; row++) {
    if (table[row][valueCol] === value) {
      return table[row][returnCol]
    }
  }
}

exports.seed = function(knex, Promise) {
  return knex('heros').select('id', 'contact')
  .then(function (hero_ids) {
    let duplicateCheck = [];
    let nicknames = [];

    // add nicknames if they exist
    for (let i = 0; i < herosStrings.length; i++) {
      let hero = herosStrings[i].split(', ');
      // use a combinaton of hero name and nickname to check uniqueness
      let compositeName = hero[0].concat(hero[1]);

      if (!duplicateCheck.includes(compositeName)) {
        duplicateCheck.push(compositeName);

        if (hero[1] != '') {
          nicknames.push({
            hero_id: tableLookup(hero_ids, 'id', 'contact', hero[3]),
            nickname: hero[1]
          })
        }
      }
    }

    // insert nicknames into nicknames table
    return knex('nicknames').insert(nicknames);
  })
};
