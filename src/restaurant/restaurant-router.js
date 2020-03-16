const express = require('express')
const RestService = require('./restaurant-service')
const RestRouter = express.Router()
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


RestRouter
.route('/')
.get((req, res, next) => {
    RestService.getAllRestaurants(req.app.get('db'), req.params.id)
    .then(restaurants => {
        if (!restaurants){
        res.statusMessage='There are no restaurants in this city, you can add one.'
            return (res.status(404).end())
        }
        res.json(restaurants.map(sanitizeRestaurant))
    })
    
    
})
  
    RestRouter
    .route('/:id')
    .get((req, res, next) => {
        RestService.getAllRestaurantsInCity(req.app.get('db'), req.params.id)
        .then(restaurants => {
            if (!restaurants){
            res.statusMessage='There are no restaurants in this city, you can add one.'
                return (res.status(404).end())
            }
            res.json(restaurants.map(sanitizeRestaurant))
        })
        
        
    })
    .delete(requireAuth, bodyParser, (req,res,next)=>{
        const {id}=req.params
        RestService.deleteRestaurant(req.app.get('db'),id)
        .then(affected=>{
            res.status(204).end()
        })
        .catch(next)
    })
  
module.exports = RestRouter