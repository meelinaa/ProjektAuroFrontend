import React, { useEffect, useState } from 'react';

import PortfolioFetch from './PortfolioFetch';
import PortfolioAktienDaten from './PortfolioAktienDaten';

import Empfehlungen from '../empfehlungen/Empfehlungen';


import './Portfolio.css';
import { useNavigate } from 'react-router-dom';
import Transaktionen from '../transaktionen/Transaktionen';



export default function Portfolio() {
    const [portfolioAktien, setPortfolioAktien] = useState(null);
    const [liveDaten, setLiveDaten] = useState(null);
    const [error, setError] = useState(null);

    const portfolioFetch = new PortfolioFetch();
    const portfolioAktienDaten = new PortfolioAktienDaten();

    const navigate = useNavigate();

    // Portfolio Übersicht
    useEffect(() => {
        async function fetchAktien() {
            try {
                const aktien = await portfolioFetch.getAlleAktien();
                setPortfolioAktien(aktien);

                const liveDataArray = await Promise.all(
                    aktien.map(async (aktie) => {
                        const kurs = await portfolioAktienDaten.getAktienLiveKurs(aktie);
                        return { id: aktie.id, kurs };
                    })
                );

                setLiveDaten(liveDataArray);
            } catch (error) {
                console.error('Fehler beim Abrufen der Aktien:', error.message);
                setError(error.message);
            }
        }
        fetchAktien();
    }, []);

    if (error) {
        return <div>Fehler: {error}</div>;
    }

    function getLiveKursForAktie(aktieId) {
        const liveKursObj = liveDaten?.find((data) => data.id === aktieId);
        return liveKursObj?.kurs || '-';
    }

    function gesamtwertBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === '-') return '-';
        const gesamtWert = aktie.anzahlAktienAnteile * aktuellerKurs;
        return gesamtWert.toFixed(2); 
    }
    
    function performanceBerechnen(aktie) {
      const aktuellerKurs = getLiveKursForAktie(aktie.id);
      if (aktuellerKurs === '-') return '-';
  
      const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
      const gesamtwertNeu = aktuellerKurs * aktie.anzahlAktienAnteile;
  
      const performanceProzent = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;

      const className = performanceProzent > 0 ? 'positive-performance' : 'negative-performance';

      return {
          valueOf: `${performanceProzent > 0 ? '+' : ' '}${performanceProzent.toFixed(2)}%`,
          className: className,
      };
    }

    function renditeBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === '-') return '-';
        const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
        const rendite = (aktuellerKurs * aktie.anzahlAktienAnteile - gesamtwertAlt).toFixed(2);
        const className = rendite > 0 ? 'positive-performance' : 'negative-performance';
        return {
            valueOf: rendite,
            className: className,
        };
    }

    function navigateToAktie(ticker){
      navigate(`/aktie/${ticker}`);
    }

    function berechneGesamtwertPortfolio() {
        if (!portfolioAktien || !liveDaten) return 0;
        return portfolioAktien.reduce((gesamtwert, aktie) => {
            const liveKurs = getLiveKursForAktie(aktie.id);
            if (liveKurs === '-') return gesamtwert; 
            return gesamtwert + aktie.anzahlAktienAnteile * liveKurs;
        }, 0);
    }
    

    // Ausgabe
    return (
        <div className="bodyPortfolio">
            <h1>Willkommen</h1>

            <div className="portfolioGesamtwert">
                <h2>Gesamtwert</h2>
                <h1 id="gesamtwertAusgabe">{berechneGesamtwertPortfolio().toFixed(2)} $</h1>
            </div>


            <div className="aktienUebersicht">
                <h2>Dein Portfolio</h2>
                <table className='portfolio-aktien-tabelle'>
                    <thead>
                        <tr>
                            <th>Aktie</th>
                            <th>Kurs</th>
                            <th>Gesamtwert</th>
                            <th>Performance</th>
                            <th>Rendite</th>
                            <th>Buy In</th>
                            <th>Anteile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolioAktien ? ( Array.isArray(portfolioAktien) &&
                            portfolioAktien.map((aktie) => (
                                <tr key={aktie.id} onClick={() => navigateToAktie(aktie.id)}>
                                    <td>{aktie.id}</td>
                                    <td>{getLiveKursForAktie(aktie.id)} $</td>
                                    <td>{gesamtwertBerechnen(aktie)} $</td>
                                    <td className={performanceBerechnen(aktie).className}>
                                        {performanceBerechnen(aktie).valueOf}
                                    </td>                                    
                                    <td className={performanceBerechnen(aktie).className}>
                                        {renditeBerechnen(aktie).valueOf} $
                                    </td>
                                    <td>{aktie.buyInKurs} $</td>
                                    <td>{aktie.anzahlAktienAnteile}</td>
                                </tr>
                            ))) : (
                                <tr>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>

            <Empfehlungen/>
        </div>
    );
}
