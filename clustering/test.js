const TfidfVectorizer = require("./tfidf-vectorizer");
const distance = require("./distance");
const fs = require("fs");
// const cluster = require("./hac");
const cluster = require("./hac-v2");
const rawDocuments = require("./combined.json").map((doc) => doc.join(" "));
// const rawDocuments = [
//   "This is the first document.",
//   "This document is the second document.",
//   "And this is the third one.",
//   "Is this the first document?",
// ];
// const rawDocuments = [
//   "This is the first document.",
//   "This document is the second document.",
//   "And this is the third one.",
//   "Is this the first document?",
//   "That is the first document but it is not now.",
//   "This is the first document now.",
//   "That is the first document but it is not now?"
// ];

// const distanceMatrix = [
//   0.85178441, 1, 0.90354235, 0.88808562, 0.53934619, 1, 1, 0.96686349,
//   0.89267454, 0.93572446, 1, 1, 0.94818062, 0.9160814, 0.69719207,
// ];
const vectorizer = new TfidfVectorizer({ rawDocuments });

// console.log(distance(vectorizer.computeTfidfs()));
const tfidfs = vectorizer.computeTfidfs();
console.log("tfidfs done");
fs.writeFileSync("./tfidf.json", JSON.stringify(tfidfs), { encoding: "utf-8" });

// const distanceMatrix = distance(tfidfs);
// fs.writeFileSync("./distance-matrix.json", JSON.stringify(distanceMatrix), {
//   encoding: "utf-8",
// });
// const distanceMatrix = JSON.parse(
//   // fs.readFileSync("./distance-matrix.json", {

// );

// const distanceMatrix = require("/Users/tulgan/test.json");
// console.log(distanceMatrix.length);
// const { Z, res } = cluster(rawDocuments.length, distanceMatrix, 0.7);
// const clusters = cluster(rawDocuments.length, distanceMatrix, 0.7);
// // console.log("clustering done!!");
// fs.writeFileSync("./clusters.json", JSON.stringify(clusters), {
//   encoding: "utf-8",
// });
// console.log(new Set(clusters).size);
// // console.log(clusters);
// const map = Object.create(null);
// for (const c of clusters) {
//   if (!map[c]) {
//     map[c] = 1;
//   } else {
//     map[c] = map[c] + 1;
//   }
// }

// fs.writeFileSync("./map.json", JSON.stringify(map), {
//   encoding: "utf-8",
// });
// console.log(map);
// console.log(map.size, clusters.length);
