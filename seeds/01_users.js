// Store csv files
const fs = require('fs');
const herosFile = fs.readFileSync('./data/Heros.csv','utf8');
const questsFile = fs.readFileSync('./data/Quests.csv','utf8');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// Split files into arrays of strings
let herosStrings = herosFile.replace(/"/gi, '').split('\n').slice(1,-1);
let questsStrings = questsFile.replace(/"/gi, '').split('\n').slice(1,-1);

exports.seed = function(knex, Promise) {
  let duplicateCheck = [];
  let users = [];

  // add unique users from hero names
  for (let i = 0; i < herosStrings.length; i++) {
    let hero = herosStrings[i].split(', ');
    let email = hero[3];

    if (!duplicateCheck.includes(email)) {
      duplicateCheck.push(email);

      users.push({
        name: hero[0],
        email: email,
        password: bcrypt.hashSync('hero', salt)
      })
    }
  }

  // add unique users from questgiver names
  for (let i = 0; i < questsStrings.length; i++) {
    let quest = questsStrings[i].split(', ');
    let name = quest[4];
    let email = name.replace(/\s/g, '').toLowerCase().concat('@dungeonbase.net');

    if (!duplicateCheck.includes(email)) {
      duplicateCheck.push(email);

      users.push({
        name: name,
        email: email,
        password: bcrypt.hashSync('quest', salt)
      })
    }
  }

  // insert users into users table
  return knex('users').insert(users);
};
