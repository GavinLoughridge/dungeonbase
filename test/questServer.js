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

describe('Quest API Routes', function() {

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

    it('should return all quests if no index is specified', function(done) {
      chai.request(server)
      .get('/api/quests')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.equal(5);
      res.body[0].should.have.property('id');
      res.body[0].id.should.be.a('number');
      res.body[0].should.have.property('dungeon');
      res.body[0].dungeon.should.be.a('string');
      res.body[0].should.have.property('location');
      res.body[0].location.should.be.a('string');
      res.body[0].should.have.property('map');
      res.body[0].map.should.be.a('string');
      res.body[0].should.have.property('threat');
      res.body[0].threat.should.be.a('number');
      res.body[0].should.have.property('questgiver');
      res.body[0].questgiver.should.be.a('string');
      res.body[0].should.have.property('reward');
      res.body[0].reward.should.be.a('number');
      res.body[0].should.have.property('completed');
      res.body[0].completed.should.be.a('boolean');
      res.body[0].should.have.property('completed_by');
      should.equal(res.body[0].completed_by, null);
      done();
      });
    });

    it('should return specific quest if given an index', function(done) {
      chai.request(server)
      .get('/api/quests/1')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Mount Doom');
      res.body.should.have.property('location');
      res.body.location.should.equal('Mordor');
      res.body.should.have.property('map');
      res.body.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
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
    it('should return 400 if path is missing an element', function(done) {
      chai.request(server)
      .post('/')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return newly created quest if body is valid', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: 'Borg Cube',
        location: 'space',
        map: 'tbd',
        threat: 7,
        contact: 'almacoin@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.be.a('number');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Borg Cube');
      res.body.should.have.property('location');
      res.body.location.should.equal('space');
      res.body.should.have.property('map');
      res.body.map.should.equal('tbd');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(7);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Alma Coin');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(50);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
      done();
      });
    });

    it('should return 400 if questgiver already has a quest for this dungeon', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: 'The Capital',
        location: 'space',
        map: 'tbd',
        threat: 7,
        contact: 'almacoin@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if questgiver contact does not exist', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: 'The Capital',
        location: 'space',
        map: 'tbd',
        threat: 7,
        contact: 'bob@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if dungeon is invalid', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: 'Borg Cube',
        location: 'space',
        map: 100,
        threat: 7,
        contact: 'almacoin@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if a quest is invalid', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: 'Borg Cube',
        location: 'space',
        map: 'tbd',
        threat: 7,
        contact: 'almacoin@dungeonbase.net',
        reward: 50,
        name: 'john'
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if a field is of the wrong type', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: 'Borg Cube',
        location: 'space',
        map: 'tbd',
        threat: 'john',
        contact: 'almacoin@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if path has erroneous elements', function(done) {
      chai.request(server)
      .post('/api/quests/1')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });
  });

  describe('PATCH', function() {
    it('should return 400 if index is missing', function(done) {
      chai.request(server)
      .patch('/api/quests')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if body is invalid', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        name: 'Borg Cube',
        location: 'space',
        map: 'tbd',
        threat: 7,
        contact: 'almacoin@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if body contains contact change', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        contact: 'almacoin@dungeonbase.net'
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return updated quest if body contains same contact', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        contact: 'gandalfthegrey@dungeonbase.net',
        reward: 2
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Mount Doom');
      res.body.should.have.property('location');
      res.body.location.should.equal('Mordor');
      res.body.should.have.property('map');
      res.body.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(2);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
      done();
      });
    });

    it('should return 404 if id is invalid', function(done) {
      chai.request(server)
      .patch('/api/quests/0')
      .send({
        contact: 'almacoin@dungeonbase.net',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return updated quest if id and body are valid', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Mount Doom');
      res.body.should.have.property('location');
      res.body.location.should.equal('Mordor');
      res.body.should.have.property('map');
      res.body.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(50);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
      done();
      });
    });

    it('should return updated quest if id and body are valid and contain a new dungeon', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        dungeon: 'Borg Cube',
        location: 'space',
        map: 'tbd',
        threat: 7
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Borg Cube');
      res.body.should.have.property('location');
      res.body.location.should.equal('space');
      res.body.should.have.property('map');
      res.body.map.should.equal('tbd');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(7);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
      done();
      });
    });

    it('should return updated quest if id and body are valid and contain an existing dungeon', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        dungeon: 'Death Star',
        location: 'Alderaan',
        map: 'https://goo.gl/images/efp9aD'
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Death Star');
      res.body.should.have.property('location');
      res.body.location.should.equal('Alderaan');
      res.body.should.have.property('map');
      res.body.map.should.equal('https://goo.gl/images/efp9aD');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(7);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
      done();
      });
    });
  })

  describe('DELETE', function() {
    it('should return 400 if index is missing', function(done) {
      chai.request(server)
      .delete('/api/quests')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 400 if index is non-numeric', function(done) {
      chai.request(server)
      .delete('/api/quests/blarg')
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 404 if quest can not be found', function(done) {
      chai.request(server)
      .delete('/api/heros/0')
      .end(function(err, res) {
      res.should.have.status(404);
      done();
      });
    });

    it('should return deleted quest if index is valid', function(done) {
      chai.request(server)
      .delete('/api/quests/1')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal(1);
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.equal('Mount Doom');
      res.body.should.have.property('location');
      res.body.location.should.equal('Mordor');
      res.body.should.have.property('map');
      res.body.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.should.have.property('threat');
      res.body.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      should.equal(res.body.completed_by, null);
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
