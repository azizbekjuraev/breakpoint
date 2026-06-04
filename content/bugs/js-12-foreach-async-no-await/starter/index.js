function fetchData(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve('data-' + id), 20);
  });
}

async function processAll(ids) {
  const results = [];
  ids.forEach(async (id) => {
    const data = await fetchData(id);
    results.push(data);
  });
  return results;
}

(async () => {
  const out = await processAll([1, 2, 3]);
  console.log('result:', JSON.stringify(out));
})();
