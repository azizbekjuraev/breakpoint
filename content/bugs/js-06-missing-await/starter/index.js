function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: 'User ' + id }), 20);
  });
}

async function getUserName(id) {
  const user = getUser(id);
  return user.name;
}

(async () => {
  const name = await getUserName(42);
  console.log('name:', name);
})();
