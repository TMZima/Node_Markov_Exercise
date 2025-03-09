/** Command-line tool to generate Markov text. */

const fs = require("fs");
const axios = require("axios");
const { htmlToText } = require("html-to-text");
const { MarkovMachine } = require("./markov");

function generateText(text) {
  let mm = new MarkovMachine(text);
  let generator = mm.generateText();
  for (let word of generator) {
    process.stdout.write(word + " ");
  }
  console.log();
}

async function fetchText(path) {
  if (path.startsWith("http")) {
    try {
      let res = await axios.get(path);
      return htmlToText(res.data);
    } catch (err) {
      console.error(`Error fetching data from ${path}: ${err.message}`);
      process.exit(1);
    }
  } else {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          reject(`Cannot read file: ${path}: ${err.message}`);
        } else {
          resolve(data);
        }
      });
    });
  }
}

async function makeText(paths) {
  let texts = await Promise.all(paths.map(fetchText));
  let combinedText = texts.join(" ");
  generateText(combinedText);
}

let paths = process.argv.slice(2);
makeText(paths);
