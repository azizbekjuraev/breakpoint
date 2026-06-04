function addMonth(date) {
  date.setMonth(date.getMonth() + 1);
  return date;
}

const createdAt = new Date('2024-01-15T00:00:00Z');
const dueAt = addMonth(createdAt);

console.log('createdAt:', createdAt.toISOString().slice(0, 10));
console.log('dueAt:', dueAt.toISOString().slice(0, 10));
console.log('sameRef:', createdAt === dueAt);
