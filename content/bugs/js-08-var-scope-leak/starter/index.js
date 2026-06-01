function rank(score) {
  if (score >= 90) {
    var grade = 'A';
  } else if (score >= 80) {
    var grade = 'B';
  } else if (score >= 70) {
    var grade = 'C';
  }
  console.log('grade:', grade);
}

rank(95);
rank(85);
rank(75);
rank(50);
