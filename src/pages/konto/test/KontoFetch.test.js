import KontoFetch from "../KontoFetch";

describe('getGuthaben', () => {
  let kontoFetch;

  beforeEach(() => {
    kontoFetch = new KontoFetch();
    global.fetch = jest.fn();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('getGuthaben gibt die korrekten Daten zurück', async () => {
    const mockResponse = [
        {guthaben: 25000}
    ];
    fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
    });
    const result = await kontoFetch.getGuthaben();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/konto/guthaben");
  });

  test('getGuthaben wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });
    await expect(kontoFetch.getGuthaben()).rejects.toThrow('Fehler beim Abrufen des Guthabens: Internal Server Error');
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/konto/guthaben");
  });

  test('getGuthaben wirft einen Fehler bei einem Netzwerkproblem', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(kontoFetch.getGuthaben()).rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/konto/guthaben");
  });
  
});

describe('getName', () => {
  let kontoFetch;

  beforeEach(() => {
    kontoFetch = new KontoFetch();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getName gibt die korrekten Daten zurück', async () => {
    const mockResponse = [
      {name: "Meta"}
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });
    const result = await kontoFetch.getName();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/konto/name");
  });
  
  test('getName wirft einen Fehler bei einem fehlgeschlagenen Request', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });
    await expect(kontoFetch.getName()).rejects.toThrow('Fehler beim Abrufen des Namens: Internal Server Error');
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/konto/name");
  });
  
  test('getName wirft einen Fehler bei einem Netzwerkproblem', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(kontoFetch.getName()).rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/konto/name");
  });
    
});