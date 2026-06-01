function isInvalidScore(score) {
  return Number.isNaN(score);
}

console.log('42:', isInvalidScore(42));
console.log('NaN:', isInvalidScore(NaN));
console.log('zero:', isInvalidScore(0));
console.log('abc:', isInvalidScore('abc' * 2));
