* add import-alias ?
* Cache cleanup
  * cleanup cache periodically
* transactions :(
* file-system-cache - ts version ?

---

## Fin rework:

### From Alphavantage:

Limits:
- 5 API requests per minute
- 500 requests per day.

Info:
- basic info: https://www.alphavantage.co/documentation/#company-overview
- revenue info: https://www.alphavantage.co/documentation/#income-statement
- (later) Balance & Cashflow info: https://www.alphavantage.co/documentation/#balance-sheet
- (later) Earnings? https://www.alphavantage.co/documentation/#earnings

### Form finnhub:

Limits:
- 60 API calls/minute
- Websocket	50 symbols

Info:
- Realtime price: https://finnhub.io/docs/api/quote or https://finnhub.io/docs/api/websocket-trades
- Buy/sell recommendations: https://finnhub.io/docs/api/recommendation-trends
- (later) Sentiment: https://finnhub.io/docs/api/insider-sentiment
- (later) Earnings surprise: https://finnhub.io/docs/api/company-earnings