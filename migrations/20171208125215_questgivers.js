
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('questgivers', function (table) {
    table.increments();
    table.integer('person_id').references('persons.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('questgivers');
};
