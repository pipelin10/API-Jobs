const express = require('express')

const jobsRouter = require('./job.router')
const peopleRouter = require('./people.router')

function routerAPI(app){
  const router = express.Router()
  app.use('/api/v1', router)
  router.use('/jobs', jobsRouter)
  router.use('/people', peopleRouter)
}

module.exports = routerAPI
