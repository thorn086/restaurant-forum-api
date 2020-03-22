const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./fixtures');

describe('States Endpoints', function () {
    let db;
   
    const { testStates, testCities, testUsersTwo } = helpers.makeFixtures();
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });


    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE states, users, city CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE states, users, city CASCADE'));

    describe(`GET /api/states`, () => {
        context(`Given no States`, () => {
            it('responds with 201 and an empty array', () => {
                return supertest(app)
                    .get('/api/states')
                    .expect(201, []);
            });
        });
        context(`Given there are states in the db`, () => {
            beforeEach('insert States', () => {
                return db
                    .into('states')
                    .insert(testStates);
            });
            it('GET api/states responds 200 and all of the states', () => {
                return supertest(app)
                    .get('/api/states')
                    .expect(201, testStates);
            });
        });
    });
    //get all cities in a state
    describe(`GET /api/states/:id`, () => {
        context('Given No cities', () => {
            beforeEach('insert users', () => {
                return db
                    .into('users')
                    .insert(testUsersTwo);
            });
            beforeEach('insert States', () => {
                return db
                    .into('states')
                    .insert(testStates);
            });
            beforeEach('insert Cities', () => {
                return db
                    .into('city')
                    .insert(testCities);
            });
            it('responds with 404', () => {
                const id = 3434;
                return supertest(app)
                    .get(`/api/states/${id}`)
                    .expect(404, {});
            });
            it('responds with the correct city', () => {
                const id = 1;
                return supertest(app)
                    .get(`/api/states/${id}`)
                    .expect(200, testCities);
            });
        });
    });
    
});

