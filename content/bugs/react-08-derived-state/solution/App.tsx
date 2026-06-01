import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Apple', price: 100 },
    { id: 2, name: 'Banana', price: 50 },
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  function addCherry() {
    setItems([...items, { id: Date.now(), name: 'Cherry', price: 75 }]);
  }

  return (
    <div>
      <button onClick={addCherry}>Add Cherry</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}: ${item.price}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
    </div>
  );
}
