
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('quests', function (table) {
    table.increments();
    table.integer('questgiver_id').references('questgivers.id').onDelete('cascade');
    table.integer('dungeon_id').references('dungeons.id');
    table.integer('reward');
    table.boolean('completed');
    table.integer('completed_by').references('persons.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('quests');
};
