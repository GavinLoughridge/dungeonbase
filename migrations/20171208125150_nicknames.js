
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('nicknames', function (table) {
    table.integer('hero_id').references('heros.id').onDelete('cascade');
    table.text('nickname');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('nicknames');
};
