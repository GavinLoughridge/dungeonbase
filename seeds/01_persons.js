// Store csv files
const fs = require('fs');
const herosFile = fs.readFileSync('./data/Heros.csv','utf8');
const questsFile = fs.readFileSync('./data/Quests.csv','utf8');

// Split files into arrays of strings
let herosStrings = herosFile.replace(/"/gi, '').split('\n').slice(1,-1);
let questsStrings = questsFile.replace(/"/gi, '').split('\n').slice(1,-1);

exports.seed = function(knex, Promise) {
  let duplicateCheck = [];
  let persons = [];

  // add unique persons from hero names
  for (let i = 0; i < herosStrings.length; i++) {
    let hero = herosStrings[i].split(', ');
    let contact = hero[3];

    if (!duplicateCheck.includes(contact)) {
      duplicateCheck.push(contact);

      persons.push({
        name: hero[0],
        contact: contact
      })
    }
  }

  // add unique persons from questgiver names
  for (let i = 0; i < questsStrings.length; i++) {
    let quest = questsStrings[i].split(', ');
    let name = quest[4];
    let contact = name.replace(/\s/g, '').toLowerCase().concat('@dungeonbase.net');

    if (!duplicateCheck.includes(contact)) {
      duplicateCheck.push(contact);

      persons.push({
        name: name,
        contact: contact
      })
    }
  }

  // insert persons into persons table
  return knex('persons').insert(persons);
};
