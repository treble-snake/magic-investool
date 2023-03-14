# MagicFormula Investing Helper

**Not an investment advice!**

*The project is WiP, README is under construction.*

This is a small helper tool for people who use 
[Magic Formula](https://www.magicformulainvesting.com/) investment strategy.

The idea is to have your Magic Formula portfolio, history and suggestions
(enriched with financial data) in one place.

## Running
### Standalone App
You can download the latest built app from the [Releases](https://github.com/treble-snake/magic-investool/releases) page.

Currently, MacOS and Windows are supported.

Unfortunately, code signing and atuo-updates are not available at the moment. 

#### Building from sources
App is based on Electron, the code is under `electron/` folder.

Detailed instructions: TBD.

### In Docker
**Prerequisites:**
* Docker
* (optional) docker-compose v3

The image exposes a web server on port 3000 
and expects a volume (to store your data) to be mounted at `/app/.investool-data/storage`.

You can use any volume, but the example and compose file are using a bind mount,
mounting a directory from the host machine into the container.

Example compose file: [docker-compose.yml](./docker-compose.yml).

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

### From source code
(!) OUTDATED, NEEDS REWORK (!) 

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