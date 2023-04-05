const url = process.env.MONGODB_URl
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connecting to MongoDB", error)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  

module.exports = mongoose.model('Person', personSchema)