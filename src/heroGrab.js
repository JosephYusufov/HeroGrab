const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const rmrf = require('rmrf');

const getLogoAndHeroImages = (siteURL, browser) => {

    let URLObject = new URL(siteURL);
    let hostname = URLObject.hostname;
    let logo = {};
    let heroCollection = [];
    let images = [];

    // let browser;

    return browser.newPage().then(page => {
        return page.goto(siteURL)
        .then(() => {
            return page.setDefaultNavigationTimeout(0);
        }).then(() => {
            return page.$$('img');
        }).then(imagesArr => {
            return Promise.all(imagesArr.map(img => {
                return img.evaluate(node => {return {'url': node.src, 'width': node.naturalWidth, 'height': node.naturalHeight}}).then(imgProps => {
                    images.push(imgProps);
                })
            }));
        }).catch(e => {
            console.log(e);
        }).then(() => {
            return page.close();
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
                const img1HasHero = RegExp('hero').test(img1.url);
                const img2HasHero = RegExp('hero').test(img2.url);

                // if(img1HasHero && !img2HasHero){
                //     return -1;
                // } else if(img2HasHero && !img1HasHero){
                //     return 1;
                // } else {
                    if(img1Area > img2Area){
                        return -1;
                    } else {
                        return 1;
                    };
                // }
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
    });
};


// // Using async and await keywords
// const getLogoAndHeroImages = async siteURL => {

//     let URLObject = new URL(siteURL);
//     let hostname = URLObject.hostname;
//     let logo = {};
//     let heroCollection = [];
//     let images = [];

//     let browser = await puppeteer.launch();
//     let page = browser.newPage();

//     await page.goto(url);

//     let imgElements = await page.$$('img');
//     await Promise.all(imgElements.map(img => {
//         let imgObj;
//         return img.evaluate(node => { 
//             imgObj = {'url': node.src, 'width': node.naturalWidth, 'height': node.naturalHeight}
//         }).then(() => {
//             images.push(imgObj);
//         });
//     }));
//     await browser.close();


//     logo = images.filter(img => {
//         const logoPattern = RegExp('logo');
//         return(logoPattern.test(img.url));
//     });

//     heroCollection = [...images];
//     heroCollection.sort((img1, img2) => {
//         const img1Area = img1.width * img1.height;
//         const img2Area = img2.width * img2.height;
//         if(img1Area > img2Area){
//             return -1;
//         } else {
//             return 1;
//         };
//     });

//     heroCollection = heroCollection.filter((img, i) => {
//         let notSquare = img.width != img.height;
//         let notDuplicate;
//         if(i === 0){
//             notDuplicate = true;
//         } else {
//             notDuplicate = !(heroCollection[i-1].url == heroCollection[i].url);
//         }
//         return(notSquare 
//             && 
//             notDuplicate
//             );
//     });

//     heroCollection = [heroCollection[0], heroCollection[1], heroCollection[2]];

//     if(logo[0]){
//         logo = logo[0];
//     } else {
//         logo = null;
//     }
//     return { "logo": logo, "heroCollection": heroCollection, "hostname": hostname };
// }



const saveImagesToDisk = (imagesObj, dir) => {
    // const fullUrl = url;

    
    // const dirPath = `output/${imagesObj.hostname}`;
    // if (fs.existsSync(dirPath)){
    //     rmrf(dirPath);
    //     }
    //     fs.mkdirSync(dirPath);
    if (fs.existsSync(`${dir}/logo`)){
        rmrf(`${dir}/logo`);
    }
    fs.mkdirSync(`${dir}/logo`);

    if (fs.existsSync(`${dir}/hero`)){
        rmrf(`${dir}/hero`);
    }
    fs.mkdirSync(`${dir}/hero`);

    if(imagesObj.logo){
        try{
            let logoExtension = imagesObj.logo.url.substring(imagesObj.logo.url.lastIndexOf('.') + 1);
            logoExtension = logoExtension.includes('?')? logoExtension.substring(0, logoExtension.lastIndexOf('?')): logoExtension;
            download(imagesObj.logo.url, `${dir}/logo/logo.${logoExtension}`, function(){
                // console.log('done');
            });      
        } catch(e){
            console.log(e);
        }
    }

    imagesObj.heroCollection.map((img, i) => {
        if(img){
            try{
                let heroExtension = img.url.substring(img.url.lastIndexOf('.') + 1);
                heroExtension = heroExtension.includes('?')? heroExtension.substring(0, heroExtension.lastIndexOf('?')): heroExtension;
                download(img.url, `${dir}/hero/hero-${i}.${heroExtension}`, function(){
                    // console.log('done');
                });
            } catch(e){
                console.log(e);
            }
        }
    })
};

let download = (uri, filename, callback) => {
    return request.head(uri, (err, res, body) => {
    //   console.log('content-type:', res.headers['content-type']);
    //   console.log('content-length:', res.headers['content-length']);
  
      return request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  

module.exports = { getLogoAndHeroImages, saveImagesToDisk }