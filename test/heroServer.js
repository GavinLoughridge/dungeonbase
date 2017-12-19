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

describe('Hero API Routes', function() {

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

  describe('GET', function() {
    it('should return 404 if path is missing an element', function(done) {
      chai.request(server)
      .get('/')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return all heros if no index is specified', function(done) {
      chai.request(server)
      .get('/api/heros')
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
      res.body[0].should.have.property('email');
      res.body[0].email.should.be.a('string');
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

    it('should return specific hero if given an index', function(done) {
      chai.request(server)
      .get('/api/heros/1')
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
      res.body.should.have.property('email');
      res.body.email.should.equal('barrelrider@gmail.com');
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

    it('should return 404 if index is invalid', function(done) {
      chai.request(server)
      .get('/api/heros/0')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return 400 if index is of the wrong type', function(done) {
      chai.request(server)
      .get('/api/heros/blarg')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('POST', function() {
    it('should return 404 if path is missing an element', function(done) {
      chai.request(server)
      .post('/')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return newly created hero if body is valid', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: ['the deliverator'],
        talent: 'Swords',
        email: 'founder@metaverse.com',
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
      res.body.nicknames.should.deep.equal(['the deliverator']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Swords');
      res.body.should.have.property('email');
      res.body.email.should.equal('founder@metaverse.com');
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

    it('should return newly created hero regardless if nicknames is empty', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: [],
        talent: 'Swords',
        email: 'founder@metaverse.com',
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
      res.body.nicknames.should.deep.equal([]);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Swords');
      res.body.should.have.property('email');
      res.body.email.should.equal('founder@metaverse.com');
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

    it('should return newly created hero if email is existing non-hero user', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Mon Mothma',
        nicknames: [],
        talent: 'Command',
        email: 'monmothma@dungeonbase.net',
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
      res.body.id.should.equal(10);
      res.body.should.have.property('name');
      res.body.name.should.equal('Mon Mothma');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal([]);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Command');
      res.body.should.have.property('email');
      res.body.email.should.equal('monmothma@dungeonbase.net');
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

    it('should return newly created hero if name is existing hero user', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Bilbo Baggins',
        nicknames: [],
        talent: 'Command',
        email: 'newemail@web.net',
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
      res.body.id.should.equal(10);
      res.body.should.have.property('name');
      res.body.name.should.equal('Bilbo Baggins');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal([]);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Command');
      res.body.should.have.property('email');
      res.body.email.should.equal('newemail@web.net');
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

    it('should return 400 if hero email alreay exists', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Bilbo Baggins',
        nicknames: [],
        talent: 'Command',
        email: 'barrelrider@gmail.com',
        age: 43,
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if a field is missing', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: ['The Deliverator'],
        talent: 'Swords',
        email: 'founder@metaverse.com',
        age: 43,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if a field is of the wrong type', function(done) {
      chai.request(server)
      .post('/api/heros')
      .send({
        name: 'Hiro Protagonist',
        nicknames: ['The Deliverator'],
        talent: 'Swords',
        email: 'founder@metaverse.com',
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

    it('should return 400 if path has erroneous elements', function(done) {
      chai.request(server)
      .post('/api/heros/1')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('PATCH', function() {
    it('should return 400 if index is missing', function(done) {
      chai.request(server)
      .patch('/api/heros')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if body is invalid', function(done) {
      chai.request(server)
      .patch('/api/heros/1')
      .send({
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

    it('should return 404 if id is invalid', function(done) {
      chai.request(server)
      .patch('/api/heros/0')
      .send({
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return updated hero if id and body are valid', function(done) {
      chai.request(server)
      .patch('/api/heros/1')
      .send({
        price: 23,
        rating: 6,
        level: 18
      })
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
      res.body.should.have.property('email');
      res.body.email.should.equal('barrelrider@gmail.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(31);
      res.body.should.have.property('price');
      res.body.price.should.equal(23);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(6);
      res.body.should.have.property('level');
      res.body.level.should.equal(18);
      done();
      });
    });

    it('should return updated hero if id and body are valid and contain a new name', function(done) {
      chai.request(server)
      .patch('/api/heros/1')
      .send({
        name: 'blarg',
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('name');
      res.body.name.should.equal('blarg');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal(['Burglar']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Theft');
      res.body.should.have.property('email');
      res.body.email.should.equal('barrelrider@gmail.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(31);
      res.body.should.have.property('price');
      res.body.price.should.equal(23);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(6);
      res.body.should.have.property('level');
      res.body.level.should.equal(18);
      done();
      });
    });

    it('should return updated hero if id and body are valid and contain an existing name', function(done) {
      chai.request(server)
      .patch('/api/heros/1')
      .send({
        name: 'Mon Mothma',
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('name');
      res.body.name.should.equal('Mon Mothma');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal(['Burglar']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Theft');
      res.body.should.have.property('email');
      res.body.email.should.equal('barrelrider@gmail.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(31);
      res.body.should.have.property('price');
      res.body.price.should.equal(23);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(6);
      res.body.should.have.property('level');
      res.body.level.should.equal(18);
      done();
      });
    });

    it('should return 400 it contains an diferent and existing email', function(done) {
      chai.request(server)
      .patch('/api/heros/1')
      .send({
        email: 'monmothma@dungeonbase.net',
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return updated hero if id and body are valid and contain nicknames', function(done) {
      chai.request(server)
      .patch('/api/heros/1')
      .send({
        nicknames: ['blarg', 'foo', 'bar'],
        price: 23,
        rating: 6,
        level: 18
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('name');
      res.body.name.should.equal('Bilbo Baggins');
      res.body.should.have.property('nicknames');
      res.body.nicknames.should.deep.equal(['blarg', 'foo', 'bar']);
      res.body.should.have.property('talent');
      res.body.talent.should.equal('Theft');
      res.body.should.have.property('email');
      res.body.email.should.equal('barrelrider@gmail.com');
      res.body.should.have.property('age');
      res.body.age.should.equal(31);
      res.body.should.have.property('price');
      res.body.price.should.equal(23);
      res.body.should.have.property('rating');
      res.body.rating.should.equal(6);
      res.body.should.have.property('level');
      res.body.level.should.equal(18);
      done();
      });
    });
  })

  describe('DELETE', function() {
    it('should return 400 if index is missing', function(done) {
      chai.request(server)
      .delete('/api/heros')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if index is non-numeric', function(done) {
      chai.request(server)
      .delete('/api/heros/blarg')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 404 if hero can not be found', function(done) {
      chai.request(server)
      .delete('/api/heros/0')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return deleted hero if index is valid', function(done) {
      chai.request(server)
      .delete('/api/heros/1')
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
        res.body.should.have.property('email');
        res.body.email.should.equal('barrelrider@gmail.com');
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

  describe('PUT', function() {
    it('should return 405 if put request is recived', function(done) {
      chai.request(server)
      .put('/api/heros')
      .end(function(err, res) {
      res.should.have.status(405);
      done();
      });
    });
  });
});
