function Cart() {
  this.items = [];
}

Cart.prototype.add = function (item) {
  this.items.push(item);
};

const a = new Cart();
const b = new Cart();
a.add('apple');
b.add('bread');

console.log('a:', JSON.stringify(a.items));
console.log('b:', JSON.stringify(b.items));
console.log('shared:', a.items === b.items);
