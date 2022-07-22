// const { corpus } = require("./corpus");
const { corpus } = require("./corpus");
const { nGram } = require("./ngram");
const trigram = nGram(3);
const bigram = nGram(2);

let documents = [];
const DF = {};
const MAX_DF = 0.8;

const tokenize = (text) => {
  const terms = text.split(" ");
  return [...terms, ...bigram(terms), ...trigram(terms)];
  // return terms;
};

const documentList = [
  "This is the first document.",
  "This document is the second document.",
  "And this is the third one.",
  "Is this the first document?",
];

const tokenizedDocuments = documentList.map(tokenize);

const vocabulary = {};

// building vocabulary
const buildVocabulary = (documents) => {
  let vocabIdx = 0;
  documents.forEach((doc) => {
    doc.forEach((term) => {
      if (!vocabulary[String(term)]) {
        vocabulary[String(term)] = String(vocabIdx);
        vocabIdx++;
      }
    });
  });
};

buildVocabulary(tokenizedDocuments);
/*
    build vocabulary {t1: 0, t2: 1, t3: 2, etc...}
    for doc of each tokenize docs
        vocab_container_for_a_doc = {}
        for each term of doc
            vocab_container_for_a_doc[term] + 1 or 1
            DF[term] +1 or 1
        documents.push(vocab_container_for_a_doc)
 */
tokenizedDocuments.forEach((terms) => {
  const document = {};
  terms.forEach((t) => {
    // t -> vocabulary[t]
    const vocabIdx = vocabulary[t];
    if (document[vocabIdx]) {
      document[vocabIdx] += 1;
    } else {
      document[vocabIdx] = 1;
      if (DF[vocabIdx]) {
        DF[vocabIdx] += 1;
      } else {
        DF[vocabIdx] = 1;
      }
    }
  });
  documents.push(document);
});

// console.log(Object.keys(DF));
const limit = () => {
  const max_df = Math.floor(documents.length * MAX_DF);
  console.log(max_df);
  const vocabIdxsToDelete = [];
  documents.forEach((doc) => {
    const vocabIdxs = Object.keys(doc);

    for (const vocabIdx of vocabIdxs) {
      if (DF[vocabIdx] > max_df || DF[vocabIdx] < 1) {
        console.log("deteted term with vocabIdx", vocabIdx);
        delete doc[vocabIdx];
        vocabIdxsToDelete.push(vocabIdx);
      }
    }
  });
  vocabIdxsToDelete.forEach((vocabIdx) => {
    delete DF[vocabIdx];
    delete vocabulary[vocabIdx];
  });
};

// smooth idf weights by adding one to document frequencies, as if an extra document was seen containing every term in the collection exactly once. Prevents zero divisions.
const smooth = () => {
  // for each vocabulary
  Object.values(vocabulary).forEach(
    (vocabIdx) => (DF[vocabIdx] = DF[vocabIdx] + 1)
  );
  documents.push({ __smoothObject: true });
};

limit();
smooth();
// console.log(Object.keys(DF).sort((a, b) => a.localeCompare(b)));

const tf = (vocabIdx, document) => 1 + Math.log(document[vocabIdx]);
const idf = (vocabIdx) => 1 + Math.log(documents.length / DF[vocabIdx]);

const tfidf = () => {
  let tfidfs = [];

  documents.forEach((document) => {
    if (!document["__smoothObject"]) {
      // it will use map instead to store tfidf as {vocab_idx: tfidf}
      const atfidf = Object.keys(document).map((vocabIdx) => {
        return [vocabIdx, tf(vocabIdx, document) * idf(vocabIdx)];
      });
      // normalizing the values
      let dottedSum = atfidf
        .map(([_, tfidfValue]) => tfidfValue * tfidfValue)
        .reduce((sum, tfidfValueSquered) => sum + tfidfValueSquered, 0);
      const dottedSumSqrd = Math.sqrt(dottedSum);

      // Normalizing tfidfs
      const atfidfVocabIdxValueObject = atfidf
        .map(([vocabIdx, tfidfValue]) => [vocabIdx, tfidfValue / dottedSumSqrd])
        .reduce((obj, [vocabIdx, value]) => {
          obj[vocabIdx] = value;
          return obj;
        }, {});

      tfidfs.push(atfidfVocabIdxValueObject);
    }
  });
  return tfidfs;
};

const tfidfs = tfidf();
console.log(tfidfs);
const distance = () => {
  const distances = [];

  let innerDottedProduct = tfidfs.map((atfidf) =>
    Object.values(atfidf).reduce((sum, v) => sum + v * v, 0)
  );

  const buildIntersection = (a, b) => {
    const intersection = [];
    Object.keys(a).forEach((avidx) => {
      if (b[avidx]) {
        intersection.push(avidx);
      }
    });
    return intersection;
  };

  for (let i = 0; i < tfidfs.length; i++) {
    const a = tfidfs[i];
    for (let j = i + 1; j < tfidfs.length; j++) {
      const b = tfidfs[j];
      const intersection = buildIntersection(a, b);
      const dottedProdOfCommons = intersection.reduce(
        (sum, vidx) => sum + a[vidx] * b[vidx],
        0
      );
      const cosineSimilarity =
        1 -
        dottedProdOfCommons /
          (Math.sqrt(innerDottedProduct[i]) / Math.sqrt(innerDottedProduct[j]));

      distances.push(cosineSimilarity);
    }
  }
  return distances;
};

distance();
