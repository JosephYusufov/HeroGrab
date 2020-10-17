# HeroGrab
A simple command-line webscraping utility to retrieve a logo, and three hero images from a list of websites.

## Usage Instructions
- Clone repository and `cd HeroGrab`
- Run `npm i` to install dependencies
- Run `npm i -g .` to make the `heroGrabber` command line utility globally available on your machine.

| Argument      | Description |
| ------------- | ----------- |
| Target Site   | `--site`, `-s`, the URL of the site to be scraped |
| Directory     | `--directory`, `-d`, the path of the directory to which `heroGrabber` should save the images. **Note:** This directory must exist. |

## Examples
`$ heroGrabber --site https://www.redcross.org --directory ./output`
Saves the Red Cross logo, and three hero images from the site, to the relative path `./output`
