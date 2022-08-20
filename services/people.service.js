const aws = require('aws-sdk')
const {faker} = require('@faker-js/faker')
const boom = require('@hapi/boom')
const sgMail = require('@sendgrid/mail')

const accountSid = '';
const authToken = '';
const clientTwilio = require('twilio')(accountSid, authToken);

sgMail.setApiKey('')

class People{
  constructor(){
    this.dynamoDB = new aws.DynamoDB()
    this.docClient = new aws.DynamoDB.DocumentClient()
    this.tableName = 'People'
  }

  async find(){
    const params = {
      TableName: this.tableName
    }
    this.people = await this.docClient.scan(params).promise()
    return this.people.Items
  }

  async findOne(id){
    const person = this.people.find(item => item.id === id)
    if(!person){
      throw boom.notFound('Person not found')
    }else if(!person.active){
      throw boom.conflict('Person not active')
    }
    return person
  }

  async create(data){
    const person = await this.validatePerson(data.email, data.phone)
    if(!person){
      const params = {
        TableName: this.tableName,
        Item: {
          id: faker.datatype.uuid(),
          ...data,
          active:true
        }
      }
      const newPerson = await this.docClient.put(params).promise()
      return {
        message: 'Person created succesfully',
        person: newPerson
      }
    } else{
      throw boom.conflict('A person with that email or phone already exists')
    }
  }

  async validatePerson(email, phone){
    const params = {
      TableName: this.tableName,
      FilterExpression: 'email = :email OR phone = :phone',
      ExpressionAttributeValues: {
        ':email': {S: email},
        ':phone': {S: phone}
      }
    }
    const person = await this.dynamoDB.scan(params).promise()
    return person.Count
  }

  async notifyPeople(jobName){
    const people = await this.find()
    people.forEach( (person) => {
      this.notifySMS(jobName, person.phone)
      this.notifyEmail(jobName, person.email)
    });
  }

  notifySMS(jobName, phone){
    clientTwilio.messages
    .create({
      body: `There is a new job ${jobName}`,
      from: '+19378004550',
      to: phone
    })
    .then(message => console.log(message.sid));
  }

  notifyEmail(jobName, email){
    console.log('Sending email')
    this.sendEmail(
      'pipelin1010@hotmail.com',
      email,
      'New Job Offer',
      `There is a new job: ${jobName}`
    )
    console.log("Sent")
  }

  sendEmail(from, to, subject, body){
    sgMail
    .send({
      from,
      to,
      subject,
      text: body
    }).then(() => {
      console.log(`Email sent from ${from} to ${to}`);
    })
    .catch((error) => {
      console.error(error);
    });
  }
}

class PeopleSingleton{
  constructor(){
    throw boom.internal('Use instance creation')
  }

  static getInstance(){
    if(!this.instance){
      this.instance = new People
    }
    return this.instance
  }
}

module.exports = PeopleSingleton
