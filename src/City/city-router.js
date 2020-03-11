const express = require('express')
const CityService = require('./city-services')
const CityRouter = express.Router()
const path = require('path')
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


CityRouter
    .route('/')
    .get((req, res, next) => {
        CityService.getAllRestaurants(req.app.get('db'), req.params.id)
        .then(restaurants => {
            if (!restaurants){
            res.statusMessage='There are no restaurants in this city, you can add one.'
                return (res.status(404).end())
            }
            res.json(restaurants.map(sanitizeRestaurant))
        })
        
        
    })
CityRouter
    .route('/:id')
    .get((req, res, next) => {
        CityService.getAllRestaurantsInCity(req.app.get('db'), req.params.id)
        .then(restaurants => {
            if (!restaurants){
            res.statusMessage='There are no restaurants in this city, you can add one.'
                return (res.status(404).end())
            }
            res.json(restaurants.map(sanitizeRestaurant))
        })
        
        
    })
    .post(bodyParser, (req,res,next)=>{
        const {name, address, phone, state_id, city_id, comments}=req.body
        const newRestaurant = {name, address, phone, state_id, city_id,comments}
        for(const [key, value] of Object.entries(newRestaurant)){
            if (value == null){
                res.statusMessage= `Missing ${key} in request`
                return (res.status(400).end())
            } 
        }
            CityService.addRestaurant(req.app.get('db'), newRestaurant)
            .then(Restaurant=>{
                res
                .status(201)
                .location(path.posix.join(req.originalUrl))
                .json(sanitizeRestaurant(Restaurant))
            })
            .catch(next)
       
    })
  
module.exports = CityRouter