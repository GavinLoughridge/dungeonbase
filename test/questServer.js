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
      res.body[0].dungeon.should.be.a('object');
      res.body[0].dungeon.shouldhave.property('dungeon_name');
      res.body[0].dungeon.dungeon_name.should.be.a('string');
      res.body[0].dungeon.shouldhave.property('location');
      res.body[0].dungeon.location.should.be.a('string');
      res.body[0].dungeon.shouldhave.property('map');
      res.body[0].dungeon.map.should.be.a('string');
      res.body[0].dungeon.shouldhave.property('threat');
      res.body[0].dungeon.threat.should.be.a('number');
      res.body[0].should.have.property('questgiver');
      res.body[0].questgiver.should.be.a('string');
      res.body[0].should.have.property('reward');
      res.body[0].reward.should.be.a('number');
      res.body[0].should.have.property('completed');
      res.body[0].completed.should.be.a('boolean');
      res.body[0].should.have.property('completed_by');
      res.body[0].completed_by.should.be.a('string');
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
      res.body.id.should.equal('1');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.be.a('object');
      res.body.dungeon.shouldhave.property('dungeon_name');
      res.body.dungeon.dungeon_name.should.equal('Mount Doom');
      res.body.dungeon.shouldhave.property('location');
      res.body.dungeon.location.should.equal('Mordor');
      res.body.dungeon.shouldhave.property('map');
      res.body.dungeon.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.dungeon.shouldhave.property('threat');
      res.body.dungeon.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      res.body.completed_by.should.equal(null);
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
        dungeon: {
          dungeon_name: 'Borg Cube',
          location: 'space',
          map: 'tbd',
          threat: 7
        },
        questgiver: 'Capitan Picard',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.be.a('number');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.be.a('object');
      res.body.dungeon.shouldhave.property('dungeon_name');
      res.body.dungeon.dungeon_name.should.equal('Borg Cube');
      res.body.dungeon.shouldhave.property('location');
      res.body.dungeon.location.should.equal('space');
      res.body.dungeon.shouldhave.property('map');
      res.body.dungeon.map.should.equal('tbd');
      res.body.dungeon.shouldhave.property('threat');
      res.body.dungeon.threat.should.equal(7);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Capitan Picard');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(50);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      res.body.completed_by.should.equal(null);
      done();
      });
    });

    it('should return 400 if dungeon is invalid', function(done) {
      chai.request(server)
      .post('/api/quests')
      .send({
        dungeon: {
          dungeon_name: 'Borg Cube',
          location: 'space',
          map: 100,
          threat: 7
        },
        questgiver: 'Capitan Picard',
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
        dungeon: {
          dungeon_name: 'Borg Cube',
          location: 'space',
          map: 'tbd',
          threat: 7
        },
        questgiver: 'Capitan Picard',
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
        dungeon: {
          dungeon_name: 'Borg Cube',
          location: 'space',
          map: 'tbd',
          threat: 'john'
        },
        questgiver: 'Capitan Picard',
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
        dungeon: {
          name: 'Borg Cube',
          location: 'space',
          map: 'tbd',
          threat: 7
        },
        questgiver: 'Capitan Picard',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(400);
      done();
      });
    });

    it('should return 404 if id is invalid', function(done) {
      chai.request(server)
      .patch('/api/quests/0')
      .send({
        questgiver: 'Capitan Picard',
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
        questgiver: 'Capitan Picard',
        reward: 50
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal('1');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.be.a('object');
      res.body.dungeon.shouldhave.property('dungeon_name');
      res.body.dungeon.dungeon_name.should.equal('Mount Doom');
      res.body.dungeon.shouldhave.property('location');
      res.body.dungeon.location.should.equal('Mordor');
      res.body.dungeon.shouldhave.property('map');
      res.body.dungeon.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.dungeon.shouldhave.property('threat');
      res.body.dungeon.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Capitan Picard');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(50);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      res.body.completed_by.should.equal(null);
      done();
      });
    });

    it('should return updated quest if id and body are valid and contain a new dungeon', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        dungeon: {
          name: 'Borg Cube',
          location: 'space',
          map: 'tbd',
          threat: 7
        }
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal('1');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.be.a('object');
      res.body.dungeon.shouldhave.property('dungeon_name');
      res.body.dungeon.dungeon_name.should.equal('Borg Cube');
      res.body.dungeon.shouldhave.property('location');
      res.body.dungeon.location.should.equal('space');
      res.body.dungeon.shouldhave.property('map');
      res.body.dungeon.map.should.equal('tbd');
      res.body.dungeon.shouldhave.property('threat');
      res.body.dungeon.threat.should.equal(7);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      res.body.completed_by.should.equal(null);
      done();
      });
    });

    it('should return updated hero if id and body are valid and contain an existing dungeon', function(done) {
      chai.request(server)
      .patch('/api/quests/1')
      .send({
        dungeon: {
          name: 'Death Star',
          location: 'Alderaan',
          map: 'https://goo.gl/images/efp9aD',
        }
      })
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.id.should.equal('1');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.be.a('object');
      res.body.dungeon.shouldhave.property('dungeon_name');
      res.body.dungeon.dungeon_name.should.equal('Death Star');
      res.body.dungeon.shouldhave.property('location');
      res.body.dungeon.location.should.equal('Alderaan');
      res.body.dungeon.shouldhave.property('map');
      res.body.dungeon.map.should.equal('https://goo.gl/images/efp9aD');
      res.body.dungeon.shouldhave.property('threat');
      res.body.dungeon.threat.should.equal(7);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      res.body.completed_by.should.equal(null);
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
      res.body.id.should.equal('1');
      res.body.should.have.property('dungeon');
      res.body.dungeon.should.be.a('object');
      res.body.dungeon.shouldhave.property('dungeon_name');
      res.body.dungeon.dungeon_name.should.equal('Mount Doom');
      res.body.dungeon.shouldhave.property('location');
      res.body.dungeon.location.should.equal('Mordor');
      res.body.dungeon.shouldhave.property('map');
      res.body.dungeon.map.should.equal('https://goo.gl/images/Egk7cD');
      res.body.dungeon.shouldhave.property('threat');
      res.body.dungeon.threat.should.equal(3);
      res.body.should.have.property('questgiver');
      res.body.questgiver.should.equal('Gandalf the Grey');
      res.body.should.have.property('reward');
      res.body.reward.should.equal(40);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      res.body.should.have.property('completed_by');
      res.body.completed_by.should.equal(null);
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
