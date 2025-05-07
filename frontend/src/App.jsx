import { useEffect, useState } from "react";
import personService from "./services/persons.js";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/PersonNumbers.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newfilterValue, setNewFilterValue] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: "success",
  });

  useEffect(() => {
    // get data from server
    personService.getAll().then((persons) => {
      console.log(persons);
      setPersons(persons);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const isAlreadyAdded = persons.some((person) => person.name === newName);

    if (isAlreadyAdded) {
      const person = persons.find((el) => el.name === newName);
      handleUpdate(person);
      return;
    }

    if (!newName || !newNumber) {
      alert("name or number are missing");
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };

    // add new person to server
    personService.create(newPerson).then((createdPerson) => {
      setPersons(persons.concat(createdPerson));
      setNewName("");
      setNewNumber("");
      setNotification({
        message: `Added ${createdPerson.name}`,
        type: "success",
      });
      setTimeout(() => {
        setNotification({
          message: null,
          type: "success",
        });
      }, 5000);
    });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then((response) => {
          console.log(response);
          setPersons(persons.filter((el) => el.id !== person.id));
          setNotification({
            message: `Removed ${person.name}`,
            type: "success",
          });
        })
        .catch((error) => {
          if (error.status === 404) {
            setNotification({
              message: `Information of ${person.name} has already been removed from server`,
              type: "error",
            });
          } else {
            setNotification({
              message: error.message,
              type: "error",
            });
          }
          setTimeout(() => {
            setNotification({
              message: null,
              type: "error",
            });
          }, 5000);
        });
    }
  };

  const handleUpdate = (person) => {
    if (
      window.confirm(
        `${person.name} is already added to phonebook, replace the old number with a new one`,
      )
    ) {
      const updatedPerson = { ...person, number: newNumber };

      personService.update(person.id, updatedPerson).then((updatedPerson) => {
        setPersons(
          persons.map((el) => (el.id === person.id ? updatedPerson : el)),
        );
        setNotification({
          message: `Changed ${person.name}`,
          type: "success",
        });
        setTimeout(() => {
          setNotification({ message: null, type: "success" });
        }, 5000);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilterValue(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={newfilterValue} handler={handleFilterChange} />
      <PersonForm
        newName={newName}
        handleName={handleNameChange}
        newNumber={newNumber}
        handleNumber={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterValue={newfilterValue}
        deletePerson={handleDelete}
      />
    </div>
  );
};

export default App;
