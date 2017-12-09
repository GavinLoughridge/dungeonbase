
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('quests', function (table) {
    table.increments();
    table.integer('person_id').references('persons.id');
    table.integer('dungeon_id').references('dungeons.id');
    table.integer('reward');
    table.boolean('completed');
    table.integer('hero_id').references('heros.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('quests');
};
