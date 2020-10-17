#!/usr/bin/env node

const { getLogoAndHeroImages, saveImagesToDisk } = require('../src/heroGrab');
const fs = require('fs');
const puppeteer = require('puppeteer');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'site', alias: 's', type: String },
    { name: 'directory', alias: 'd', type: String }
  ];
const options = commandLineArgs(optionDefinitions);
  
async function go(){
    // console.log(options);
    // process.exit(1)

    let success = true;
    if(!options.site){
      console.log("\"site\" is a required parameter. See the documentation")
      success = false;
    }
    if(!options.directory){
      console.log("\"directory\" is a required parameter. See the documentation")
      success = false;
    }
    if(success){
      let browser = await puppeteer.launch();
      await getLogoAndHeroImages(options.site, browser)
      .then(obj => {
        // console.log(obj);
        console.log("Retrieved image urls...")
        return saveImagesToDisk(obj, options.directory);
      }).then(() => {
        setTimeout(() => {
          console.log(`Downloaded images to ${options.directory} -- Done.`)
          process.exit(1);
        }, 5000);
      });
    }
}

go();