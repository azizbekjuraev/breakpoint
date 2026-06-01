import { useState } from 'react';

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your name"
    />
  );
}

export default function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <Input value={name} onChange={setName} />
      <p>Name: {name}</p>
    </div>
  );
}
