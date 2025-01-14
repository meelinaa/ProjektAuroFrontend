// NOTE: Funktion hier definiert, da Tests für die Hauptdatei derzeit nicht funktionieren.

describe('getAktienGesamtWert', () => {
    let aktie;
    let aktuellerKurs;

    function getAktienGesamtWert(aktie, aktuellerKurs) {
        if (!aktie || typeof aktie.anzahlAktienAnteile !== 'number' || typeof aktuellerKurs !== 'number') {
            return 0; 
        }

        const gesamtwert = aktie.anzahlAktienAnteile * aktuellerKurs;
        return parseFloat(gesamtwert.toFixed(2));;
    }

    test('getAktienGesamtWert berechnet korrekten Gesamtwert', () => {
      aktie = {anzahlAktienAnteile: 10};
      aktuellerKurs = 100;

      const gesamtwert = getAktienGesamtWert(aktie, aktuellerKurs);
      expect(gesamtwert).toBeCloseTo(1000);
    })

    test('getAktienGesamtWert gibt 0 aus bei undefined anzahlAktienAnteile', () => {
      aktie = {anzahlAktienAnteile: undefined};
      aktuellerKurs = 100;

      const gesamtwert = getAktienGesamtWert(aktie, aktuellerKurs);
      expect(gesamtwert).toEqual(0);
    })

    test('getAktienGesamtWert gibt 0 aus bei undefined aktuellerKurs', () => {
        aktie = {anzahlAktienAnteile: 100};
        aktuellerKurs = undefined;
  
        const gesamtwert = getAktienGesamtWert(aktie, aktuellerKurs);
        expect(gesamtwert).toEqual(0);
    })

    test('getAktienGesamtWert gibt 0 aus, wenn anzahlAktienAnteile ein keine Zahl ist', () => {
        aktie = {anzahlAktienAnteile: "String"};
        aktuellerKurs = 100;
  
        const gesamtwert = getAktienGesamtWert(aktie, aktuellerKurs);
        expect(gesamtwert).toEqual(0);
    })

    test('getAktienGesamtWert gibt 0 aus, wenn aktuellerKurs ein keine Zahl ist', () => {
        aktie = {anzahlAktienAnteile: 100};
        aktuellerKurs = "String";
  
        const gesamtwert = getAktienGesamtWert(aktie, aktuellerKurs);
        expect(gesamtwert).toEqual(0);
    })
    
})

describe('getAktienPerformance', () => {
    let aktie;
    let aktuellerKurs;
  
    function getAktienPerformance(aktie, aktuellerKurs) {
        if (!aktie || typeof aktie.anzahlAktienAnteile !== 'number' || typeof aktie.buyInKurs !== 'number' || typeof aktuellerKurs !== 'number') {
            return 0; 
        }

        const gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;
        const gesamtwertNeu = aktie.anzahlAktienAnteile * aktuellerKurs;

        const performance = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;
        return performance.toFixed(2); 
    }

    test('getAktienPerformance berechnet korrekte Performance', () => {
      aktie = {anzahlAktienAnteile: 10, buyInKurs: 100};
      aktuellerKurs = 120;

      const performance = getAktienPerformance(aktie, aktuellerKurs);
      expect(performance).toEqual("20.00");
    })

    test('getAktienPerformance berechnet korrekte Performance mit anderen Werten', () => {
        aktie = {anzahlAktienAnteile: 5.576, buyInKurs: 134};
        aktuellerKurs = 140;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual("4.48");
    })

    test('getAktienPerformance gibt 0 aus bei undefined anzahlAktienAnteile', () => {
        aktie = {anzahlAktienAnteile: undefined, buyInKurs: 134};
        aktuellerKurs = 140;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus, wenn anzahlAktienAnteile keine Zahl ist', () => {
        aktie = {anzahlAktienAnteile: "string", buyInKurs: 134};
        aktuellerKurs = 140;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus bei undefined buyInKurs', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: undefined};
        aktuellerKurs = 140;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus, wenn buyInKurs das keine Zahl ist', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: "String"};
        aktuellerKurs = 140;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus bei undefined aktuellerKurs', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: 100};
        aktuellerKurs = undefined;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus, wenn aktuellerKurs keine Zahl ist', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: 100};
        aktuellerKurs = "String";
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus wenn alles undefined', () => {
        aktie = {anzahlAktienAnteile: undefined, buyInKurs: undefined};
        aktuellerKurs = undefined;
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })

    test('getAktienPerformance gibt 0 aus wenn alles keine Zahlen sind', () => {
        aktie = {anzahlAktienAnteile: "String", buyInKurs: "String"};
        aktuellerKurs = "String";
  
        const performance = getAktienPerformance(aktie, aktuellerKurs);
        expect(performance).toEqual(0);
    })
    
})

describe('getAktienRendite', () => {

    let aktie;
    let aktuellerKurs;

    function getAktienRendite(aktie, aktuellerKurs) {
        if (!aktie || typeof aktie.anzahlAktienAnteile !== 'number' || typeof aktie.buyInKurs !== 'number' || typeof aktuellerKurs !== 'number') {
            return 0; 
        }
        
        const gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;
        const rendite = (aktuellerKurs * aktie.anzahlAktienAnteile) - gesamtwertAlt;
        return rendite.toFixed(2);
    }

    test('getAktienRendite berechnet den richtigen Wert', () => {
      aktie = {anzahlAktienAnteile: 10, buyInKurs: 100};
      aktuellerKurs = 120;

      const rendite = getAktienRendite(aktie, aktuellerKurs);
      expect(rendite).toEqual("200.00");
    })

    test('getAktienRendite berechnet den richtigen Wert mit anderen Inputs', () => {
        aktie = {anzahlAktienAnteile: 46.5667, buyInKurs: 134};
        aktuellerKurs = 146;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual("558.80");
    })

    test('getAktienRendite gibt 0 zurück für undefined anzahlAktienAnteile', () => {
        aktie = {anzahlAktienAnteile: undefined, buyInKurs: 134};
        aktuellerKurs = 146;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })

    test('getAktienRendite gibt 0 zurück für null anzahlAktienAnteile', () => {
        aktie = {anzahlAktienAnteile: null, buyInKurs: 134};
        aktuellerKurs = 146;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })

    test('getAktienRendite gibt 0 zurück für undefined buyInKurs', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: undefined};
        aktuellerKurs = 146;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })

    test('getAktienRendite gibt 0 zurück für null buyInKurs', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: null};
        aktuellerKurs = 146;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })

    test('getAktienRendite gibt 0 zurück für undefined aktuellerKurs', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: 100};
        aktuellerKurs = undefined;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })

    test('getAktienRendite gibt 0 zurück für null aktuellerKurs', () => {
        aktie = {anzahlAktienAnteile: 10, buyInKurs: 100};
        aktuellerKurs = null;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })

    test('getAktienRendite gibt 0 zurück wenn alles undefined ist', () => {
        aktie = {anzahlAktienAnteile: undefined, buyInKurs: undefined};
        aktuellerKurs = undefined;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })
    
    test('getAktienRendite gibt 0 zurück wenn alles null ist', () => {
        aktie = {anzahlAktienAnteile: null, buyInKurs: null};
        aktuellerKurs = undefined;
  
        const rendite = getAktienRendite(aktie, aktuellerKurs);
        expect(rendite).toEqual(0);
    })
    
    
  
})
