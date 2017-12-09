
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('persons', function (table) {
    table.increments();
    table.text('name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('persons');
};
