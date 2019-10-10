console.log("starting spell check");
console.log("loading dictionary...");

var fs = require('fs');
var FuzzySet = require('fuzzyset.js');
var array = fs.readFileSync('words.txt').toString().split("\n");
const fuzz = FuzzySet(array);
console.log("dictionary loaded!");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Please enter text to spellcheck: `, (text) => {
    const textArray = text.split(' ');
    textArray.forEach(word => {
        if (!array.includes(word)) {
            console.log("Could not find word:", word);
            console.log("Did you mean:", fuzz.get(word)[0][1]);
        }
    });
    readline.close()
});