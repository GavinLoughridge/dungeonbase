const knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'dungeonbase',
    user:     'xkrhtsbo',
    password: 'avwwoqbk'
  }
});

const fs = require('fs');
const herosFile = fs.readFileSync('./data/Heros.csv','utf8').trim().replace(/"/gi, '');

let heros = herosFile.split('\n');

let headers = heros.shift().split(', ');
let duplicateCheck = [];
let namesFormatted = [];
let herosFormatted = [];

for (let i = 0; i < heros.length; i++) {
  heros[i] = heros[i].split(', ');

  let name ={}
  name['name'] = heros[i][headers.indexOf('Full Name')];

  if (!duplicateCheck.includes(name['name'])) {
    duplicateCheck.push(name['name']);
    namesFormatted.push(name);

    let hero = {};
    hero['talent'] = heros[i][headers.indexOf('Talent')];
    hero['contact'] = heros[i][headers.indexOf('Contact Info')];
    hero['age'] = heros[i][headers.indexOf('Age')];
    hero['price'] = heros[i][headers.indexOf('Price')];
    hero['rating'] = heros[i][headers.indexOf('Rating')];
    hero['level'] = heros[i][headers.indexOf('Level')];

    herosFormatted.push(hero);
  };
}
