function fetchData(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve('data-' + id), 20);
  });
}

async function processAll(ids) {
  return Promise.all(ids.map((id) => fetchData(id)));
}

(async () => {
  const out = await processAll([1, 2, 3]);
  console.log('result:', JSON.stringify(out));
})();
