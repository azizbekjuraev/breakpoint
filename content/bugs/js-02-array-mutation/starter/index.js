function addItem(list, item) {
  list.push(item);
  return list;
}

const original = [1, 2, 3];
const updated = addItem(original, 4);

console.log('original:', JSON.stringify(original));
console.log('updated:', JSON.stringify(updated));
console.log('same reference:', original === updated);
