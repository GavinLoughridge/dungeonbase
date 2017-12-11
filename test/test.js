const knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'dungeonbase',
    user:     'xkrhtsbo',
    password: 'avwwoqbk'
  }
});
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);



afterEach(function() {
  // runs after each test in this block
});

describe('API Routes', function() {

  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        })
      })
    })
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    })
  })

  describe('GET /', function() {
    it('should return 404 if path is missing an element', function(done) {
      chai.request(server)
      .get('/')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });
  });

  describe('GET /heros', function() {
    it('should return all heros', function(done) {
      chai.request(server)
      .get('/heros')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.equal(9);
      res.body[0].should.have.property('id');
      res.body[0].id.should.be.a('number');
      res.body[0].should.have.property('name');
      res.body[0].name.should.be.a('string');
      res.body[0].should.have.property('nicknames');
      res.body[0].nicknames.should.be.a('array');
      res.body[0].should.have.property('talent');
      res.body[0].talent.should.be.a('string');
      res.body[0].should.have.property('contact');
      res.body[0].contact.should.be.a('string');
      res.body[0].should.have.property('age');
      res.body[0].age.should.be.a('number');
      res.body[0].should.have.property('price');
      res.body[0].price.should.be.a('number');
      res.body[0].should.have.property('rating');
      res.body[0].rating.should.be.a('number');
      res.body[0].should.have.property('level');
      res.body[0].level.should.be.a('number');
      done();
      });
    });
  });

  describe('GET /heros/1', function() {
    it('should return hero with a specific index', function(done) {
      chai.request(server)
      .get('/heros/1')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('name');
      res.body.name.should.equal('Bilbo Baggins');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal(['Burglar']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Theft');
      res.body.should.have.property('contact');
      res.body.contact.should.equal('barrelrider@gmail.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(31);
      res.body.should.have.property('price');
      res.body.price.should.equal(45);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(7.5);
      res.body.should.have.property('level');
      res.body.level.should.equal(28);
      done();
      });
    });
  });

  describe('GET /heros/0', function() {
    it('should return 404 if index is invalid', function(done) {
      chai.request(server)
      .get('/heros/0')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });
  });

  describe('GET /heros/blarg', function() {
    it('should return 400 if index is of the wrong type', function(done) {
      chai.request(server)
      .get('/heros/blarg')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('POST /', function() {
    it('should return 400 if path is missing an element', function(done) {
      chai.request(server)
      .post('/')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });
  });

  describe('POST /heros', function() {
    it('should return newly created hero regardless if nicknames is empty', function(done) {
      chai.request(server)
      .post('/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: [],
        talent: 'Swords',
        contact: 'founder@metaverse.com',
        age: 43,
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('id');
      res.body.id.should.be.a('number');
      res.body.should.have.property('name');
      res.body.name.should.equal('Hiro Protagonist');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal(['The Deliverator']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Swords');
      res.body.should.have.property('contact');
      res.body.contact.should.equal('founder@metaverse.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(43);
      res.body.should.have.property('price');
      res.body.price.should.equal(23);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(6);
      res.body.should.have.property('level');
      res.body.level.should.equal(18);
      done();
      });
    });
  });

  describe('POST /heros', function() {
    it('should return newly created hero if name is blank and multiple nicknames are included', function(done) {
      chai.request(server)
      .post('/heros')
      .send({
        name: '',
        nicknames: ['The Deliverator', 'Gargoyle'],
        talent: 'Swords',
        contact: 'founder@metaverse.com',
        age: 43,
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('id');
      res.body.id.should.be.a('number');
      res.body.should.have.property('name');
      res.body.name.should.equal('');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal(['The Deliverator']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Swords');
      res.body.should.have.property('contact');
      res.body.contact.should.equal('founder@metaverse.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(43);
      res.body.should.have.property('price');
      res.body.price.should.equal(23);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(6);
      res.body.should.have.property('level');
      res.body.level.should.equal(18);
      done();
      });
    });
  });

  describe('POST /heros', function() {
    it('should return 400 if a field is missing', function(done) {
      chai.request(server)
      .post('/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: ['The Deliverator'],
        talent: 'Swords',
        contact: 'founder@metaverse.com',
        age: 43,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('POST /heros', function() {
    it('should return 400 if a field is of the wrong type', function(done) {
      chai.request(server)
      .post('/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: ['The Deliverator'],
        talent: 'Swords',
        contact: 'founder@metaverse.com',
        age: 'forty',
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('POST /heros/1', function() {
    it('should return 400 if path has erroneous elements', function(done) {
      chai.request(server)
      .post('/heros/1')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });
});
