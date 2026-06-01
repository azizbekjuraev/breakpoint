import { useState } from 'react';

interface User {
  id: number;
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>({ id: 1, name: 'Alice' });

  if (!user) return <p>Not logged in</p>;

  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{user.name}'s count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}
