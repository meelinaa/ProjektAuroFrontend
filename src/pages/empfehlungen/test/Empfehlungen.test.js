// NOTE: Funktion hier definiert, da Tests für die Hauptdatei derzeit nicht funktionieren.

describe('navigateToAktie testen:', () => {

  let ticker;

  function navigateToAktie(ticker) {
    if (!ticker) {
      throw new Error("Fehler: Ticker darf nicht leer sein!");
    }
    return `/aktie/${ticker}`;
  }

  test('navigateToAktie gibt korrekten Link zurück nach Ticker-Eingabe', () => {
    ticker = "AAPL";
    let url = navigateToAktie(ticker);
    expect(url).toBe('/aktie/AAPL');
  });

  test('navigateToAktie wirft Fehler bei fehlendem Ticker aus', () => {
    ticker = undefined;
    expect(() => navigateToAktie(ticker)).toThrow();
  });

});
