const fs = require("fs");

const N = 5020;

for (let i = 0; i < N; i++) {
  fs.writeFileSync(`./data/${i}.json`, "hello world");
}
