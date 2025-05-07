const Filter = ({ value, handler }) => {
  return (
    <div>
      filter shown with
      <input value={value} onChange={handler} />
    </div>
  );
};

export default Filter;
