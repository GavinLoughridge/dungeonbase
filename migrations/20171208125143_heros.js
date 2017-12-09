
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('heros', function (table) {
    table.increments();
    table.integer('person_id').references('persons.id');
    table.text('talent');
    table.text('contact');
    table.integer('age');
    table.integer('price');
    table.float('rating');
    table.integer('level');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('heros');
};
