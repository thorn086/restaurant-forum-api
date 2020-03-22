const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./fixtures');

describe('Users Endpoints', function() {
  let db;

  let testUsers = [
    {
      id: 1,
      user_email: 'testuser1@gmail.com',
      first_name: 'Test1',
      last_name: 'User1',
      password: 'password'
    },
    {
      id: 2,
      user_email: 'testuser2@gmail.com',
      first_name: 'Test2',
      last_name: 'User2',
      password: 'password'
    },
    {
      id: 3,
      user_email: 'testuser3@gmail.com',
      first_name: 'Test3',
      last_name: 'User3',
      password: 'password'
    },
    {
      id: 4,
      user_email: 'testuser4@gmail.com',
      first_name: 'Test4',
      last_name: 'User4',
      password: 'password'
    }
  ];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw(`TRUNCATE users RESTART IDENTITY CASCADE`));

  beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

  afterEach('clean the table', () => db.raw(`TRUNCATE users RESTART IDENTITY CASCADE`));

  describe(`POST /api/users`, () => {
    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          user_email: 'test user_email',
          password: '11AAaa!!',
          first_name: 'test first_name',
          last_name: 'test last_name'
        };
        return supertest(app)
          .post('/api/users')
          .set('Content-Type', 'application/json')
          .set('Authorization', helpers.makeAuthHeader(newUser))
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body.user_email).to.eql(newUser.user_email);
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body.last_name).to.eql(newUser.last_name);
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
          })
          .expect(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_email).to.eql(newUser.user_email);
                expect(row.first_name).to.eql(newUser.first_name);
                expect(row.last_name).to.eql(newUser.last_name);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.equal(true);
              })
          );
      });
    });
  });
});