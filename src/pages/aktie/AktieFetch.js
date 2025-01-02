
class AktieFetch {

    async getLiveData(ticker){
        const response = await fetch(`http://localhost:8080/aktie/${ticker}/live`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Live-Daten: ${response.statusText}`);
        }
        return await response.json();
    }

    async getInfoData(ticker) {
        const response = await fetch(`http://localhost:8080/aktie/${ticker}/infos`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Info-Daten: ${response.statusText}`);
        }
        return await response.json();
    }

    async getPosition(ticker) {
        const response = await fetch(`http://localhost:8080/aktie/${ticker}/positionen`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Positionen: ${response.statusText}`);
        }
        return await response.json();
    }
}

export default AktieFetch;

