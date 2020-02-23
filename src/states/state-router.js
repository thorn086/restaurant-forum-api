const express = require('express')
const StatesService = require('./states-services')
const StatesRouter = express.Router()
const path = require('path')
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth')

const SanitizeStates = state => ({
    id: state.id,
    name: xss(state.name)
})

StatesRouter
    .route('/state')
    .get(requireAuth,(res, req, next) => {
        StatesService.getAllStates(req.app.get('db'))
            .then(state => {
                res.json(state.map(SanitizeStates))
            })
            .catch(next)
    })

StatesRouter
    .route('/:id')
    .all((req, res, next) => {
        StatesService.getCitiesId(req.app.get('db'), req.params.id)
            .then(city=>{
            if (!city)
                return res.status(404).json({
                    error:{ message: 'There are no cities in this state, you can add one.' }
                })
        })
        res.state=state
        next()
    })
    .get((req,res,next)=>{
        res.json(SanitizeStates(res.state))
    })
module.exports=StatesRouter