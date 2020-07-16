const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql')
const {MONGO_URI} = require('./keys')
const mongoose = require('mongoose')
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(require('./middlewares/auth.middleware'))
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
)

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('Mongo connected')
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`App listened on ${PORT}`)
})
