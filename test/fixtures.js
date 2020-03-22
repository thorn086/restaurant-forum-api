const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [
      {
        id: 22,
        user_email: 'testuser1@gmail.com',
        first_name: 'Test1',
        last_name: 'User1',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z'
      }
    ];
  }

function makeStatesArray(){
    return [
    { id: 1,
        name:'Alabama',   
    },
    { id: 2,
        name:'Arkansas',
    }, 
   ];
}
function makeCitiesArray(){
  return[
    { id: 1,
      name:"Birmingham",
      state_id:1, 
      author:22
    },
    {id:2,
      name:"Anchorage",
      state_id:1,
      author: 22},
    ];
}
function makeRestaurants(){
  return(
    [{id:1,
      name:'McDonalds',
      address:'1500 Lovers Ln',
      phone:'414-555-1001',
      state_id: 1,
      city_id: 1,
      comments:'This is a great location, good service, great food!',
      author: '22'
    }]
  );
}
function makeFixtures() {
    const testUsersTwo = makeUsersArray();
    const testStates = makeStatesArray();
    const testCities =makeCitiesArray();
    const testRestaurants = makeRestaurants();
  
    return { testUsersTwo, testStates, testCities, testRestaurants };
  }
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_email,
      algorithm: 'HS256',
    });
    return `Bearer ${token}`;
  }

  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }));
    return db.into('users').insert(preppedUsers)
      .then(() =>
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      );
  }
module.exports={
    makeStatesArray,
    makeAuthHeader,
    makeUsersArray,
    makeFixtures,
    seedUsers
};