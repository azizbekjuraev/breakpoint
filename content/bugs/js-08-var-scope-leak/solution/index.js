function rank(score) {
  let grade = 'F';
  if (score >= 90) {
    grade = 'A';
  } else if (score >= 80) {
    grade = 'B';
  } else if (score >= 70) {
    grade = 'C';
  }
  console.log('grade:', grade);
}

rank(95);
rank(85);
rank(75);
rank(50);
