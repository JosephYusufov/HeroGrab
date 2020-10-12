# HeroGrab
A simple command-line webscraping utility to retrieve a logo, and three hero images from a list of websites.

## Usage Instructions
- Clone repository and `cd HeroGrab`
- Run `npm i` to install dependencies
- Navigate to `/input/urls.JSON`
  - The array of urls in `urls.JSON` will be read by the program. These are the sites that will be scraped. There are a few sites already there examples, feel free to play with them and add / remove based on your needs.
- Once `urls.JSON` has the sites you'd like scraped, run `npm run start`.
- **NOTE**: npm may or may not throw an error after the process terminates. This is a known bug that is being resolved, ignore the error as the program still functions completely as expected.
- Navigate to `/output`. Each site that was scraped will have its own directory.
  - Within each site directory, there will be two directories. `logo/` and `hero/`. 
    - `logo/` will either contain one file, `logo.[png|svg|jpg|jpeg]`, or be empty if a logo could not be scraped.
    - `hero/` will contain three files, titled `hero-[1|2|3].[png|svg|jpg|jpeg]`

## Known Bugs
- npm may or may not throw an error after the process terminates. This is a known bug that is being resolved, ignore the error as the program still functions completely as expected.