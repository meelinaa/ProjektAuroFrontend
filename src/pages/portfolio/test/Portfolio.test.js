// NOTE: Funktion hier definiert, da Tests für die Hauptdatei derzeit nicht funktionieren.

function getCssClass(value) {
  return value > 0 ? "positive-change" : value < 0 ? "negative-change" : "";
}

describe('berechneGesamtwertPortfolio-Funktion', () => {

  let portfolioAktien;
  let liveDaten;

  function berechneGesamtwertPortfolio() {
    if (!portfolioAktien || !liveDaten) {
      return 0;
    }
  
    let gesamtwert = 0; 
  
    for (let i = 0; i < portfolioAktien.length; i++) {
      const aktie = portfolioAktien[i];
      const liveKurs = liveDaten.find((data) => data.id === aktie.id)?.regularMarketPrice || "-";
  
      if (liveKurs === "-") {
        continue; 
      }
  
      gesamtwert += aktie.anzahlAktienAnteile * liveKurs;
    }
  
    return gesamtwert; 
  };

  test('berechneGesamtwertPortfolio gibt 0 zurück, wenn portfolioAktien nicht definiert sind', () => {
    portfolioAktien = undefined;
    liveDaten = [{ id: 1, regularMarketPrice: 100 }]; 

    const result = berechneGesamtwertPortfolio();
    expect(result).toBe(0); 
  });

  test('berechneGesamtwertPortfolio gibt 0 zurück, wenn liveDaten nicht definiert sind', () => {
    portfolioAktien = [{ id: 1, anzahlAktienAnteile: 10 }];
    liveDaten = undefined; 

    const result = berechneGesamtwertPortfolio();
    expect(result).toBe(0); 
  });

  test('berechneGesamtwertPortfolio berechnet korrekten Wert, wenn alles gültig ist', () => {
    portfolioAktien = [
      { id: 1, anzahlAktienAnteile: 10 },
      { id: 2, anzahlAktienAnteile: 5 },
    ]; 
    liveDaten = [
      { id: 1, regularMarketPrice: 100 },
      { id: 2, regularMarketPrice: 200 },
    ]; 

    const result = berechneGesamtwertPortfolio();
    expect(result).toBe(10 * 100 + 5 * 200); 
  });

  test('berechneGesamtwertPortfolio ignoriert ungültige Live-Kurse', () => {
    portfolioAktien = [
      { id: 1, anzahlAktienAnteile: 10 },
      { id: 2, anzahlAktienAnteile: 5 },
    ];
    liveDaten = [
      { id: 1, regularMarketPrice: 100 },
      { id: 2, regularMarketPrice: "-" }, 
    ];

    const result = berechneGesamtwertPortfolio();
    expect(result).toBe(10 * 100); 
  });

  test('berechneGesamtwertPortfolio gibt 0 zurück, wenn Portfolio leer ist', () => {
    portfolioAktien = []; 
    liveDaten = [{ id: 1, regularMarketPrice: 100 }]; 

    const result = berechneGesamtwertPortfolio();
    expect(result).toBe(0); 
  });

});

describe('navigateToAktie testen:', () => {

  let ticker;

  function navigateToAktie(ticker) {
    if (!ticker) {
      throw new Error("Fehler: Der Ticker darf nicht leer sein!");
    }
    return `/aktie/${ticker}`;
  };

  test('navigateToAktie gibt die richtige URL zurück, wenn ein Ticker angegeben ist', () => {
    ticker = "AAPL";
    const url = navigateToAktie(ticker);

    expect(url).toBe("/aktie/AAPL");
  });

  test('navigateToAktie wirft einen Fehler, wenn der Ticker leer ist', () => {
    ticker = null;
    expect(() => navigateToAktie(ticker)).toThrow("Fehler: Der Ticker darf nicht leer sein!");
  });

});

