const aws = require('aws-sdk')
const {faker} = require('@faker-js/faker')
const boom = require('@hapi/boom');

aws.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});

class Jobs{
  constructor(){
    this.dynamoDB = new aws.DynamoDB()
    this.docClient = new aws.DynamoDB.DocumentClient()
    this.tableName = 'Jobs'
  }

  async find(){
    const params = {
      TableName: this.tableName
    }
    this.jobs = await this.docClient.scan(params).promise()
    return this.jobs.Items
  }

  async findOne(id){
    const params = {
      TableName: this.tableName,
      Key: {
        "id": id
      }
    }
    let job = await this.docClient.get(params).promise()
    job = job.Item
    console.log(job)
    if(!job){
      throw boom.notFound('Job not found')
    }else if(!job.active){
      throw boom.conflict('Job not active')
    }
    return job
  }

  async create(data){
    const job = await this.validateJob(data.name)
    if(!job){
      const params = {
        TableName: this.tableName,
        Item: {
          id: faker.datatype.uuid(),
          ...data,
          active:true
        }
      }
      const newJob = await this.docClient.put(params).promise()
      return {
        message: 'Job created succesfully',
        job: newJob
      }
    }else{
      throw boom.conflict('A job with that name already exist')
    }
  }

  async validateJob(name){
    const params = {
      TableName: this.tableName,
      Key:{
        name: {
          S: name
        }
      }
    }
    const job = await this.dynamoDB.getItem(params).promise()
    return job.Item
  }
}

class JobsSingleton{
  constructor(){
    throw boom.internal('Use instance creation')
  }

  static getInstance(){
    if(!this.instance){
      this.instance = new Jobs
    }
    return this.instance
  }
}

module.exports = JobsSingleton
