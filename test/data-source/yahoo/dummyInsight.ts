export const dummyInsight = (ticker: string) => {
  return {
    "finance": {
      "result": {
        "symbol": ticker,
        "instrumentInfo": {
          "technicalEvents": {
            "provider": "Trading Central",
            "shortTerm": "down",
            "midTerm": "up",
            "longTerm": "down"
          },
          "keyTechnicals": {
            "provider": "Trading Central",
            "support": 24.37,
            "resistance": 51.67,
            "stopLoss": 42.129343
          },
          "valuation": {
            "color": 1,
            "description": "Undervalued",
            "discount": "7%",
            "relativeValue": "Discount",
            "provider": "Trading Central"
          },
          "recommendation": {
            "targetPrice": 52,
            "provider": "Argus Research",
            "rating": "HOLD"
          }
        },
        "reports": [
          {
            "id": "4516_Quantitative Report_1629244800000",
            "title": "Lowering target price to $52.00",
            "provider": "Argus Research",
            "publishedOn": "2021-08-18T00:00:00Z",
            "summary": "AMC NETWORKS INC-A has an Investment Rating of HOLD; a target price of $52.000000; an Industry Subrating of High; a Management Subrating of Medium; a Safety Subrating of Medium; a Financial Strength Subrating of Medium; a Growth Subrating of Medium; and a Value Subrating of Medium."
          },
        ],
        "companySnapshot": {
          "sectorInfo": "Communication Services",
          "company": {
            "innovativeness": 0.10189999999999999,
            "hiring": 0.35710000000000003,
            "insiderSentiments": 0.2041,
            "earningsReports": 0.7658
          },
          "sector": {
            "innovativeness": 0.5,
            "hiring": 0.5,
            "sustainability": 0.5,
            "insiderSentiments": 0.5,
            "earningsReports": 0.5,
            "dividends": 0.5
          }
        }
      },
      "error": null
    }
  }
}