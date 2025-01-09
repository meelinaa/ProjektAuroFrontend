import React, { useEffect, useState } from 'react';

import PortfolioFetch from './PortfolioFetch';
import PortfolioAktienDaten from './PortfolioAktienDaten';

import Empfehlungen from '../empfehlungen/Empfehlungen';

import './Portfolio.css';
import '../style/Style.css';

import { useNavigate } from 'react-router-dom';

export default function Portfolio() {
    const [portfolioAktien, setPortfolioAktien] = useState(null);
    const [liveDaten, setLiveDaten] = useState(null);
    const [error, setError] = useState(null);

    const portfolioFetch = new PortfolioFetch();
    const portfolioAktienDaten = new PortfolioAktienDaten();

    const navigate = useNavigate();

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
                console.error("Fehler beim Abrufen der Aktien: ", error.message);
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
        return liveKursObj?.kurs || "-";
    }

    function gesamtwertBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === "-") return "-";
        const gesamtWert = aktie.anzahlAktienAnteile * aktuellerKurs;
        return gesamtWert.toFixed(2); 
    }
    
    function performanceBerechnen(aktie) {
      const aktuellerKurs = getLiveKursForAktie(aktie.id);
      if (aktuellerKurs === "-") return "-";
  
      const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
      const gesamtwertNeu = aktuellerKurs * aktie.anzahlAktienAnteile;
  
      const performanceProzent = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;

      const className = performanceProzent > 0 ? "positive-change" : "negative-change";

      return {
          valueOf: `${performanceProzent > 0 ? '+' : ' '}${performanceProzent.toFixed(2)}%`,
          className: className,
      };
    }

    function renditeBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === "-") return "-";
        const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
        const rendite = (aktuellerKurs * aktie.anzahlAktienAnteile - gesamtwertAlt).toFixed(2);
        const className = rendite > 0 ? "positive-change" : "negative-change";
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
            if (liveKurs === "-") return gesamtwert; 
            return gesamtwert + aktie.anzahlAktienAnteile * liveKurs;
        }, 0);
    }
    
    return (
        <div className="body-content">
            <h1 id="h-titel">Willkommen</h1>

            <div className="portfolioGesamtwert">
                <h2 id="h-titel" >Gesamtwert</h2>
                <h1 id="gesamtwertAusgabe"
                    className={berechneGesamtwertPortfolio() > 0 ? "positive-change": berechneGesamtwertPortfolio() < 0 ? "negative-change": ""}>
                  {berechneGesamtwertPortfolio().toFixed(2)} $
                </h1>            
            </div>

            <h2 id="h-titel">Dein Portfolio</h2>

            <table className="tabelle">
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
                                <td>{(aktie.buyInKurs).toFixed(2)} $</td>
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
            
            <Empfehlungen/>
        </div>
    );
}
