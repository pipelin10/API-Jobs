const Joi = require('joi')

const id = Joi.string().guid()
const name = Joi.string().min(5).max(35)
const monthSalary = Joi.number().integer().min(200).strict()
const companyName = Joi.string().min(5).max(45)

const createJobSchema = Joi.object({
  name: name.required(),
  monthSalary: monthSalary.required(),
  companyName: companyName.required()
})

const updateJobSchema = Joi.object({
  name: name,
  monthSalary: monthSalary,
  companyName: companyName
})

const getJobSchema = Joi.object({
  id: id.required()
})

module.exports = {createJobSchema, updateJobSchema, getJobSchema}
