import AktieFetch from '../aktie/AktieFetch';

class PortfolioAktienDaten {
    aktieFetch = new AktieFetch();

    liveDataCache = new Map();

    async getAktienLiveKurs(aktie) {
        try {
            if (this.liveDataCache.has(aktie.id)) {
                console.log(`Cache-Hit für ${aktie.id}`);
                return this.liveDataCache.get(aktie.id);
            }

            const liveDaten = await this.aktieFetch.getLiveData(aktie.id);
            const aktuellerKurs = liveDaten.regularMarketPrice;
            console.log(`API-Aufruf für ${aktie.id}: ${aktuellerKurs}`);

            this.liveDataCache.set(aktie.id, aktuellerKurs);

            return aktuellerKurs;
        } catch (error) {
            console.error('Fehler bei getAktienLiveKurs:', error.message);
            throw new Error('Live-Daten konnten nicht abgerufen werden.');
        }
    }

    getAktienGesamtWert(aktie, aktuellerKurs) {
        if (!aktie || typeof aktie.anzahlAktienAnteile !== 'number' || typeof aktuellerKurs !== 'number') {
            return 0; 
        }

        const gesamtwert = aktie.anzahlAktienAnteile * aktuellerKurs;
        return parseFloat(gesamtwert.toFixed(2));;
    }

    getAktienPerformance(aktie, aktuellerKurs) {
        if (!aktie || typeof aktie.anzahlAktienAnteile !== 'number' || typeof aktie.buyInKurs !== 'number' || typeof aktuellerKurs !== 'number') {
            return 0; 
        }

        const gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;
        const gesamtwertNeu = aktie.anzahlAktienAnteile * aktuellerKurs;

        const performance = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;
        return performance.toFixed(2); 
    }

    getAktienRendite(aktie, aktuellerKurs) {
        if (!aktie || typeof aktie.anzahlAktienAnteile !== 'number' || typeof aktie.buyInKurs !== 'number' || typeof aktuellerKurs !== 'number') {
            return 0; 
        }
        
        const gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;
        const rendite = (aktuellerKurs * aktie.anzahlAktienAnteile) - gesamtwertAlt;
        return rendite.toFixed(2);
    }
}

export default PortfolioAktienDaten;