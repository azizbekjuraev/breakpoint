import { useState, useEffect } from 'react';

const DB: Record<string, { ms: number; name: string }> = {
  '1': { ms: 80, name: 'Bob' },
  '2': { ms: 10, name: 'Alice' },
};

function fetchUser(id: string): Promise<{ name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: DB[id].name }), DB[id].ms);
  });
}

function UserDisplay({ userId }: { userId: string }) {
  const [name, setName] = useState<string>('loading...');

  useEffect(() => {
    let cancelled = false;
    setName('loading...');
    fetchUser(userId).then((u) => {
      if (!cancelled) setName(u.name);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return <p>User: {name}</p>;
}

export default function App() {
  const [userId, setUserId] = useState<string>('1');

  return (
    <div>
      <button onClick={() => setUserId('1')}>Load Bob</button>
      <button onClick={() => setUserId('2')}>Load Alice</button>
      <UserDisplay userId={userId} />
    </div>
  );
}
