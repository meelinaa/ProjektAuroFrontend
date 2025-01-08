
class KontoFetch{

    async getGuthaben(){
        const response = await fetch(`http://localhost:8080/konto/guthaben`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen des Guthabens: ${response.statusText}`);
        }
        return await response.json();
    }

}

export default KontoFetch;

