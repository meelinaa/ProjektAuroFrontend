import TransaktionenFetch from '../TransaktionenFetch';

describe('TransaktionenFetch', () => {
  let transaktionenFetch;

  beforeEach(() => {
    transaktionenFetch = new TransaktionenFetch();
    global.fetch = jest.fn(); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('getAlleTransaktionen gibt die korrekten Daten zurück', async () => {
    const mockResponse = [
      { id: 1, orderType: 'buy', aktienName: 'AAPL' },
      { id: 2, orderType: 'sell', aktienName: 'GOOGL' },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await transaktionenFetch.getAlleTransaktionen();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/order/all');
  });

  test('getAlleTransaktionen wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(transaktionenFetch.getAlleTransaktionen()).rejects.toThrow(
      'Fehler beim Fetch aller Transaktionen: Internal Server Error'
    );
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/order/all');
  });

  test('getAlleTransaktionen wirft einen Fehler bei einem Netzwerkproblem', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(transaktionenFetch.getAlleTransaktionen()).rejects.toThrow(
      'Network Error'
    );
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/order/all');
  });
});
