import { useState } from "react";
import "./index.css";

function App() {
  const [items, setItems] = useState([]);

  const handleItem = (item) => setItems((items) => [...items, item]);

  const handleDelete = (id) => setItems(items.filter((item) => item.id !== id));

  const handleToggle = (id) => {
    setItems((items) => items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)));
  };
  const handleClear = () => {
    const confirmed = confirm("Are you want to clear tasks?");
    confirmed && setItems([]);
  };
  return (
    <div className="app">
      <Logo />
      <Form handleItem={handleItem} />
      <PackingList items={items} handleDelete={handleDelete} handleToggle={handleToggle} handleClear={handleClear} />
      <Stats items={items} />
    </div>
  );
}

export default App;

function Logo() {
  return <h1> Your Tasks!!! ✌️</h1>;
}

function Form(props) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;
    const newItems = { description, quantity, packed: false, id: Date.now() };
    console.log(newItems);
    props.handleItem(newItems);
    // props.newValues(newItems);
    setDescription("");
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>Mark your tasks here?</h3>
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num}>{num}</option>
        ))}
      </select>
      <input type="text" placeholder="Item..." value={description} onChange={(e) => setDescription(e.target.value)} />
      <button className="button">ADD</button>
    </form>
  );
}
function PackingList({ items, handleDelete, handleToggle, handleClear }) {
  const [sortBy, setSortBy] = useState("description");

  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description") sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed") sortedItems = items.sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item item={item} key={item.id} handleDelete={handleDelete} handleToggle={handleToggle} />
        ))}
      </ul>
      <div>
        <select className="actions" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed order</option>
        </select>
        <button onClick={handleClear}>Clear all fields</button>
      </div>
    </div>
  );
}
function Item({ item, handleDelete, handleToggle }) {
  // const handleDelete = (id) => console.log(id);
  return (
    <li>
      <input type="checkbox" onChange={() => handleToggle(item.id)} value={item.packed} />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => handleDelete(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  const countItems = items.length;
  const numPacked = items.filter((items) => items.packed).length;
  const percentage = Math.round((numPacked / countItems) * 100);
  if (!items.length)
    return (
      <footer className="stats">
        <em>Start adding some tasks to your list!!!</em>
      </footer>
    );

  return (
    <footer className="stats">
      <em>{percentage == 100 ? "You have completed all tasks!! ✌" : `you are having ${countItems} tasks and  ${numPacked} done (${percentage}%)`}</em>
    </footer>
  );
}
