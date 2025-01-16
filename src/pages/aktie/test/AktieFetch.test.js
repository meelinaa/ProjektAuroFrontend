import AktieFetch from "../AktieFetch";

describe('getLiveData', () => {
  let aktieFetch;
  let ticker;

  beforeEach(() => {
    aktieFetch = new AktieFetch();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('getLiveData gibt die korrekten Daten zurück', async () => {
    ticker = "AAPL";
    const mockResponse = [
        {regularMarketPrice: 100, regularMarketChangePercent: 2}
    ];

    fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await aktieFetch.getLiveData(ticker);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/live');
  })

  test('getLiveData gibt einen Fehler bei einem fehlgeschlagenen Request zurück', async () => {
    ticker = "AAPL";
    fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });
      
    await expect(() => aktieFetch.getLiveData(ticker)).rejects.toThrow('Fehler beim Abrufen der Live-Daten: Internal Server Error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/live');
  })
  
  test('getLiveData wirft einen Fehler bei einem Netzwerkproblem', async () => {
    ticker = "AAPL";
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(aktieFetch.getLiveData(ticker)).rejects.toThrow(
      'Network Error'
    );
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/live');
  });

  test('getLiveData wirft einen Fehler bei fehlendem Ticker', async () => {
    await expect(aktieFetch.getLiveData(null)).rejects.toThrow("Fehler: der Ticker darf nicht leer sein");
  })
  

})

describe('getInfoData', () => {
    let aktieFetch;
    let ticker;
  
    beforeEach(() => {
      aktieFetch = new AktieFetch();
      global.fetch = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    })
  
    test('getInfoData gibt die korrekten Daten zurück', async () => {
      ticker = "AAPL";
      const mockResponse = [
          {regularMarketPrice: 100, regularMarketChangePercent: 2}
      ];
  
      fetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
      });
  
      const result = await aktieFetch.getInfoData(ticker);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/infos');
    })
  
    test('getInfoData gibt einen Fehler bei einem fehlgeschlagenen Request zurück', async () => {
      ticker = "AAPL";
      fetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Internal Server Error',
        });
        
      await expect(() => aktieFetch.getInfoData(ticker)).rejects.toThrow('Fehler beim Abrufen der Info-Daten: Internal Server Error');
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/infos');
    })
    
    test('getInfoData wirft einen Fehler bei einem Netzwerkproblem', async () => {
      ticker = "AAPL";
      fetch.mockRejectedValueOnce(new Error('Network Error'));
  
      await expect(aktieFetch.getInfoData(ticker)).rejects.toThrow(
        'Network Error'
      );
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/infos');
    });

    test('getInfoData wirft einen Fehler bei fehlendem Ticker', async () => {
        await expect(aktieFetch.getInfoData(null)).rejects.toThrow("Fehler: der Ticker darf nicht leer sein");
    })

})

describe('getPosition', () => {
    let aktieFetch;
    let ticker;
  
    beforeEach(() => {
      aktieFetch = new AktieFetch();
      global.fetch = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    })
  
    test('getPosition gibt die korrekten Daten zurück', async () => {
      ticker = "AAPL";
      const mockResponse = [
          {regularMarketPrice: 100, regularMarketChangePercent: 2}
      ];
  
      fetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
      });
  
      const result = await aktieFetch.getPosition(ticker);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/positionen');
    })
  
    test('getPosition gibt einen Fehler bei einem fehlgeschlagenen Request zurück', async () => {
      ticker = "AAPL";
      fetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Internal Server Error',
        });
        
      await expect(() => aktieFetch.getPosition(ticker)).rejects.toThrow('Fehler beim Abrufen der Positionen: Internal Server Error');
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/positionen');
    })
    
    test('getPosition wirft einen Fehler bei einem Netzwerkproblem', async () => {
      ticker = "AAPL";
      fetch.mockRejectedValueOnce(new Error('Network Error'));
  
      await expect(aktieFetch.getPosition(ticker)).rejects.toThrow(
        'Network Error'
      );
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/aktie/AAPL/positionen');
    });
    
    test('getPosition wirft einen Fehler bei fehlendem Ticker', async () => {
        await expect(aktieFetch.getPosition(null)).rejects.toThrow("Fehler: der Ticker darf nicht leer sein");
    })
})