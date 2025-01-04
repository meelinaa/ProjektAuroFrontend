import AktieFetch from '../aktie/AktieFetch';

class PortfolioAktienDaten {

    aktuellerKurs = 0;
    gesamtwert = 0;
    gesamtwertAlt = 0;
    performance = 0;
    rendite = 0;

    constructor() {
        this.aktieFetch = new AktieFetch();
    }

    async getAktienLiveKurs(aktie) {
        try {
            const liveDaten = await this.aktieFetch.getLiveData(aktie.id);
            this.aktuellerKurs = liveDaten.regularMarketPrice;
            console.log(this.aktuellerKurs);
            return this.aktuellerKurs ; 

        } catch (error) {
            console.error('Fehler bei getAktienLiveKurs:', error.message);
            throw new Error('Live-Daten konnten nicht abgerufen werden.');
        }
    }

    getAktienGesamtWert(aktie){
        this.gesamtwert = aktie.anzahlAktienAnteile * this.aktuellerKurs;

        return this.gesamtwert;
    }

    getAktienPerformance(aktie){
        this.gesamtwertAlt = aktie.anzahlAktienAnteile * aktie.buyInKurs;

        this.performance = (1 * this.gesamtwert) / this.gesamtwertAlt;

        return this.performance;
    }

    getAktienRendite(aktie){
        this.rendite = this.gesamtwert - this.gesamtwertAlt;

        return this.rendite;
    }

}

export default PortfolioAktienDaten;
