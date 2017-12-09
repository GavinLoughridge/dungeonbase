// Store csv of heros file
const fs = require('fs');
const herosFile = fs.readFileSync('./data/Heros.csv','utf8');

// Store the heros as an array of heros each of which is an array of attributes
let heros = herosFile.trim().replace(/"/gi, '').split('\n').map((hero) => (hero.split(', ')));
let headers = heros.shift();

function getIdFromContact(contact, ids_contacts) {
  // search thorugh id_contacts for contact and return id, or return false
  for (let i = 0; i < ids_contacts.length; i++) {
    if (ids_contacts[i].contact === contact) {
      return ids_contacts[i].id;
    }
  }

  return false;
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('nicknames').del()
    .then(function() {
      return knex('heros').del();
    })
    .then(function() {
      return knex('persons').del();
    })
    .then(function () {
      // create a formatted person object for each unique hero
      // use contact info to determin uniqueness
      let personsFormatted = [];
      let duplicateCheck = [];

      for (let i = 0; i < heros.length; i++) {
        let contact = heros[i][headers.indexOf('Contact Info')];

        if (!duplicateCheck.includes(contact)) {
          duplicateCheck.push(contact);

          let person = {};
          person['name'] = heros[i][headers.indexOf('Full Name')];
          personsFormatted.push(person);
        }
      }

      // insert formated persons into the persons table and return their person id
      return knex('persons').insert(personsFormatted, 'id');
    })
    .then(function(person_ids) {
      // create a formatted hero object for each unique hero
      // use contact info to determin uniqueness
      let herosFormatted = [];
      let duplicateCheck = [];

      for (let i = 0; i < heros.length; i++) {
        let contact = heros[i][headers.indexOf('Contact Info')];

        if (!duplicateCheck.includes(contact)) {
          duplicateCheck.push(contact);

          let hero = {};
          hero['person_id'] = person_ids.shift();
          hero['talent'] = heros[i][headers.indexOf('Talent')];
          hero['contact'] = contact;
          hero['age'] = heros[i][headers.indexOf('Age')];
          hero['price'] = heros[i][headers.indexOf('Price')];
          hero['rating'] = heros[i][headers.indexOf('Rating')];
          hero['level'] = heros[i][headers.indexOf('Level')];
          herosFormatted.push(hero);
        }
      }

      // insert formated heros into the heros table and return their hero id and contact info
      return knex('heros').insert(herosFormatted, ['id','contact']);
    })
    .then(function (ids_contacts) {
      // create a formatted nickname object for each hero, regardless of uniqueness
      let nicknamesFormatted = [];

      for (let i = 0; i < heros.length; i++) {
        let nickname = {};
        let contact = heros[i][headers.indexOf('Contact Info')];

        nickname['hero_id'] = getIdFromContact(contact, ids_contacts);
        nickname['nickname'] = heros[i][headers.indexOf('Nickname')];

        // only push nickname if getIdFromContact returned a valid hero_id
        if (nickname['hero_id'] && nickname['nickname']) {
          nicknamesFormatted.push(nickname);
        }
      }

      // insert formated nickname into the nicknames table
      return knex('nicknames').insert(nicknamesFormatted);
    });
};
