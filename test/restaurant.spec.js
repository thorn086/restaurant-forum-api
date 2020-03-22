const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./fixtures');

describe('Restaurant Endpoints', function () {
    let db;

    const {testStates, testCities, testUsersTwo, testRestaurants} = helpers.makeFixtures();
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });


    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE states, users, city, restaurants CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE states, users, city, restaurants CASCADE'));

    describe(`GET /api/restaurant`, () => {
        context(`Given no restaurants`, () => {
            it('responds with 200 and an empty array', () => {
                return supertest(app)
                    .get('/api/restaurant')
                    .expect(200, []);
            });
        });
        context(`Given there are restarants in the db`, () => {
            beforeEach('insert restaurants', () => {
                return db
                    .into('restaurants')
                    .insert(testRestaurants);
            });
        });
    });

    describe(`GET /api/restaurant/:id`, () => {
        context('Given No restaurant', () => {
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
            beforeEach('insert Restaurants', () => {
                return db
                    .into('restaurants')
                    .insert(testRestaurants);
            });
           
            it('responds with 404', () => {
                const id = 3434;
                return supertest(app)
                    .get(`/api/city/${id}`)
                    .expect(404,{});
            });
            it('responds with the correct restaurants',()=>{
                const id = 1;
                return supertest(app)
                    .get(`/api/restaurant/${id}`)
                    .expect(200, testRestaurants);
            });
        });
    });
});
