/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter((c) => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};

    for (let i = 0; i < this.words.length - 1; i++) {
      let wordPair = `${this.words[i]} ${this.words[i + 1]}`;
      let nextWord = this.words[i + 2] || null;

      if (!this.chains[wordPair]) {
        this.chains[wordPair] = [];
      }
      this.chains[wordPair].push(nextWord);
    }
  }

  // select an element from an array

  static pickElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** generator function to yield words one by one */

  *generateText(numWords = 100) {
    let keys = Object.keys(this.chains);
    let capitalizedKeys = keys.filter((wordPair) =>
      /^[A-Z]/.test(wordPair.split(" ")[0])
    );
    let key = MarkovMachine.pickElement(
      capitalizedKeys.length > 0 ? capitalizedKeys : keys
    );
    let output = key.split(" ");

    while (output.length < numWords && key !== null) {
      let nextWord = MarkovMachine.pickElement(this.chains[key]);
      if (nextWord === null) break;
      output.push(nextWord);
      key = `${output[output.length - 2]} ${output[output.length - 1]}`;
      yield nextWord;
    }
  }
}

module.exports = {
  MarkovMachine,
};
