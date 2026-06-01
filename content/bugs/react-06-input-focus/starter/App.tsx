import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  function Input() {
    return (
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
      />
    );
  }

  return (
    <div>
      <Input />
      <p>Name: {name}</p>
    </div>
  );
}
