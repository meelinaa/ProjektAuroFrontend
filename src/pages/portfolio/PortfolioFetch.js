class PortfolioFetch {

    async getAllePortfolioInfos(){
        const response = await fetch(`http://localhost:8080/portfolio/1`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Portfolio Infos: ${response.statusText}`);
        }
        return await response.json();
    }

    async getAlleAktien(){
        const response = await fetch(`http://localhost:8080/portfolio/aktien/get/1`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Aktien: ${response.statusText}`);
        }
        return await response.json();
    }

    async getAlleOrder(){
        const response = await fetch(`http://localhost:8080/portfolio/order/get/1`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Transaktionen: ${response.statusText}`);
        }
        return await response.json();
    }
}

export default PortfolioFetch;