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
  return knex('persons').select('id', 'person_name')
  .then(function (person_ids) {
    let duplicateCheck = [];
    let heros = [];

    // add unique heros
    for (let i = 0; i < herosStrings.length; i++) {
      let hero = herosStrings[i].split(', ');
      let name = hero[0];

      if (!duplicateCheck.includes(name)) {
        duplicateCheck.push(name);

        heros.push({
          person_id: tableLookup(person_ids, 'id', 'person_name', name),
          talent: hero[2],
          contact: hero[3],
          age: hero[4],
          price: hero[5],
          rating: hero[6],
          level: hero[7]
        })
      }
    }

    // insert heros into heros table
    return knex('heros').insert(heros);
  })
};
