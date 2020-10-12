const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
// const https = require('https');
const rmrf = require('rmrf');

const getLogoAndHeroImages = siteURL => {

    let URLObject = new URL(siteURL);
    let hostname = URLObject.hostname;
    let logo = {};
    let heroCollection = [];
    let images = [];
    return puppeteer.launch().then(browser => {
        return browser.newPage();        
    }).then(page => {
        return page.goto(siteURL).then(() => {
            return page.$$('img');
        }).then(imagesArr => {
            return Promise.all(imagesArr.map(img => {
                return img.evaluate(node => {return {'url': node.src, 'width': node.naturalWidth, 'height': node.naturalHeight}}).then(imgProps => {
                    images.push(imgProps);
                })
            }));
        });
    }).then(() => {
        // console.log(images);
        logo = images.filter(img => {
            const logoPattern = RegExp('logo');
            return(logoPattern.test(img.url));
        });

        heroCollection = [...images];
        heroCollection.sort((img1, img2) => {
            const img1Area = img1.width * img1.height;
            const img2Area = img2.width * img2.height;
            if(img1Area > img2Area){
                return -1;
            } else {
                return 1;
            };
        });

        heroCollection = heroCollection.filter((img, i) => {
            let notSquare = img.width != img.height;
            let notDuplicate;
            if(i === 0){
                notDuplicate = true;
            } else {
                notDuplicate = !(heroCollection[i-1].url == heroCollection[i].url);
            }
            return(notSquare 
                && 
                notDuplicate
                );
        });

        heroCollection = [heroCollection[0], heroCollection[1], heroCollection[2]];
        // console.log(heroCollection)

    }).then(() => {
        if(logo[0]){
            logo = logo[0];
        } else {
            logo = null;
        }
        return { "logo": logo, "heroCollection": heroCollection, "hostname": hostname };
    })
};

const saveImagesToDisk = imagesObj => {
    // const fullUrl = url;

    if (!fs.existsSync('output')){
        fs.mkdirSync('output');
    }

    const dirPath = `output/${imagesObj.hostname}`;
    if (fs.existsSync(dirPath)){
        rmrf(dirPath);
    }
    fs.mkdirSync(dirPath);
    fs.mkdirSync(`${dirPath}/logo`);
    fs.mkdirSync(`${dirPath}/hero`);

    if(imagesObj.logo){
        let logoExtension = imagesObj.logo.url.substring(imagesObj.logo.url.lastIndexOf('.') + 1);
        logoExtension = logoExtension.includes('?')? logoExtension.substring(0, logoExtension.lastIndexOf('?')): logoExtension;
        download(imagesObj.logo.url, `${dirPath}/logo/logo.${logoExtension}`, function(){
            // console.log('done');
        });      
    }

    imagesObj.heroCollection.map((img, i) => {
        let heroExtension = img.url.substring(img.url.lastIndexOf('.') + 1);
        heroExtension = heroExtension.includes('?')? heroExtension.substring(0, heroExtension.lastIndexOf('?')): heroExtension;
        download(img.url, `${dirPath}/hero/hero-${i}.${heroExtension}`, function(){
            // console.log('done');
        });
    })
};

let download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
    //   console.log('content-type:', res.headers['content-type']);
    //   console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  

module.exports = { getLogoAndHeroImages, saveImagesToDisk }