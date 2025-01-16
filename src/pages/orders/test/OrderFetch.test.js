import OrderFetch from "../OrderFetch";

describe('setTransaktion', () => {
  let ticker = "AAPL";
  let orderType = "sell";
  let liveKurs = 120.34;
  let anteile = 4;
  let companyName = "Apple";

  let orderFetch;

  const fetchOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker: ticker,
      orderType: orderType,
      liveKurs: liveKurs,
      anteile: anteile,
      companyName: companyName,
    }),
  }

  beforeEach(() => {
    orderFetch = new OrderFetch();
    global.fetch = jest.fn();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('setTransaktionen sendet die korrekten Daten mit POST-Request', async () => {
    const mockResponse = {id:1, ticker: "AAPL", orderType: "sell", liveKurs: 120.34, anteile: 4, companyName: "Apple"};

    fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

    const transaktion = await orderFetch.setTransaktion(ticker, orderType, liveKurs, anteile, companyName);
    expect(transaktion).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/order/transaktion", fetchOptions);
  })

  test('setTransaktion wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
    })

    await expect(orderFetch.setTransaktion(ticker, orderType, liveKurs, anteile, companyName))
        .rejects.toThrow('Fehler beim Speichern der Transaktion: Internal Server Error');
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/order/transaktion", fetchOptions);
  })
  
  test('setTransaktion wirft einen Fehler bei einem Netzwerkproblem', async () => {
    fetch.mockRejectedValueOnce(new Error ('Network Error'));

    await expect(orderFetch.setTransaktion(ticker, orderType, liveKurs, anteile, companyName))
        .rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/order/transaktion", fetchOptions);
  })
  
  test('setTransaktion wirft einen Fehler bei fehlendem Parameter', async () => {
    ticker = undefined;

    await expect(orderFetch.setTransaktion(ticker, orderType, liveKurs, anteile, companyName))
        .rejects.toThrow("Fehler: ungültiger oder fehlender Parameter");
  })
})
