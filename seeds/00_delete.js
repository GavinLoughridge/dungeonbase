
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('quests').del()
    .then(function() {
      return knex('questgivers').del();
    })
    .then(function() {
      return knex('dungeons').del();
    })
    .then(function() {
      return knex('nicknames').del();
    })
    .then(function() {
      return knex('heros').del();
    })
    .then(function() {
      return knex('users').del();
    })
};
