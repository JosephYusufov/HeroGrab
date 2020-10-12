const { getLogoAndHeroImages, saveImagesToDisk } = require('./src/heroGrab');
const fs = require('fs');

let rawdata = fs.readFileSync('input/urls.json');
let urlsToScrape = JSON.parse(rawdata);

// console.log(urlsToScrape.urls);

Promise.all(urlsToScrape.urls.map(url => {
    return getLogoAndHeroImages(url).then(obj => {
        return saveImagesToDisk(obj);
    })
})).then(() => {
    console.log("done");
    process.exit(1);
});