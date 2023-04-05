require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
//app.use(morgan('tiny'))
//app.use(morgan(':method :host :status :param[id] :res[content-length] - :response-time ms'));
morgan.token('body', request => {
    //console.log(req.method)
    if (request.method !== 'POST') {
        //console.log('method is not POST')
        //return JSON.stringify(`\u0020`)
        return 
    }
    return JSON.stringify(request.body)
}
    )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))




const url = process.env.MONGODB_URl
const mongoose = require('mongoose')
//const url `mongodb+srv://testuser:${password}@cluster0.lngrmwx.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
const Person = mongoose.model('Person', personSchema)

console.log(typeof Person)

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// this is not necessary for functionality, but for testing purposes here
app.get('/', (request, response) => {
    response.send("<h1> request to root (/) </h1>")
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=> {
        console.log(persons.length)
        response.json(persons)
    })
    //response.json(persons)
})


app.get('/info', (request, response) => {
    const utcdate = new Date()
    const localdate = utcdate.toString()
    
    Person.find({}).then(persons=> {
        console.log(persons.length)
        const lnt = persons.length
        console.log(lnt)
        response.write(`<p> Phonebook has info for ${lnt} people</p>`)
        response.write(`<p> ${localdate} </p>`)
        response.end()
    })
} )

app.get('/api/persons/:id', (request, response) => {
    //console.log("person")
    //const id = Number(request.params.id)
    //console.log(id)
    Person.findById(request.params.id)
        .then(person => {
            if (person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log("in delete, id", id)
    persons = Person.filter(person => person.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const person = JSON.parse(JSON.stringify(request.body))
    person.id = Math.floor(Math.random()*1000000000)
    //console.log(person)
    if (!person.name){
        return response.status(400).json({
            error: 'name cannot be empty'
        })
    } 
    if (!person.number){
        return response.status(400).json({
            error: 'number cannot be empty'
        })
    }

    const person_exists = Person.find(person_exists => {
        return person_exists.name === person.name
    })
    //console.log("Person exist", person_exists)
    if (person_exists) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)