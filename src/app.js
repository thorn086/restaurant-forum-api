require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { CLIENT_ORIGIN} = require('./config')
const errorHandler = require('./error-handler')
const StatesRouter = require('./states/state-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const EditRouter = require('./restaurant/restaurant-edit-router')
const CityRouter = require('./City/city-router')
const RestRouter = require('./restaurant/restaurant-router')
const app = express()

const morganOption = (NODE_ENV === 'production' 
  ? 'tiny'
  : 'common')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
  //{origin: CLIENT_ORIGIN}

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(errorHandler)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/states', StatesRouter)
app.use('/api/city', CityRouter)
app.use('/api/restaurant', RestRouter)
app.use('/api/editrestaurant', EditRouter)





module.exports = app