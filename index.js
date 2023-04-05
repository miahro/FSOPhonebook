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

const Person = require('./models/person')


// this is not necessary for functionality, but for testing purposes here
app.get('/', (request, response) => {
    response.send("<h1> request to root (/) </h1>")
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=> {
        console.log(persons.length)
        response.json(persons)
    })
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


    const personX = new Person({
        name: request.body.name,
        number: request.body.number
    })

    console.log(personX.name, personX.number)
    personX.save()
        .then(result => {
            console.log('saved to mongoDB')
        })


    response.json(personX)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)