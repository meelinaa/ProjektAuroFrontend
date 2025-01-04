
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
        try {
            const response = await fetch(`http://localhost:8080/aktie/${ticker}/positionen`);
            if (!response.ok) {
                throw new Error(`Fehler beim Abrufen der Positionen: ${response.status} ${response.statusText}`);
            }
            return await response.json(); 
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
    
}

export default AktieFetch;

