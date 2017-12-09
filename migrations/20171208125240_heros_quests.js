
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('heros_quests', function (table) {
    table.integer('hero_id').references('heros.id');
    table.integer('quest_id').references('quests.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('heros_quests');
};
