import PortfolioFetch from "../PortfolioFetch";

describe('getAllePortfolioInfos', () => {
    let portfolioFetch; 

    beforeEach(() => {
        portfolioFetch = new PortfolioFetch();
        global.fetch = jest.fn();
    });  

    afterEach(() => {
        jest.clearAllMocks();
    });

  test('getAllePortfolioInfos gibt die korrekten Daten zurück', async () => {
    const mockResponse = {id:1, name:"Max"};
    fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await portfolioFetch.getAllePortfolioInfos();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/1');
  })

  test('getAllePortfolioInfos wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
    });

    await expect(portfolioFetch.getAllePortfolioInfos())
        .rejects.toThrow('Fehler beim Abrufen der Portfolio Infos: Internal Server Error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/1');
  });

  test('getAllePortfolioInfos wirft einen Fehler bei einem Netzwerkproblem', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));
    await expect(portfolioFetch.getAllePortfolioInfos())
        .rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/1');
  });

});

describe('getAlleAktien', () => {
    let portfolioFetch;
  
    beforeEach(() => {
      portfolioFetch = new PortfolioFetch();
      global.fetch = jest.fn();
    })
  
    afterEach(() => {
      jest.clearAllMocks();
    })
  
    test('getAlleAktien gibt die korrekten Daten zurück', async () => {
        const mockResponse = [
          {id: "AAPL", name:"Apple", buyInKurs:120, anteile:5},
          {id: "META", name:"Meta", buyInKurs:250, anteile:8},
        ];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
          });
        
          const result = await portfolioFetch.getAlleAktien();
          expect(result).toEqual(mockResponse);
          expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/aktien/get/1');
    })
    
    test('getAlleAktien wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });
  
      await expect(portfolioFetch.getAlleAktien()).rejects.toThrow(
        'Fehler beim Abrufen der Aktien: Internal Server Error'
      );
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/aktien/get/1');
    });
  
    test('getAlleAktien wirft einen Fehler bei einem Netzwerkproblem', async () => {
      fetch.mockRejectedValueOnce(new Error('Network Error'));
  
      await expect(portfolioFetch.getAlleAktien()).rejects.toThrow(
        'Network Error'
      );
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/aktien/get/1');
    });
  
});
 
describe('getAlleOrder', () => {
    let portfolioFetch;

    beforeEach(() => {
        portfolioFetch = new PortfolioFetch();
        global.fetch = jest.fn();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('getAlleOrder gibt die korrekten Daten zurück', async () => {
        const mockResponse = [
            {id: "AAPL", name:"Apple", buyInKurs:120, anteile:5},
            {id: "META", name:"Meta", buyInKurs:250, anteile:8},
        ];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });
        
        const result = await portfolioFetch.getAlleOrder();
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/order/get/1');
    })

    test('getAlleOrder wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            statusText: 'Internal Server Error',
        });
      
        await expect(portfolioFetch.getAlleOrder())
            .rejects.toThrow('Fehler beim Abrufen der Transaktionen: Internal Server Error');
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/order/get/1');
    });

    test('getAlleOrder wirft einen Fehler bei einem Netzwerkproblem', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));
        await expect(portfolioFetch.getAlleOrder()).rejects.toThrow('Network Error');
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/portfolio/order/get/1');
    });

});
  