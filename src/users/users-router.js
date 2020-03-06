const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_email, first_name, last_name, password } = req.body

    for (const field of ['user_email', 'first_name', 'last_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const passwordError = UsersService.validatePassword(password)
    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithEmail(
      req.app.get('db'),
      user_email
    )
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res
            .status(400)
            .json({ error: 'Email already exists, please sign in.' })

        return UsersService.hashPassword(password)
          .then(hashPassword => {
            const newUser = {
              user_email,
              first_name,
              last_name,
              password: hashPassword,
              date_created: new Date(),
              date_modified: new Date()
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports =usersRouter