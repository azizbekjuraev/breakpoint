function setup() {
  document.addEventListener('click', () => {
    console.log('clicked');
  });
}

function teardown() {
  document.removeEventListener('click', () => {
    console.log('clicked');
  });
}

setup();
teardown();
document.dispatchEvent(new Event('click'));
console.log('done');
