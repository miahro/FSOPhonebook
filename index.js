const express = require('express')
const app = express()

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


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)