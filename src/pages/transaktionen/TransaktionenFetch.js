class TransaktionenFetch {

    async getAlleTransaktionen(){
        const response = await fetch(`http://localhost:8080/order/all`);
        if (!response.ok) {
            throw new Error(`Fehler beim Fetch aller Transaktionen: ${response.statusText}`);
        }
        return await response.json();
    }
    
}

export default TransaktionenFetch