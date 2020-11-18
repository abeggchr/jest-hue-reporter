# Jest Hue Reporter

Reports Jest test results to Phillips Hue light bulbs.

## Setup

1. Clone this repo to a folder
1. Execute `npm install`
1. (Discover and connect to the Hue Bridge for the first time)[https://github.com/peter-murray/node-hue-api/blob/main/examples/v3/remote/accessFromScratch.js] as
   described in node-hue-api documentation
1. Change `hue-reporter.js` file and fill in your USERNAME, IP and LAMP_IDS

## Usage

1. Change `package.json` of your application and add a new `test.hue` script which includes the hue reporter: `"test.hue": "react-scripts test --reporters='default' --reporters='../hue-reporter/hue-reporter.js'`
