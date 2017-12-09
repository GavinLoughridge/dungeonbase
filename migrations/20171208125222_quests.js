
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('quests', function (table) {
    table.increments();
    table.integer('questgiver_id').references('questgivers.id');
    table.integer('dungeon_id').references('dungeons.id');
    table.integer('reward');
    table.boolean('completed');
    table.integer('completed_by').references('heros.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('quests');
};
