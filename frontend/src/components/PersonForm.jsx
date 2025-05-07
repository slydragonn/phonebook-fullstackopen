const PersonForm = ({
  newName,
  handleName,
  newNumber,
  handleNumber,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a new</h2>
      <div>
        name: <input value={newName} onChange={handleName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
