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
  return knex('persons').select('id', 'contact')
  .then(function (id_contact) {
    let duplicateCheck = [];
    let heros = [];

    // add unique heros
    for (let i = 0; i < herosStrings.length; i++) {
      let hero = herosStrings[i].split(', ');
      let contact = hero[3];

      if (!duplicateCheck.includes(contact)) {
        duplicateCheck.push(contact);

        heros.push({
          person_id: tableLookup(id_contact, 'id', 'contact', contact),
          talent: hero[2],
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
