import React, { useEffect, useState } from 'react';

import PortfolioFetch from './PortfolioFetch';
import PortfolioAktienDaten from './PortfolioAktienDaten';

import './Portfolio.css';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Portfolio() {
    //const [portfolioInfos, setPortfolioInfos] = useState(null);
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

                /*
                const infos = await portfolioFetch.getAllePortfolioInfos();
                setPortfolioInfos(infos);
                */
                

                // Live-Daten laden
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

    // Hilfsfunktion zum Abrufen der Live-Daten
    function getLiveKursForAktie(aktieId) {
        const liveKursObj = liveDaten?.find((data) => data.id === aktieId);
        return liveKursObj?.kurs || '-';
    }

    //Funktionen zur Berechnung der Daten
    function gesamtwertBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        const gesamtWert = aktuellerKurs !== '-' ? aktie.anzahlAktienAnteile * aktuellerKurs : '-';
        return gesamtWert;
    }

    function performanceBerechnen(aktie) {
      const aktuellerKurs = getLiveKursForAktie(aktie.id);
      if (aktuellerKurs === '-') return '-';
  
      const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
      const gesamtwertNeu = aktuellerKurs * aktie.anzahlAktienAnteile;
  
      const performanceProzent = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;
  
      return `${performanceProzent > 0 ? '+' : ''}${performanceProzent.toFixed(2)}%`;
  }
  

    function renditeBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === '-') return '-';
        const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
        return (aktuellerKurs * aktie.anzahlAktienAnteile - gesamtwertAlt).toFixed(2);
    }

    function navigateToAktie(ticker){
      navigate(`/aktie/${ticker}`);
    }

    // Ausgabe
    return (
        <div className="bodyPortfolio">
            <h1>Willkommen</h1>

            <div className="aktienUebersicht">
                <h2>Portfolio</h2>
                <table>
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
                        {Array.isArray(portfolioAktien) &&
                            portfolioAktien.map((aktie) => (
                                <tr key={aktie.id} onClick={() => navigateToAktie(aktie.id)}>
                                    <td>{aktie.id}</td>
                                    <td>{getLiveKursForAktie(aktie.id)}</td>
                                    <td>{gesamtwertBerechnen(aktie)}</td>
                                    <td>{performanceBerechnen(aktie)}</td>
                                    <td>{renditeBerechnen(aktie)}</td>
                                    <td>{aktie.buyInKurs}</td>
                                    <td>{aktie.anzahlAktienAnteile}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
