const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { makeUsersArray, makeAuthHeader } = require('./fixtures');

function seedUsers(users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 12),
  }));
  return preppedUsers;
}


describe('Auth Endpoints', () => {
  let db;
  const testUsers = makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw(`TRUNCATE users RESTART IDENTITY CASCADE`));

  afterEach('clean the table', () => db.raw(`TRUNCATE users CASCADE`));

  describe('POST /api/auth/login', () => {
    const preppedUsers = seedUsers(testUsers);
    beforeEach('insert users', () => db
      .into('users')
      .insert(preppedUsers));

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const userValidCreds = {
        user_email: testUser.user_email,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_email,
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
          userId: testUser.id
        });
    });
  });
});