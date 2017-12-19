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

describe('Questgiver API Routes', function() {

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
    it('should return 405 if get request is recived', function(done) {
      chai.request(server)
      .get('/api/questgivers')
      .end(function(err, res) {
      res.should.have.status(405);
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

    it('should return newly created questgiver if body is valid', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        name: 'Hiro Protagonist',
        email: 'founder@metaverse.com'
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('name');
      res.body.name.should.equal('Hiro Protagonist');
      res.body.should.have.property('email');
      res.body.email.should.equal('founder@metaverse.com');
      done();
      });
    });

    it('should return 400 if names is empty', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        email: 'founder@metaverse.com'
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if email is missing', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        name: 'Mon Mothma'
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if email is existing questgiver user', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        email: 'monmothma@dungeonbase.net'
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return new questgiver object if email is existing hero user', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        name: 'Bilbo Baggins',
        email: 'barrelrider@gmail.com'
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('name');
      res.body.name.should.equal('Bilbo Baggins');
      res.body.should.have.property('email');
      res.body.email.should.equal('barrelrider@gmail.com');
      done();
      });
    });

    it('should return 400 there is an extra field', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        name: 'Hiro Protagonist',
        talent: 'Swords',
        email: 'founder@metaverse.com'
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if a field is of the wrong type', function(done) {
      chai.request(server)
      .post('/api/questgivers')
      .send({
        name: 'Hiro Protagonist',
        email: 17
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if path has erroneous elements', function(done) {
      chai.request(server)
      .post('/api/questgivers/1')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('PATCH', function() {
    it('should return 405 if patch request is recived', function(done) {
      chai.request(server)
      .patch('/api/questgivers')
      .end(function(err, res) {
      res.should.have.status(405);
      done();
      });
    });
  });

  describe('DELETE', function() {
    it('should return 405 if delete request is recived', function(done) {
      chai.request(server)
      .delete('/api/questgivers')
      .end(function(err, res) {
      res.should.have.status(405);
      done();
      });
    });
  });

  describe('PUT', function() {
    it('should return 405 if put request is recived', function(done) {
      chai.request(server)
      .put('/api/questgivers')
      .end(function(err, res) {
      res.should.have.status(405);
      done();
      });
    });
  });
});
