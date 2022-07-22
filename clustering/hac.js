const condensendIndex = (n, i, j) => {
  if (i > j) {
    return condensendIndex(n, j, i);
  }
  return n * i - (i * (i + 1)) / 2 + (j - i - 1);
};

const toFixed = (num) => Number.parseFloat(num.toFixed(6));
/**
 *
 * @param {*} n number of docs
 * @param {*} D condenced distance matrix
 * @returns labels - list of doc ids as clusters
 */
const cluster = (n, distanceMatrix, max_d) => {
  const D = [...distanceMatrix];
  const size = Array(n).fill(1);
  let chain_length = 0;
  let cluster_chain = [];
  let x, y;
  let dist;
  let labels = Array(n)
    .fill(0)
    .map((_, idx) => idx);

  const Z = [];
  const root = (array, idx) => {
    if (array[idx] === idx) {
      return idx;
    }
    return root(array, array[idx]);
  };

  for (let k = 0; k < n - 1; k++) {
    // finding the first cluster of the pair if there is none
    if (chain_length === 0) {
      chain_length = 1;
      for (let i = 0; i < n; i++) {
        if (size[i] > 0) {
          cluster_chain[0] = i;
          break;
        }
      }
    }

    while (true) {
      x = cluster_chain[chain_length - 1];
      if (chain_length > 1) {
        y = cluster_chain[chain_length - 2];
        current_min = D[condensendIndex(n, x, y)];
      } else {
        current_min = Number.MAX_SAFE_INTEGER;
      }

      for (let i = 0; i < n; i++) {
        if (size[i] == 0 || x == i) {
          continue;
        }

        dist = D[condensendIndex(n, x, i)];
        if (dist < current_min) {
          current_min = dist;
          y = i;
        }
      }

      if (chain_length > 1 && y == cluster_chain[chain_length - 2]) {
        break;
      }

      cluster_chain[chain_length] = y;
      chain_length = chain_length + 1;
    }

    if (current_min > max_d) {
      console.log(
        ">>>>>>>>> current_min > max",
        k,
        current_min,
        x,
        y,
        cluster_chain
      );
    } else {
      console.log(
        "########### current_min <= max",
        k,
        current_min,
        x,
        y,
        cluster_chain
      );
    }

    // if (current_min > max_d) {
    //   break;
    // }

    chain_length = 0;
    cluster_chain = [];

    if (x > y) {
      [x, y] = [y, x];
    }

    let nx = size[x];
    let ny = size[y];

    Z[k] = [x, y, current_min, nx + ny];

    labels[x] = y;
    size[x] = 0;
    size[y] = nx + ny;

    for (let i = 0; i < n; i++) {
      let ni = size[i];
      if (ni === 0 || i === y) {
        continue;
      }

      let d_xi = D[condensendIndex(n, i, x)];
      let d_yi = D[condensendIndex(n, i, y)];
      let size_x = nx;
      let size_y = ny;
      // TODO make it generic to support other linkage methods like complete, weighted etc...
      D[condensendIndex(n, i, y)] =
        // (toFixed(size_x * d_xi) + toFixed(size_y * d_yi)) / (size_x + size_y);
        (size_x * d_xi + size_y * d_yi) / (size_x + size_y);
    }
  }
  // console.log(labels);
  const res = Array(n);
  labels.forEach((_, idx) => (res[idx] = root(labels, idx)));
  // return res;
  Z.sort((a, b) => a[2] - b[2]);
  return { Z, res };
};
module.exports = cluster;
