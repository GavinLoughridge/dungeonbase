
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('questgivers', function (table) {
    table.increments();
    table.integer('user_id').references('users.id').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('questgivers');
};
