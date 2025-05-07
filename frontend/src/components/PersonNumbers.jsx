const Persons = ({ persons, filterValue, deletePerson }) => {
  return persons
    .filter((person) =>
      person.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()),
    )
    .map((person) => (
      <div key={person.id}>
        <p>
          {person.name} {person.number}
        </p>
        <button onClick={() => deletePerson(person)}>delete</button>
      </div>
    ));
};

export default Persons;
