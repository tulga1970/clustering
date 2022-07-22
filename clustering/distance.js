const buildIntersection = (a, b) => {
  const intersection = [];
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  // const keys = keysA.length > keysB ? keysB : keysA;
  // keys.forEach((avidx) => {
  //   if (b[avidx]) {
  //     intersection.push(avidx);
  //   }
  // });
  // return intersection;
  // for (let avidx in a) {
  //   if (b[avidx]) {
  //     intersection.push(avidx);
  //   }
  // }
  // for (let i = 0; i < 1000; i++) {}
  // return intersection;
  return []
};

const distance = (tfidfs) => {
  const distances = [];

  // const toFixed = (num) => Number.parseFloat(num.toFixed(6));
  const toFixed = (num) => num;

  let innerDottedProduct = tfidfs.map((atfidf) =>
    Object.values(atfidf).reduce((sum, v) => sum + v * v, 0)
  );

  for (let i = 0; i < tfidfs.length; i++) {
    const a = tfidfs[i];
    for (let j = i + 1; j < tfidfs.length; j++) {
      const b = tfidfs[j];
      const intersection = buildIntersection(a, b);
      const dottedProdOfCommons = intersection.reduce(
        (sum, vidx) => sum + toFixed(a[vidx]) * toFixed(b[vidx]),
        0
      );
      // TODO make it pluggable to use other distance measures like euclidean, manhattan
      const cosineSimilarity =
        1 -
        dottedProdOfCommons /
          (Math.sqrt(innerDottedProduct[i]) / Math.sqrt(innerDottedProduct[j]));
      distances.push(toFixed(cosineSimilarity));
    }
  }
  // console.log("distance", distances.length);
  return distances;
};

const tfidfs = require("./tfidf.json");
console.log("start");
distance(tfidfs);
console.log("end");

module.exports = distance;
