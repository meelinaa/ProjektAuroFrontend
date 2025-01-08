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
        const gesamtwert = aktie.anzahlAktienAnteile * aktuellerKurs;
        return gesamtwert;
    }

    getAktienPerformance(aktie, aktuellerKurs) {
        const gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;
        const gesamtwertNeu = aktie.anzahlAktienAnteile * aktuellerKurs;

        const performance = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;
        return performance.toFixed(2); 
    }

    getAktienRendite(aktie, aktuellerKurs) {
        const gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;
        const rendite = (aktuellerKurs * aktie.anzahlAktienAnteile) - gesamtwertAlt;
        return rendite.toFixed(2);
    }
}

export default PortfolioAktienDaten;
