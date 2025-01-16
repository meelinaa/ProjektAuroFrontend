class AktieFetch {

    async getLiveData(ticker){
        if (!ticker) {
            throw new Error('Fehler: der Ticker darf nicht leer sein')
        }
        const response = await fetch(`http://localhost:8080/aktie/${ticker}/live`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Live-Daten: ${response.statusText}`);
        }
        return await response.json();
    }

    async getInfoData(ticker) {
        if (!ticker) {
            throw new Error('Fehler: der Ticker darf nicht leer sein')
        }
        const response = await fetch(`http://localhost:8080/aktie/${ticker}/infos`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Info-Daten: ${response.statusText}`);
        }
        return await response.json();
    }

    async getPosition(ticker) {
        if (!ticker) {
            throw new Error('Fehler: der Ticker darf nicht leer sein')
        }
        const response = await fetch(`http://localhost:8080/aktie/${ticker}/positionen`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Positionen: ${response.statusText}`);
        }
        return await response.json();
    }
    
}

export default AktieFetch;

