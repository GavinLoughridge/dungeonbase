
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('persons', function (table) {
    table.increments();
    table.text('name');
    table.text('contact').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('persons');
};
