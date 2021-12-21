# MagicFormula Investing Helper

**Not an investment advice!**

*The project is WiP, README is under construction.*

This is a small helper tool for people who use 
[Magic Formula](https://www.magicformulainvesting.com/) investment strategy.

The idea is to have your Magic Formula portfolio, history and suggestions
(enriched with financial data) in one place.

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
* (optional) docker-compose v3

The image exposes a web server on port 3000 
and expects a volume (to store your data) to be mounted at `/app/.investool-data/storage`.

You can use any volume, but the examples and compose files are using a bind mount,
mounting a directory from the host machine into the container.

#### Pre-built image
Image name: `ghcr.io/treble-snake/magic-investool`

Example command:
```
docker run -it -p 3000:3000 --mount type=bind,src=<PATH_TO_STORAGE_DIR>,dst=/app/.investool-data/storage ghcr.io/treble-snake/magic-investool
```

Example compose file: [docker-compose.remote.yml](./docker-compose.remote.yml).

Example compose command:
```
<PORT=3000> <STORAGE_DIR=.investool-data/storage> docker-compose -f docker-compose.remote.yml up
```

#### From the code
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