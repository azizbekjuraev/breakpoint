import { useState, useEffect } from 'react';

function Card({ showAge }: { showAge: boolean }) {
  const config = { showAge, color: 'blue' };

  useEffect(() => {
    console.log('config effect ran');
  }, [config]);

  return <p style={{ color: config.color }}>Show age: {String(showAge)}</p>;
}

export default function App() {
  const [tick, setTick] = useState(0);

  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>Tick ({tick})</button>
      <Card showAge={true} />
    </div>
  );
}
