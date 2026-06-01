import { useState } from 'react';

interface Item {
  id: number;
  label: string;
}

function Row({ label }: { label: string }) {
  const [note, setNote] = useState('');
  return (
    <li>
      <span>{label}: </span>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="add a note"
      />
    </li>
  );
}

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: 'A' },
    { id: 2, label: 'B' },
    { id: 3, label: 'C' },
  ]);

  function addFront() {
    setItems([{ id: Date.now(), label: 'NEW' }, ...items]);
  }

  return (
    <div>
      <button onClick={addFront}>Add to front</button>
      <ul>
        {items.map((item, i) => (
          <Row key={i} label={item.label} />
        ))}
      </ul>
    </div>
  );
}
