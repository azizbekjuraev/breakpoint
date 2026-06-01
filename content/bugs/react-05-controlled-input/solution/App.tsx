import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" />
      <p>Hello, {name || '(no name yet)'}</p>
    </div>
  );
}
