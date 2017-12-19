
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('heros', function (table) {
    table.increments();
    table.integer('user_id').references('users.id').unique();
    table.text('talent');
    table.integer('age');
    table.integer('price');
    table.float('rating');
    table.integer('level');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('heros');
};
