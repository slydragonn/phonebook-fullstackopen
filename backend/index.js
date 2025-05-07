import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.static("dist"));

// JSON middleware
app.use(express.json());

// Logger middleware
morgan.token('body', (req, _) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const port = 3000;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.get("/info", (_, res) => {
  const info = `
  <div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
  </div>
  `

  res.send(info)
})

app.get("/api/persons", (_, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body

  if(!newPerson.name) {
    return res.status(400).json({error: "name is missing"})
  }

  if(!newPerson.number) {
    return res.status(400).json({error: "number is missing"})
  }

  const isTheSameName = persons.some(person => person.name === newPerson.name)

  if(isTheSameName) {
    return res.status(400).json({error: "name must be unique"})
  }

  const randomId = Math.random() * 1000000000000
  
  newPerson.id = String(randomId.toFixed(0))

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)
  } else {
    res.status(404).send("<h1>404 Not Found</h1>")
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if(person) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`);
});
