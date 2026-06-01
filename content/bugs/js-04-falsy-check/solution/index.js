function findUser(id) {
  if (id == null) {
    return 'no user provided';
  }
  return 'looking up user #' + id;
}

console.log(findUser(42));
console.log(findUser(0));
console.log(findUser());
console.log(findUser(null));
