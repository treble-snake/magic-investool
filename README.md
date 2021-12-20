# MagicFormula Investing Helper

**Not an investment advice!**

*The project is WiP, README is under construction.*

This is a small helper tool for people who use 
[Magic Formula](https://www.magicformulainvesting.com/) investment strategy.

## Running
### From source code
**Prerequisites:**
* Node >= 14
* Yarn v1 or NPM

Clone the repo. Run (you can use npm instead of yarn):
* `yarn install`
* `yarn setup` - follow the configuration instructions
* `<PORT=3000> yarn start` - Web UI should be up and running on http://localhost:3000 by default

Environment variables (you can utilise `.env` files):
* STORAGE_DIR (required) - folder to store data in JSON format
* PORT (default: 3000) - port to serve Web UI from
* BASE_YAHOO_URL (default: https://yfapi.net) - Yahoo Finance API origin

### In Docker
**Prerequisites:**
* Docker

Clone the repo. Run:
```
<PORT=3000> <STORAGE_DIR=.investool-data/storage> docker-compose up
```
Web UI should be up and running on http://localhost:3000 by default.

Environment variables:
* STORAGE_DIR (default: <PROJECT_ROOT>/.investool-data/storage) - 
  folder to store data in JSON format; 
  will be mounted as a volume to the docker container. 
* PORT (default: 3000) - port to serve Web UI from