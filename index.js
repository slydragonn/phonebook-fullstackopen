import express, { response } from "express";
import morgan from "morgan";
import Phone from "./models/phone.js";

const app = express();

app.use(express.static("dist"));

// JSON middleware
app.use(express.json());

// Logger middleware
morgan.token("body", (req, _) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.get("/info", (_, res) => {
  const info = `
  <div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
  </div>
  `;

  res.send(info);
});

app.get("/api/persons", (_, res) => {
  Phone.find({}).then((phones) => {
    res.json(phones);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "name is missing" });
  }

  if (!body.number) {
    return res.status(400).json({ error: "number is missing" });
  }

  const phone = new Phone({
    name: String(body.name),
    number: String(body.number),
  });

  phone.save().then((savePhone) => {
    res.json(savePhone);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Phone.findById(id)
    .then((phone) => {
      res.json(phone);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(404).send("<h1>404 Not Found</h1>");
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
