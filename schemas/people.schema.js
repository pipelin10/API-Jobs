const Joi = require('joi')

const id = Joi.string().guid()
const name = Joi.string().min(5).max(35)
const email = Joi.string().email({ minDomainSegments: 2})
const phone = Joi.string().length(13)

const createPeopleSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  phone: phone.required()
})

const updatePeopleSchema = Joi.object({
  name: name,
  email: email,
  phone: phone
})

const getPeopleSchema = Joi.object({
  id: id.required()
})

module.exports = {createPeopleSchema, updatePeopleSchema, getPeopleSchema}
