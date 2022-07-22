const PriorityQueue = require("./priority-queue");

const pq = new PriorityQueue((a, b) => a[2] < b[2]);
pq.push([0, 2, 0.9], [1, 2, 0.9], [2, 3, 0.5]);

while (!pq.isEmpty()) {
  console.log(pq.pop()); //=> 40, 30, 20, 10
}
