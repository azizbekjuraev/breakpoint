import { useState, useEffect } from 'react';

function Pinger({ id }: { id: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function handler() {
      setCount((c) => c + 1);
    }
    window.addEventListener('breakpoint-ping', handler);
    return () => window.removeEventListener('breakpoint-ping', handler);
  }, [id]);

  return <p>Count: {count}</p>;
}

export default function App() {
  const [id, setId] = useState(1);

  function ping() {
    window.dispatchEvent(new Event('breakpoint-ping'));
  }

  return (
    <div>
      <button onClick={() => setId((x) => x + 1)}>Change id</button>
      <button onClick={ping}>Ping</button>
      <Pinger id={id} />
    </div>
  );
}
