# MagicFormula Investing Helper

**Not an investment advice!**

The project is WiP, README is under construction.

Magic Formula Data Source: https://www.magicformulainvesting.com/

Financial Data Source: https://www.yahoofinanceapi.com/

## Configuration
Happens via environment variables (you can utilise `.env` files).
Magic Formula:
* MF_AUTH_EMAIL - magic formula account's email
* MF_AUTH_PASSWORD - magic formula account's password

Financial Data:
* YAHOO_API_KEY - API key for Yahoo Finance API
* BASE_YAHOO_URL (default: https://yfapi.net) - Yahoo Finance API origin 
* FINANCE_CACHE_THRESHOLD_HRS (default: 24) - if cache has data within given amount of hours,
it will be used instead of external API call

Storage:
* STORAGE_DIR - folder to store data in JSON format (make sure it has)
* REPORT_DIR - folder to write MagicFormula change reports in txt format

Deprecated?:
* PORTFOLIO_FILENAME - (default: portfolio.json)
* HISTORY_FILENAME - (default: history.json)
* MAGIC_FORMULA_FILENAME = (default: mfState.json)
