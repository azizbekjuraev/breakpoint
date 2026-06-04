function groupBy(items, keyFn) {
  return items.reduce((acc, x) => {
    const key = keyFn(x);
    acc[key] = acc[key] || [];
    acc[key].push(x);
    return acc;
  }, {});
}

try {
  const result = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 ? 'odd' : 'even'));
  console.log('result:', JSON.stringify(result));
} catch (e) {
  console.log('error:', e.message);
}
