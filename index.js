require("dotenv").config()
const express = require("express")
const app = express()
app.use(express.json())
var morgan = require("morgan")
//app.use(morgan('tiny'))
//app.use(morgan(':method :host :status :param[id] :res[content-length] - :response-time ms'));
morgan.token("body", request => {
  //console.log(req.method)
  if (request.method !== "POST") {
    return
  }
  return JSON.stringify(request.body)
}
)

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
const cors = require("cors")
app.use(cors())
app.use(express.static("build"))

const Person = require("./models/person")

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(requestLogger)

// this is not necessary for functionality, but for testing purposes here
app.get("/", (request, response) => {
  response.send("<h1> request to root (/) </h1>")
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons.length)
    response.json(persons)
  })
})


app.get("/info", (request, response) => {
  const utcdate = new Date()
  const localdate = utcdate.toString()

  Person.find({}).then(persons => {
    console.log(persons.length)
    const lnt = persons.length
    console.log(lnt)
    response.write(`<p> Phonebook has info for ${lnt} people</p>`)
    response.write(`<p> ${localdate} </p>`)
    response.end()
  })
} )

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person){
        console.log("id found")
        response.json(person)
      } else {
        console.log("id NOT found")
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post("/api/persons", (request, response, next) => {
  const person = JSON.parse(JSON.stringify(request.body))
  //person.id = Math.floor(Math.random()*1000000000)
  if (!person.name){
    return response.status(400).json({
      error: "name cannot be empty"
    })
  }
  if (!person.number){
    return response.status(400).json({
      error: "number cannot be empty"
    })
  }
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  console.log(newPerson.name, newPerson.number)
  newPerson.save()
    .then(() => {
      console.log("saved to mongoDB")
      response.json(newPerson)
    })
    .catch(error => next(error))


})

app.put("/api/persons/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  const id = request.params.id
  const options = { runValidators: true }

  Person.findByIdAndUpdate(
    id,
    person,
    options
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch((error) => {
      console.log("Error in PUT")
      next(error)})

})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)