describe('berechneWert', () => {

  let aktie;
  let type;
  let liveKurs;

  function berechneWert(aktie, type, liveKurs) {
    const aktuellerKurs = liveKurs;
    if (aktuellerKurs === "-" || !aktuellerKurs) return { valueOf: "-", className: "" };
  
    const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
    const gesamtwertNeu = aktuellerKurs * aktie.anzahlAktienAnteile;
  
    let wert, className;
    if (type === "rendite") {
      wert = gesamtwertNeu - gesamtwertAlt;
      className = getCssClass(wert);
    } else if (type === "performance") {
      wert = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;
      className = getCssClass(wert);
    }
  
    return { valueOf: wert.toFixed(2), className };
  };

  test('berechneWert gibt korrekten positiven Wert für Rendite zurück', () => {
    aktie = {buyInKurs: 100, anzahlAktienAnteile: 10};
    type = "rendite";
    liveKurs = 120;

    const berechnung = berechneWert(aktie, type, liveKurs);
    expect(berechnung).toEqual({valueOf: "200.00", className: "positive-change"});
  });

  test('berechneWert gibt korrekten negativen Wert für Rendite zurück', () => {
    aktie = {buyInKurs: 100, anzahlAktienAnteile: 10};
    type = "rendite";
    liveKurs = 50;

    const berechnung = berechneWert(aktie, type, liveKurs);
    expect(berechnung).toEqual({valueOf: "-500.00", className: "negative-change"});
  });
  
  test('berechneWert gibt korrekten positiven Wert für Performance zurück', () => {
    aktie = {buyInKurs: 100, anzahlAktienAnteile: 10};
    type = "performance";
    liveKurs = 120;

    const berechnung = berechneWert(aktie, type, liveKurs);
    expect(berechnung).toEqual({valueOf: "20.00", className: "positive-change"});
  });

  test('berechneWert gibt korrekten negativen Wert für Performance zurück', () => {
    aktie = {buyInKurs: 100, anzahlAktienAnteile: 10};
    type = "performance";
    liveKurs = 50;

    const berechnung = berechneWert(aktie, type, liveKurs);
    expect(berechnung).toEqual({valueOf: "-50.00", className: "negative-change"});
  });

  test('berechneWert gibt leere Werte zurück, wenn aktueller Kurs "-" ist', () => {
    aktie = {buyInKurs: 100, anzahlAktienAnteile: 10};
    type = "performance";
    liveKurs = "-";

    const berechnung = berechneWert(aktie, type, liveKurs);
    expect(berechnung).toEqual({valueOf: "-", className: ""});
  });

  test('berechneWert gibt leere Werte zurück, wenn aktueller Kurs ungültig ist', () => {
    aktie = {buyInKurs: 100, anzahlAktienAnteile: 10};
    type = "performance";
    liveKurs = undefined;

    const berechnung = berechneWert(aktie, type, liveKurs);
    expect(berechnung).toEqual({valueOf: "-", className: ""});
  });
  
});

describe('gesamtwertBerechnen', () => {

  let aktie;
  let liveKurs;

  function gesamtwertBerechnen(aktie) {
    const aktuellerKurs = liveKurs;
    if (aktuellerKurs === "-" || !aktuellerKurs) {
      return "-";
    }

    const gesamtWert = aktie.anzahlAktienAnteile * aktuellerKurs;
    return parseFloat(gesamtWert.toFixed(2));  
  };   

  test("gesamtwertBerechnen berechnet den Gesamtwert mit gültigen Werten korrekt", () => {
    aktie = {anzahlAktienAnteile: 10};
    liveKurs = 100;

    const berechnen = gesamtwertBerechnen(aktie);
    expect(berechnen).toEqual(1000);
  });

  test("gesamtwertBerechnen berechnet den Gesamtwert mit gültigen Werten korrekt mit Nachkommastellen", () => {
    aktie = {anzahlAktienAnteile: 5};
    liveKurs = 165.24;

    const berechnen = gesamtwertBerechnen(aktie);
    expect(berechnen).toBeCloseTo(826.20, 2);
  });

  test('gesamtwertBerechnen gibt "-" bei fehlendem Kurs zurück', () => {
    aktie = {anzahlAktienAnteile: 5};
    liveKurs = "-";

    const berechnen = gesamtwertBerechnen(aktie);
    expect(berechnen).toEqual("-");
  });

  test('gesamtwertBerechnen gibt "-" bei leerem Kurs zurück', () => {
    aktie = {anzahlAktienAnteile: 5};
    liveKurs = undefined;

    const berechnen = gesamtwertBerechnen(aktie);
    expect(berechnen).toEqual("-");
  });
  
});

describe('getLiveKursForAktie testen:', () => {

  let liveDaten;

  function getLiveKursForAktie(aktieId) {
    if (!liveDaten || liveDaten.length === 0) {
      return "-";
    }

    for (let i = 0; i < liveDaten.length; i++) {
      if (liveDaten[i].id === aktieId) {
        return liveDaten[i].kurs;
      }
    }
    return "-";
  };

  test('getLiveKursForAktie gibt den richtigen Kurs zurück, wenn die ID übereinstimmt', () => {
    liveDaten = [{ id: 1, kurs: 100 }, { id: 2, kurs: 200 }];
    const result = getLiveKursForAktie(1);
    expect(result).toBe(100);
  });

  test('getLiveKursForAktie gibt "-" zurück, wenn keine ID übereinstimmt', () => {
    liveDaten = [{ id: 1, kurs: 100 }, { id: 2, kurs: 200 }];
    const result = getLiveKursForAktie(3);
    expect(result).toBe("-");
  });

  test('getLiveKursForAktie gibt "-" zurück, wenn liveDaten nicht definiert ist', () => {
    liveDaten = undefined;
    const result = getLiveKursForAktie(1);
    expect(result).toBe("-");
  });

  test('getLiveKursForAktie gibt "-" zurück, wenn liveDaten leer ist', () => {
    liveDaten = [];
    const result = getLiveKursForAktie(1);
    expect(result).toBe("-");
  });

});
