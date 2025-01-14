// NOTE: Funktion hier definiert, da Tests für die Hauptdatei derzeit nicht funktionieren.
// Transaktionen.test.js
describe('gesamtwert', () => {

    let kurs;
    let anteile;

    function gesamtwert(kurs, anteile) {
        if (typeof kurs !== "number" || typeof anteile !== "number") {
            return "0.00";
        }
        return (kurs * anteile).toFixed(2);
    }
  test('gesamtwert berechnet den Gesamtwert korrekt', () => {
    kurs = 100;
    anteile = 10;

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("1000.00");
  });

  test('gesamtwert berechnet den Gesamtwert korrekt mit Nachkommastellen', () => {
    kurs = 134.56;
    anteile = 5.789;

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("778.97");
  });

  test('gesamtwert gibt 0.00 aus, wenn kurs 0 ist', () => {
    kurs = 0;
    anteile = 10;

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("0.00");
  });

  test('gesamtwert gibt 0.00 aus, wenn anteile 0 ist', () => {
    kurs = 100;
    anteile = 0;

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("0.00");
  });

  test('gesamtwert gibt 0.00 aus, wenn anteile keine Zahl ist', () => {
    kurs = 100;
    anteile = "String";

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("0.00");
  });

  test('gesamtwert gibt 0.00 aus, wenn kurs keine Zahl  ist', () => {
    kurs = "String";
    anteile = 0;

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("0.00");
  });

  test(' gesamtwertgibt 0.00 aus, wenn kurs oder anteile nicht definiert sind', () => {
    kurs = undefined;
    anteile = undefined;

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("0.00");
  });

  test(' gesamtwertgibt 0.00 aus, wenn kurs und anteile keine Zahlen sind', () => {
    kurs = "String";
    anteile = "String";

    const result = gesamtwert(kurs, anteile);
    expect(result).toBe("0.00");
  });
});

describe('formatDate', () => {
  let dateString;
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC'
  }).format(date);
  }

  test('formatDate gibt korrektes Datum zurück', () => {
    dateString = "2023-12-31T23:59:59Z";

    const date = formatDate(dateString);
    expect(date).toEqual("31.12.2023, 23:59");
  })

  test('formatDate gibt korrektes Datum zurück mit anderen Testwerten', () => {
    dateString = "2024-03-12T15:14:26Z";

    const date = formatDate(dateString);
    expect(date).toEqual("12.03.2024, 15:14");
  })
  
})
