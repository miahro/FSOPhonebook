const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// this is not necessary for functionality, but for testing purposes here
app.get('/', (request, response) => {
    response.send("<h1> request to root (/) </h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/info', (request, response) => {
    const utcdate = new Date()
    const localdate = utcdate.toString()
    response.write(`<p> Phonebook has info for ${persons.length} people</p>`)
    response.write(`<p> ${localdate} </p>`)
    response.end()
} )

app.get('/api/persons/:id', (request, response) => {
    console.log("person")
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person =>  {
        console.log(person.id === id)
        return person.id === id
    })
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log("in delete, id", id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const person = request.body
    person.id = Math.floor(Math.random()*1000000000)
    console.log(person)
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

    const person_exists = persons.find(person_exists => {
        return person_exists.name === person.name
    })
    console.log("Person exist", person_exists)
    if (person_exists) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)