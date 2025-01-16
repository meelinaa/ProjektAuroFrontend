// NOTE: Funktion hier definiert, da Tests für die Hauptdatei derzeit nicht funktionieren.

describe('getCssClass testen:', () => {

  function getCssClass(value) {
    return value > 0 ? "positive-change" : value < 0 ? "negative-change" : "neutral";
  };

  test('getCssClass gibt "positive-change" für positive Werte zurück', () => {
    expect(getCssClass(10)).toBe('positive-change');
  });

  test('getCssClass gibt "negative-change" für negative Werte zurück', () => {
    expect(getCssClass(-5)).toBe('negative-change');
  });

  test('getCssClass gibt "neutral" für den Wert 0 zurück', () => {
    expect(getCssClass(0)).toBe('neutral');
  });

  test('getCssClass gibt "neutral" für undefined zurück', () => {
    expect(getCssClass(undefined)).toBe('neutral');
  });

  test('getCssClass gibt "neutral" für null zurück', () => {
    expect(getCssClass(null)).toBe('neutral');
  });

});

describe('positionenBerechnen testen:', () => {

  let deineDaten;
  let liveDaten;

  function positionenBerechnen(deineDaten, liveDaten) {
    if (deineDaten.anzahlAktienAnteile === 0 || 
      !deineDaten || 
      !liveDaten || 
      typeof deineDaten.buyInKurs !== "number" ||
      typeof deineDaten.anzahlAktienAnteile !== "number" ||
      typeof liveDaten.regularMarketPrice !== "number"
    ) {
      return { gesamtwertPosition:0, renditePosition:0, performancePosition:0 };
    };

    let buyIn = deineDaten.buyInKurs;
    let anteile = deineDaten.anzahlAktienAnteile;
    let gesamtwertAlt = buyIn * anteile;
    let gesamtwertNeu = liveDaten.regularMarketPrice * anteile
    let gesamtwertPosition = parseFloat(gesamtwertNeu.toFixed(2));
    let renditePosition = parseFloat((gesamtwertNeu - gesamtwertAlt).toFixed(2));
    let performancePosition = parseFloat((((gesamtwertNeu - gesamtwertAlt) / gesamtwertAlt) * 100).toFixed(2));
  
    return { gesamtwertPosition, renditePosition, performancePosition };
  };

  test('positionenBerechnen berechnet korrekte Positionen für gültige Eingaben', () => {
    deineDaten = {buyInKurs: 100, anzahlAktienAnteile: 10};
    liveDaten = {regularMarketPrice: 120};

    const result = positionenBerechnen(deineDaten,liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 1200,
      renditePosition: 200,
      performancePosition: 20,
    });
  });

  test('positionenBerechnen gibt Nullwerte zurück, wenn keine Anteile vorhanden sind', () => {
    deineDaten = { buyInKurs: 100, anzahlAktienAnteile: 0 };
    liveDaten = { regularMarketPrice: 120 };

    const result = positionenBerechnen(deineDaten, liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 0,
      renditePosition: 0,
      performancePosition: 0,
    });
  });

  test('positionenBerechnen gibt Nullwerte zurück, wenn der Buy-In-Kurs nicht definiert ist', () => {
    deineDaten = { buyInKurs: undefined, anzahlAktienAnteile: 0 };
    liveDaten = { regularMarketPrice: 120 };

    const result = positionenBerechnen(deineDaten, liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 0,
      renditePosition: 0,
      performancePosition: 0,
    });
  });

  test('positionenBerechnen gibt Nullwerte zurück, wenn die Anzahl der Aktienanteile nicht definiert ist', () => {
    deineDaten = { buyInKurs: 100, anzahlAktienAnteile: undefined };
    liveDaten = { regularMarketPrice: 120 };

    const result = positionenBerechnen(deineDaten, liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 0,
      renditePosition: 0,
      performancePosition: 0,
    });
  });

  test('positionenBerechnen gibt Nullwerte zurück, wenn der aktuelle Marktpreis nicht definiert ist', () => {
    deineDaten = { buyInKurs: 100, anzahlAktienAnteile: 10 };
    liveDaten = { regularMarketPrice: undefined };

    const result = positionenBerechnen(deineDaten, liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 0,
      renditePosition: 0,
      performancePosition: 0,
    });
  });

  test('positionenBerechnen gibt Nullwerte zurück, wenn alle Eingabewerte nicht definiert sind', () => {
    deineDaten = { buyInKurs: undefined, anzahlAktienAnteile: undefined };
    liveDaten = { regularMarketPrice: undefined };

    const result = positionenBerechnen(deineDaten, liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 0,
      renditePosition: 0,
      performancePosition: 0,
    });
  });

  test('positionenBerechnen gibt Nullwerte zurück, wenn alle Eingabewerte null sind', () => {
    deineDaten = { buyInKurs: null, anzahlAktienAnteile: null };
    liveDaten = { regularMarketPrice: null };

    const result = positionenBerechnen(deineDaten, liveDaten);

    expect(result).toEqual({
      gesamtwertPosition: 0,
      renditePosition: 0,
      performancePosition: 0,
    });
  });
  
});

describe('CreateOrderUrl testen:', () => {

  let liveKurs;
  let ticker;
  let orderType;
  let companyName;

  function createOrderUrl(liveKurs, ticker, orderType, companyName) {
    if (!liveKurs || !ticker || !orderType || !companyName) {
      throw new Error("Fehler: Die Inputs dürfen nicht leer sein");
    };   
    return `/order/${liveKurs}/${ticker}/${orderType}/${companyName}`;
  };

  test('CreateOrderUrl generiert korrekte URL für Verkaufsorder', () => {
    liveKurs = 120;
    ticker = "AAPL";
    orderType = "sell";
    companyName = "Apple";

    const url = createOrderUrl(liveKurs, ticker, orderType, companyName);
    expect(url).toBe('/order/120/AAPL/sell/Apple');
  });

  test('CreateOrderUrl generiert korrekte URL für Kauforder', () => {
    liveKurs = 120;
    ticker = "AAPL";
    orderType = "buy";
    companyName = "Apple";

    const url = createOrderUrl(liveKurs, ticker, orderType, companyName);
    expect(url).toBe('/order/120/AAPL/buy/Apple');
  });

  test('CreateOrderUrl generiert error für leeren Live Kurs', () => {
    liveKurs = undefined;
    ticker = "AAPL";
    orderType = "buy";
    companyName = "Apple";

    expect(() => createOrderUrl(liveKurs, ticker, orderType, companyName)).toThrow("Fehler: Die Inputs dürfen nicht leer sein");
  });
  
  test('CreateOrderUrl generiert error für leeren Ticker', () => {
    liveKurs = 120;
    ticker = undefined;
    orderType = "buy";
    companyName = "Apple";

    expect(() => createOrderUrl(liveKurs, ticker, orderType, companyName)).toThrow("Fehler: Die Inputs dürfen nicht leer sein");
  });

  test('CreateOrderUrl generiert error für leeren OrderType', () => {
    liveKurs = 120;
    ticker = "AAPL";
    orderType = undefined;
    companyName = "Apple";

    expect(() => createOrderUrl(liveKurs, ticker, orderType, companyName)).toThrow("Fehler: Die Inputs dürfen nicht leer sein");
  });

  test('CreateOrderUrl generiert error für leeren Company Name', () => {
    liveKurs = 120;
    ticker = "AAPL";
    orderType = "buy";
    companyName = undefined;

    expect(() => createOrderUrl(liveKurs, ticker, orderType, companyName)).toThrow("Fehler: Die Inputs dürfen nicht leer sein");
  });
  
});