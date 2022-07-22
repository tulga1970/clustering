const { nGram } = require("./ngram");
const trigram = nGram(3);
const bigram = nGram(2);

// let documents = [];
// const DF = {};
// const MAX_DF = 0.8;

const SMOOTHING_KEY = "__smoothObjectKey";

class TfidfVectorizer {
  rawDocuments = [];
  vocabulary = Object.create(null);
  DF = Object.create(null);
  maxDF;
  documents = [];

  constructor({ rawDocuments, maxDF = 0.8 }) {
    this.rawDocuments = rawDocuments;
    this.maxDF = maxDF;
  }

  computeTfidfs() {
    const tokenizedDocuments = this.rawDocuments.map(this.tokenize);
    this.vocabulary = this.buildVocabulary(tokenizedDocuments);
    this.processDocuments(tokenizedDocuments);
    this.limit();
    this.smooth();
    this.tfidfs = this.buildTfidfs();
    return this.tfidfs;
  }

  tokenize = (text) => {
    const terms = text.split(" ");
    return [...terms, ...bigram(terms), ...trigram(terms)];
  };

  buildVocabulary = (tokenizedDocuments) => {
    let vocabIdx = 0;
    const vocabulary = Object.create(null);
    tokenizedDocuments.forEach((doc) => {
      doc.forEach((term) => {
        if (!vocabulary[String(term)]) {
          vocabulary[String(term)] = String(vocabIdx);
          vocabIdx++;
        }
      });
    });
    return vocabulary;
  };

  processDocuments(tokenizedDocuments) {
    tokenizedDocuments.forEach((terms) => {
      const document = {};
      terms.forEach((t) => {
        const vocabIdx = this.vocabulary[t];
        if (document[vocabIdx]) {
          document[vocabIdx] += 1;
        } else {
          if (this.DF[vocabIdx]) {
            this.DF[vocabIdx] += 1;
          } else {
            this.DF[vocabIdx] = 1;
          }
          document[vocabIdx] = 1;
        }
      });
      this.documents.push(document);
    });
  }

  limit() {
    const nMaxDF = Math.floor(this.documents.length * this.maxDF);
    const vocabIdxsToDelete = [];
    this.documents.forEach((doc) => {
      Object.keys(doc).forEach((vocabIdx) => {
        if (this.DF[vocabIdx] > nMaxDF || this.DF[vocabIdx] < 1) {
          delete doc[vocabIdx];
          vocabIdxsToDelete.push(vocabIdx);
        }
      });
    });
    vocabIdxsToDelete.forEach((vocabIdx) => {
      delete this.DF[vocabIdx];
      delete this.vocabulary[vocabIdx];
    });
  }

  /**
   * Smooth idf weights by adding 1 to document frequencies (DF), as if an extra
   * document was seen containing every term in the collection exactly once.
   * This prevents zero divisions.
   * */
  smooth() {
    // for each vocabulary
    Object.values(this.vocabulary).forEach(
      (vocabIdx) => (this.DF[vocabIdx] = this.DF[vocabIdx] + 1)
    );
    this.documents.push({ [SMOOTHING_KEY]: true });
  }

  buildTfidfs() {
    let tfidfs = [];

    this.documents.forEach((document) => {
      if (!document.hasOwnProperty(SMOOTHING_KEY)) {
        const atfidf = Object.keys(document).map((vocabIdx) => {
          return [vocabIdx, this.tf(vocabIdx, document) * this.idf(vocabIdx)];
        });

        // normalizing the values
        let dottedSum = atfidf
          .map(([_, tfidfValue]) => tfidfValue * tfidfValue)
          .reduce((sum, tfidfValueSquered) => sum + tfidfValueSquered, 0);

        const dottedSumSqrRooted = Math.sqrt(dottedSum);

        // Normalizing tfidfs
        const atfidfVocabIdxValueObject = atfidf
          .map(([vocabIdx, tfidfValue]) => [
            vocabIdx,
            tfidfValue / dottedSumSqrRooted,
          ])
          .reduce((obj, [vocabIdx, value]) => {
            obj[vocabIdx] = value;
            return obj;
          }, {});

        tfidfs.push(atfidfVocabIdxValueObject);
      }
    });
    return tfidfs;
  }

  tf(vocabIdx, document) {
    return 1 + Math.log(document[vocabIdx]);
  }

  idf(vocabIdx) {
    return 1 + Math.log(this.documents.length / this.DF[vocabIdx]);
  }
}

module.exports = TfidfVectorizer;
