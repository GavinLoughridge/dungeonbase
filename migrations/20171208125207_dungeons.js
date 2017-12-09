
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('dungeons', function (table) {
    table.increments();
    table.text('name');
    table.text('location');
    table.text('map');
    table.integer('danger');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dungeons');
};
