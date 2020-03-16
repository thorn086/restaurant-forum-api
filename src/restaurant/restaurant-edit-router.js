const express = require('express')
const RestService = require('./restaurant-service')
const EditRouter = express.Router()
const path = require('path')
const {requireAuth}=require('../middleware/jwt-auth')
const xss = require('xss')
const bodyParser = express.json()
//const { requireAuth } = require('../middleware/jwt-auth')



const sanitizeRestaurant = restaurant => ({
    id: restaurant.id,
    name: xss(restaurant.name),
    address: xss(restaurant.address),
    phone: xss(restaurant.phone),
    state_id: restaurant.state_id,
    city_id: restaurant.city_id,
    author: xss(restaurant.author),
    comments: xss(restaurant.comments)
})

EditRouter
.route('/:id')
.get((req, res, next) => {
    RestService.getRestaurantById(req.app.get('db'), req.params.id)
    .then(restaurants => {
        if (!restaurants){
        res.statusMessage='There are no restaurants in this city, you can add one.'
            return (res.status(404).end())
        }
        res.json(restaurants.map(sanitizeRestaurant))
    })
})
.patch(requireAuth, bodyParser, (req,res, next)=>{
    const {address, phone, comments, author}=req.body
    const updatedRestaurant={address, phone,comments,author}
    for (const [key, num] of Object.entries(updatedRestaurant))
      if (num == 0)
        return res.status(400).json({
          error: { message: `Body must contain updated content` }
        })
       RestService.updateRestaurant(req.app.get('db'),req.params.id, updatedRestaurant) 
       .then(restaurant => {
        res.status(204).end()
      })
      .catch(next)
})
module.exports= EditRouter