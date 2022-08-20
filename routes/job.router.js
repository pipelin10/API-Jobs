const express = require('express')
const JobsService = require('../services/jobs.service')
const PeopleService = require('../services/people.service')
const validatorHandler =  require('../middlewares/validator.handler')
const {createJobSchema, updateJobSchema, getJobSchema} = require('../schemas/jobs.schema')

const router = express.Router()
const jobService = JobsService.getInstance()
const peopleService = PeopleService.getInstance()

router.get('/', async(req, res) => {
  const jobs = await jobService.find()
  res.status(200).json(jobs)
})

router.get('/:id',
  validatorHandler(getJobSchema, 'params'),
  async (req, res, next) => {
    const {id} = req.params
    let job
    try{
      job = await jobService.findOne(id)
      res.json(job)
    }catch(error){
      next(error)
    }
  }
)

router.post('/',
  validatorHandler(createJobSchema, 'body'),
  async (req, res, next) => {
    const body = req.body
    try{
      const newJob = await jobService.create(body)
      peopleService.notifyPeople(body.name)
      res.status(201).json(newJob)
    }catch(error){
      next(error)
    }
  }
)

module.exports = router
