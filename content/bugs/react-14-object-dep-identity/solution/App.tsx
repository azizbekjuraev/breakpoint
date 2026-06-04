import { useState, useEffect, useMemo } from 'react';

function Card({ showAge }: { showAge: boolean }) {
  const config = useMemo(() => ({ showAge, color: 'blue' }), [showAge]);

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
