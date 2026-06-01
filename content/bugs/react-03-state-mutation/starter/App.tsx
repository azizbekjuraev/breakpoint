import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState(['Apple', 'Banana']);

  function addCherry() {
    items.push('Cherry');
    setItems(items);
  }

  return (
    <div>
      <button onClick={addCherry}>Add Cherry</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
