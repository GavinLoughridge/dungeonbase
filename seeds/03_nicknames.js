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
  return knex('heros').join('users', 'users.id', 'heros.user_id').select({id: 'heros.id'}, {email: 'users.email'})
  .then(function (id_email) {
    let duplicateCheck = [];
    let nicknames = [];

    // add nicknames if they exist
    for (let i = 0; i < herosStrings.length; i++) {
      let hero = herosStrings[i].split(', ');
      // use a combinaton of hero email and nickname to check uniqueness
      let compositeName = hero[1].concat(hero[3]);

      if (!duplicateCheck.includes(compositeName)) {
        duplicateCheck.push(compositeName);

        if (hero[1] != '') {
          nicknames.push({
            hero_id: tableLookup(id_email, 'id', 'email', hero[3]),
            nickname: hero[1]
          })
        }
      }
    }

    // insert nicknames into nicknames table
    return knex('nicknames').insert(nicknames);
  })
};
