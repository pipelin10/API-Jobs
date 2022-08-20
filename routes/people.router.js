const express = require('express')
const PeopleService = require('../services/people.service')
const validatorHandler =  require('../middlewares/validator.handler')
const {createPeopleSchema, updatePeopleSchema, getPeopleSchema} = require('../schemas/people.schema')

const router = express.Router()
const service = PeopleService.getInstance()

router.get('/', async(req, res) => {
  const people = await service.find()
  res.status(200).json(people)
})

router.get('/:id',
  validatorHandler(getPeopleSchema, 'params'),
  async (req, res, next) => {
    const {id} = req.params
    let person
    try{
      person = await service.findOne(id)
      res.json(person)
    }catch(error){
      next(error)
    }
  }
)

router.post('/',
  validatorHandler(createPeopleSchema, 'body'),
  async (req, res, next) => {
    const body = req.body
    try{
      const newPerson = await service.create(body)
      res.status(201).json(newPerson)
    }catch(error){
      next(error)
    }
  }
)

module.exports = router
