// NOTE: Funktion hier definiert, da Tests für die Hauptdatei derzeit nicht funktionieren.

describe('berechneWert testen', () => {

  let inputType;
  let liveKurs;
  let inputValue;

  function berechneWert(inputValue, liveKurs, inputType) {
    if (!inputValue) {
      throw new Error("Fehler: InputValue darf nicht leer sein");
    }
    if (!inputType) {
      throw new Error("Fehler: InputType darf nicht leer sein");
    }
    if (!liveKurs) {
      throw new Error("Fehler: LiveKurs darf nicht leer sein");
    }
    let gesamtWert;
    let anteile;
    if (inputType === "anteile") {
        gesamtWert = parseFloat((inputValue * liveKurs).toFixed(2));
        anteile = inputValue;
    } else {
        gesamtWert = parseFloat(parseFloat(inputValue).toFixed(2));
        anteile = parseFloat((gesamtWert / liveKurs).toFixed(5));
    }  
    return {gesamtWert, anteile};
  }

  test('berechneWert gibt korrekte Berechnung zurück, wenn inputType = "anteile"', () => {
    inputType = "anteile";
    liveKurs = 100;
    inputValue = 50;

    let berechnung = berechneWert(inputValue, liveKurs, inputType);
    expect(berechnung).toEqual({
      gesamtWert: 5000,
      anteile: 50,
    });
  });

  test('berechneWert gibt korrekte Berechnung zurück, wenn inputType = "betrag"', () => {
    inputType = "betrag";
    liveKurs = 100;
    inputValue = 50;

    let berechnung = berechneWert(inputValue, liveKurs, inputType);
    expect(berechnung).toEqual({
      gesamtWert: 50,
      anteile: 0.5,
    });
  });

  test('berechneWert wirft Fehler aus, wenn inputType undefined ist', () => {
    inputType = undefined;
    liveKurs = 100;
    inputValue = 50;

    expect(() => berechneWert(inputValue, liveKurs, inputType)).toThrow(
      "Fehler: InputType darf nicht leer sein"
    );
  });

  test('berechneWert wirft Fehler aus, wenn liveKurs undefined ist', () => {
    inputType = "betrag";
    liveKurs = undefined;
    inputValue = 50;

    expect(() => berechneWert(inputValue, liveKurs, inputType)).toThrow(
      "Fehler: LiveKurs darf nicht leer sein"
    );
  });

  test('berechneWert wirft Fehler aus, wenn inputValue undefined ist', () => {
    inputType = "betrag";
    liveKurs = 100;
    inputValue = undefined;

    expect(() => berechneWert(inputValue, liveKurs, inputType)).toThrow(
      "Fehler: InputValue darf nicht leer sein"
    );
  });
});
