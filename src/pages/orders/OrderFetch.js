
class OrderFetch{

    async setTransaktion(ticker, orderType, liveKurs, anteile, companyName) {
        try {
            const response = await fetch(`http://localhost:8080/order/transaktion`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ticker: ticker,
                    orderType: orderType,
                    liveKurs: liveKurs,
                    anteile: anteile,
                    companyName: companyName,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Fehler beim Speichern der Transaktion: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Transaktion erfolgreich gespeichert:", data);
            return data;
        } catch (error) {
            console.error("Fehler bei der Transaktion:", error);
            throw error; 
        }
    }
    
}

export default OrderFetch;
