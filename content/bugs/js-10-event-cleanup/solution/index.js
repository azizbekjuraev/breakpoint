const handler = () => {
  console.log('clicked');
};

function setup() {
  document.addEventListener('click', handler);
}

function teardown() {
  document.removeEventListener('click', handler);
}

setup();
teardown();
document.dispatchEvent(new Event('click'));
console.log('done');
