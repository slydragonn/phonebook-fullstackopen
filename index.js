import express from "express";
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

app.get("/api/persons", (_, res, next) => {
  Phone.find({}).then((phones) => {
    res.json(phones);
  }).catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
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
  }).catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Phone.findById(id)
    .then((phone) => {
      if (phone) {
        res.json(phone);
      } else {
        res.status(404).send("<h1>404 Not Found</h1>");
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "name is missing" });
  }

  if (!body.number) {
    return res.status(400).json({ error: "number is missing" });
  }

  const updatedPhone = {
    name: String(body.name),
    number: String(body.number),
  };

  Phone.findByIdAndUpdate(id, updatedPhone, { new: true })
    .then((updatedPhone) => {
      if (updatedPhone) {
        res.json(updatedPhone);
      } else {
        res.status(404).send("<h1>404 Not Found</h1>");
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Phone.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).send("<h1>404 Not Found</h1>");
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send("<h1>400 Bad Request</h1>");
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

// Middleware for handling errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
