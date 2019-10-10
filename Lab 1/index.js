console.log("starting spell check");
console.log("loading dictionary...");

const fs = require('fs');

function fuzzySearch(items, query) {
    // Split up the query by space
    const search = query.split(' ');
    const ret = items.reduce((found, i) => {
        // Extra step here to count each search query item (after splitting by space)
        let matches = 0;
        search.forEach(s => {
            // Check for match
            if (i.indexOf(s) > -1) {
                matches++;
            }
        })
        if (matches == search.length) {
            // if all search paramters were found
            found.push(i);
        }
        return found;
    }, []);
    return ret;
}

const dictionary = fs.readFileSync('words.txt').toString().split("\n");
console.log("dictionary loaded!");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Please enter text to spellcheck: `, (text) => {
    const textArray = text.split(' ');
    textArray.forEach(word => {
        if (!dictionary.includes(word)) {
            console.log("Could not find word:", word);
            const fuzzyResults = fuzzySearch(dictionary, word);
            if (fuzzyResults.length > 1) {
                console.log("Did you mean: " + fuzzyResults[0] + " or " + fuzzyResults[1] + "?");
            } else if (fuzzyResults.length == 1) {
                console.log("Did you mean: " + fuzzyResults[0] + "?");
            } else {
                console.log("Could not find any potential matches in the dictionary.")
            }
        }
    });
    readline.close();
});