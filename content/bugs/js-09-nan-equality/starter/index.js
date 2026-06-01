function isInvalidScore(score) {
  return score === NaN;
}

console.log('42:', isInvalidScore(42));
console.log('NaN:', isInvalidScore(NaN));
console.log('zero:', isInvalidScore(0));
console.log('abc:', isInvalidScore('abc' * 2));
