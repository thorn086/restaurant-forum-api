const express = require('express')
const StatesService = require('./states-services')
const StatesRouter = express.Router()
const path = require('path')
const xss = require('xss')
const {requireAuth}=require('../middleware/jwt-auth')
const bodyParser = express.json()

const sanitizeStates = state => ({
    id: state.id,
    name: xss(state.name)
})

const sanitizeCity = city => ({
    id: city.id,
    name: xss(city.name),
    state_id: city.state_id,
    author: city.author
})

StatesRouter
    .route('/')
    .get((req, res, next) => {
        StatesService.getAllStates(req.app.get('db'))
            .then(state => {
                res.status(201).json(state.map(sanitizeStates))
            })
            .catch((error) => {
                next(error)
            })
    })

StatesRouter
    .route('/:id')
    .get((req, res, next) => {
        StatesService.getAllCitiesInState(req.app.get('db'), req.params.id)
        .then(cities => {
            if (cities.length === 0 ){
            res.statusMessage='There are no cities in this state, you can add one.'
                return res.status(404).end()
            }
            res.json(cities.map(sanitizeCity))
        })
        
        .catch(next)
    })
    .post(requireAuth, bodyParser, (req,res,next)=>{
        const {name, state_id, author}=req.body
        const newCity = {name, state_id, author}
        for(const [key, value] of Object.entries(newCity)){
            if (value == null){
                res.statusMessage= `Missing ${key} in request`
                return (res.status(400).end())
            } 
        }
            StatesService.addCity(req.app.get('db'), newCity)
            .then(city=>{
                res
                .status(201)
                .location(path.posix.join(req.originalUrl))
                .json(sanitizeCity(city))
            })
            .catch(next)
       
    })
    .delete(bodyParser, (req,res,next)=>{
        const {id}=req.params
        StatesService.deleteCity(req.app.get('db'),id)
        .then(affected=>{
            res.status(204).end()
        })
        .catch(next)
    })
module.exports = StatesRouter