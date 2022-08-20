const express = require('express')
const cors = require('cors')
const routerAPI = require('./routes/routes')
const boom = require('@hapi/boom')

const {logErrors, boomErrorHandler} = require('./middlewares/error.handler')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const whitelist = ['https://sendgrid.com']
const options = {
  origin: (origin, callback) => {
    if(whitelist.includes(origin) || !origin){
      callback(null, true)
    }else{
      callback(boom.unauthorized('Origin not allowed'))
    }
  }
}
app.use(cors(options))

app.get('/', (req, res) => {
  res.send("Hello World")
})

routerAPI(app)

app.use(logErrors)
app.use(boomErrorHandler)

app.listen(port, () => {
  console.log(`Listen on port: ${port}`)
})
