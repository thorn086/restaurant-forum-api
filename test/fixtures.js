const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    ]
  }

function makeStatesArray(){
    return [
    { id: 1,
        name:'Alabama',   
    },
    { id: 2,
        name:'Arkansas',
    }, 
    { id: 3,
        name:'Alaska',
    }, 
    { id: 4,
        name:'Arizona',
    }]
}
function makeFixtures() {
    const testUsers = makeUsersArray()
    const testStates = makeStatesArray()
  
    return { testUsers, testStates }
  }
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_email,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }

  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('wine_users').insert(preppedUsers)
      .then(() =>
        db.raw(
          `SELECT setval('wine_users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }
module.exports={
    makeStatesArray,
    makeAuthHeader,
    makeUsersArray,
    makeFixtures,
    seedUsers
}