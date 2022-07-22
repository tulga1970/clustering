const fs = require("fs");
const cluster = require("./hac-v2");

// const cluster = require("./hac");
// const distanceMatrix = require("/Users/tulgan/test.json");
const distanceMatrix = require("./distance-matrix.json");
const clusters = cluster(5020, distanceMatrix, 0.7);
// fs.writeFileSync("./clusters.json", JSON.stringify(Z), {
//   encoding: "utf-8",
// });

console.log(new Set(clusters).size);
console.log(clusters);
const map = Object.create(null);
for (const c of clusters) {
  if (!map[c]) {
    map[c] = 1;
  } else {
    map[c] = map[c] + 1;
  }
}

fs.writeFileSync("./map.json", JSON.stringify(map), {
  encoding: "utf-8",
});
fs.writeFileSync("./clusters.json", JSON.stringify(clusters), {
  encoding: "utf-8",
});
