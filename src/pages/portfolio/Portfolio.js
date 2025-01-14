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

    function getLiveKursForAktie(aktieId) {
        if (!liveDaten || liveDaten.length === 0) {
            return "-";
        }
    
        for (let i = 0; i < liveDaten.length; i++) {
            const aktuelleAktie = liveDaten[i]; 
            if (aktuelleAktie.id === aktieId) {
                return aktuelleAktie.kurs;
            }
        }
    
        return "-";
    }

    function gesamtwertBerechnen(aktie) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === "-") {
            return "-";
        }
    
        const gesamtWert = aktie.anzahlAktienAnteile * aktuellerKurs;
        return parseFloat(gesamtWert.toFixed(2));
    }    
    
    function berechneWert(aktie, type) {
        const aktuellerKurs = getLiveKursForAktie(aktie.id);
        if (aktuellerKurs === "-") return { valueOf: "-", className: "" };
    
        const gesamtwertAlt = aktie.buyInKurs * aktie.anzahlAktienAnteile;
        const gesamtwertNeu = aktuellerKurs * aktie.anzahlAktienAnteile;
    
        let wert, className;
        if (type === "rendite") {
            wert = gesamtwertNeu - gesamtwertAlt;
            className = getCssClass(wert);
        } else if (type === "performance") {
            wert = ((gesamtwertNeu / gesamtwertAlt) - 1) * 100;
            className = getCssClass(wert);
        }
    
        return { valueOf: wert.toFixed(2), className };
    }
    
    function navigateToAktie(ticker){
        if (!ticker) {
            throw new Error("Fehler: Der Ticker darf nicht leer sein!");
        }
      navigate(`/aktie/${ticker}`);
    }

    function berechneGesamtwertPortfolio() {
        if (!portfolioAktien || !liveDaten) {
            return 0;
        }
    
        let gesamtwert = 0;
    
        for (let i = 0; i < portfolioAktien.length; i++) {
            const aktie = portfolioAktien[i];
            const liveKurs = getLiveKursForAktie(aktie.id);
    
            if (liveKurs === "-") {
                continue;
            }
    
            gesamtwert += aktie.anzahlAktienAnteile * liveKurs;
        }
    
        return gesamtwert;
    }    

    function getCssClass(value) {
        return value > 0 ? "positive-change" : value < 0 ? "negative-change" : "";
    }

    if (error) {
        return <div>Fehler: {error}</div>;
    }
    
    return (
        <div className="body-content">
            <h1 id="h-titel">Willkommen</h1>

            <div className="portfolioGesamtwert">
                <h2 id="h-titel" >Gesamtwert</h2>
                <h1 id="gesamtwertAusgabe"
                    className={getCssClass(berechneGesamtwertPortfolio())}>
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
                                <td className={berechneWert(aktie, "performance").className}>
                                    {berechneWert(aktie, "performance").valueOf} %
                                </td>                                    
                                <td className={berechneWert(aktie, "rendite").className}>
                                    {berechneWert(aktie, "rendite").valueOf} $
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
