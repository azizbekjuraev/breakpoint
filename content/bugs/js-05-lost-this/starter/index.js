const counter = {
  count: 0,
  increment() {
    this.count++;
    console.log('count:', this.count);
  },
};

counter.increment();
counter.increment();

setTimeout(counter.increment, 10);
