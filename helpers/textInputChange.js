export default function textInputChange(e, state, setState) {
  const property = e.target.id;
  const value = e.target.value;
  setState({
    ...state,
    [property]: value,
  });
};