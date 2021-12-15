# MagicFormula Investing Helper

**Not an investment advice!**

The project is WiP, README is under construction.

Magic Formula Data Source: https://www.magicformulainvesting.com/

Financial Data Source: https://www.yahoofinanceapi.com/

**Warning:** keep in mind Yahoo API has a limit of requests per day. 

## Prerequisites
* Node >= 14
* Yarn v1 or NPM

## Running
Clone the repo. Run (you can use npm):
* `yarn install`
* `yarn setup` - follow the configuration instructions
* `yarn start` - Web UI should be up and running on http://localhost:3000 by default

## Advanced Configuration
Happens via environment variables (you can utilise `.env` files).

Storage:
* STORAGE_DIR (required) - folder to store data in JSON format

Financial Data:
* BASE_YAHOO_URL (default: https://yfapi.net) - Yahoo Finance API origin