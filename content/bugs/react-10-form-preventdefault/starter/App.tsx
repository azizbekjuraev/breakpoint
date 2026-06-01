import { useState, FormEvent } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setSubmitted(name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <button type="submit">Submit</button>
      {submitted && <p>Submitted: {submitted}</p>}
    </form>
  );
}
