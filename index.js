const { getLogoAndHeroImages, saveImagesToDisk } = require('./src/heroGrab');
const fs = require('fs');
const puppeteer = require('puppeteer');


// let rawdata = fs.readFileSync('input/urls.json');
// let urlsToScrape = JSON.parse(rawdata);

// console.log(urlsToScrape.urls.length);

// let counter = 0;
// let images = [];

// puppeteer.launch()
// .then((browser) => {
//     console.log("broweser opened");
//     Promise.all(urlsToScrape.urls.map((url, i) => {
//         console.log(`opening... ${i}/${urlsToScrape.urls.length}`);
//         return getLogoAndHeroImages(url, browser)
//         .then(obj => {
//             // return saveImagesToDisk(obj);
//             images.push(obj);
//         }).then(() => {
//             console.log(`closing... ${i}/${urlsToScrape.urls.length}`);
//         });
//     })).then(() => {
//         browser.close();
//         console.log("broweser closed");
//         console.log("done");
//     //    process.exit(1);
//         console.log(JSON.stringify(images, null, 4));
//         console.log(images.length);
//     })    
// });


async function go(){
    let rawdata = fs.readFileSync('input/urls.json');
    let urlsToScrape = JSON.parse(rawdata);
    
    // console.log(urlsToScrape.urls.length);
    
    // let counter = 0; 
    let images = [];
    let browser = await puppeteer.launch();
    console.log("opened browser");
    for(let i = 0; i < urlsToScrape.urls.length; i++){
        let img = await getLogoAndHeroImages(urlsToScrape.urls[i], browser);
        saveImagesToDisk(img);
        console.log(img);
        console.log(`${i}/${urlsToScrape.urls.length}`);
    }
    browser.close();
    console.log(JSON.stringify(images, null, 4));
}

go();


// urlsToScrape.urls.map((url, i) => {
//     let response = getLogoAndHeroImages(url);
//     console.log(`${i}/${urlsToScrape.urls.length}`);
// });

// const scrapeURLS = async urls => {
//     urls.map((url, i) => {
//         let response = await getLogoAndHeroImages(url);
//         console.log(`${i}/${urlsToScrape.urls.length}`);
//     });    
// };

// scrapeURLS(urlsToScrape.urls);