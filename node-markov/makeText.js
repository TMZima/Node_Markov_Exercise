/** Command-line tool to generate Markov text. */

const fs = require("fs");
const axios = require("axios");
const { MarkovMachine } = require("./markov");

function generateText(text) {
  let mm = new MarkovMachine(text);
  console.log(mm.makeText());
}

async function makeText(path) {
  if (path.startsWith("http")) {
    try {
      let res = await axios.get(path);
      generateText(res.data);
    } catch (err) {
      console.error(`Error fetching data from ${path}: ${err.message}`);
      process.exit(1);
    }
  } else {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(`Cannot read file: ${path}: ${err.message}`);
        process.exit(1);
      } else {
        generateText(data);
      }
    });
  }
}

let path = process.argv[2];
makeText(path);
