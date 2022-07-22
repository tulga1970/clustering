const fs = require("fs");

const files = fs.readdirSync("./leak_trace_clustering/unclassified-clusters");

files
  .filter((_, idx) => idx % 80  !== 0)
  .forEach((file) => fs.unlinkSync(`./data/${file}`));
console.log(fs.readdirSync("./data").length);
