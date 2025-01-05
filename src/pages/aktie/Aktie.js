import React, { use, useEffect, useState } from 'react';
import AktieFetch from './AktieFetch';

import Chart from '../../pictures/BspChart.png';

import Empfehlungen from '../empfehlungen/Empfehlungen';



import './Aktie.css';
import { useNavigate, useParams } from 'react-router-dom';


export default function Aktie() {
    const { ticker: urlTicker } = useParams();
    const [ticker, setTicker] = useState(urlTicker);
    const [liveDaten, setLiveDaten] = useState(null);
    const [infoDaten, setInfoDaten] = useState(null);
    const [error, setError] = useState(null);
    const [deineDaten, setDeineDaten] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const [isOrderVisible, setIsOrderVisible] = useState(true);

    const [gesamtwertPosition, setGesamtwertPosition] = useState(null);
    const [renditePosition, setRenditePosition] = useState(null);
    const [performancePosition, setPerformancePosition] = useState(null);

    const navigate = useNavigate();


    const aktieFetch = new AktieFetch();

    async function sucheAktie(ticker) {
        if (!ticker) return;
        setIsLoading(true);
        setError(null);
    
        setLiveDaten(null);
        setInfoDaten(null);
        setDeineDaten(null);
        setGesamtwertPosition(null);
        setRenditePosition(null);
        setPerformancePosition(null);
    
        try {
            const liveDaten = await aktieFetch.getLiveData(ticker);
            setLiveDaten(liveDaten);
    
            const infoDaten = await aktieFetch.getInfoData(ticker);
            setInfoDaten(infoDaten);
    
            const deineDaten = await aktieFetch.getPosition(ticker);
            setDeineDaten(deineDaten);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

        if (deineDaten) {
            positionenBerechnen(deineDaten);
        }
        
    }

    useEffect(() => {
        if (ticker) {
            setIsVisible(true);
            sucheAktie(ticker);
            setTicker(ticker);
        }
    }, [ticker]);
    
    /*
    useEffect(() => {
        const interval = setInterval(() => {
            aktieFetch
                .getLiveData(ticker)
                .then((data) => setLiveDaten(data))
                .catch((e) => setError(e.message));
        }, 10000);
        return () => clearInterval(interval);
    });
    */

    function positionenBerechnen(deineDaten) {
        let buyIn = deineDaten.buyInKurs;
        let anteile = deineDaten.anzahlAktienAnteile;
        let gesamtwertAlt = buyIn * anteile;
        let gesamtwertNeu = liveDaten.regularMarketPrice * anteile
        setGesamtwertPosition(parseFloat(gesamtwertNeu.toFixed(2)));
        setRenditePosition(parseFloat((gesamtwertNeu - gesamtwertAlt).toFixed(2)));
        setPerformancePosition(parseFloat((((gesamtwertNeu - gesamtwertAlt) / gesamtwertAlt) * 100).toFixed(2)));
    }

    function startToOrder(liveKurs, ticker){
        navigate(`/order/${liveKurs}/${ticker}`);
    }


    if (error) {
        return <div>Fehler: {error}</div>;
    }

    return (
        <div className="body-aktie">
            {/*Suche */}
            <div className="suche-aktie">
                <form onSubmit={(e) => { e.preventDefault(); sucheAktie(ticker); }}>
                    <input
                        type="text"
                        name="aktie-ticker"
                        id="aktie-ticker"
                        placeholder="Aktien Ticker"
                    />
                    <button className="suche" type="submit" onClick={() => {
                                                                        const inputValue = document.getElementById('aktie-ticker').value;
                                                                        setTicker(inputValue);
                    }}>
                        Suche
                    </button>
                </form>
            </div>

            {isVisible ? (
                <>

                

            <div className="aktien-ausgabe">
                <div className="aktien-kurse">
                    <div className="aktien-kurse-top">
                        <div className="aktien-kurse-links">
                            <div className="aktueller-kurs">
                                <h1>{infoDaten ? infoDaten.companyName : '--'}</h1>
                                <div className="kurse">
                                    <p className="market-price">{liveDaten ? liveDaten.regularMarketPrice : '--'} $</p>
                                    <p className="market-change-percent">{liveDaten ? liveDaten.regularMarketChangePercent : '--'} %</p>
                                </div>
                            </div>
                            <button className="order-btn" onClick={() => startToOrder(liveDaten.regularMarketPrice, ticker)}>Handeln</button>
                        </div>

                       
                        
                    </div>
                    
                    <div className="deine-position">
                        {deineDaten && deineDaten.buyInKurs && deineDaten.anzahlAktienAnteile ? (
                            <>
                                <h2>Deine Position</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Gesamtwert</th>
                                            <th>Performance</th>
                                            <th>Rendite</th>
                                            <th>Buy In</th>
                                            <th>Anteile</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{gesamtwertPosition ? `${gesamtwertPosition} $` : '--'}</td>
                                            <td>{performancePosition ? `${performancePosition} %` : '--'}</td>
                                            <td>{renditePosition ? `${renditePosition} $` : '--'}</td>
                                            <td>{deineDaten.buyInKurs ? `${deineDaten.buyInKurs} $` : '--'}</td>
                                            <td>{deineDaten.anzahlAktienAnteile ? deineDaten.anzahlAktienAnteile : '--'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>


            <div className="aktien-infos">
                <div className="markt-daten">
                    <h3>Marktdaten</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Tageshandelsspanne</td>
                                <td>{infoDaten ? infoDaten.regularMarketDayRange : '--'}</td>
                            </tr>
                            <tr>
                                <td>52-Wochen-Spanne</td>
                                <td>{infoDaten ? infoDaten.fiftyTwoWeekRange : '--'}</td>
                            </tr>
                            <tr>
                                <td>Handelsvolumen</td>
                                <td>{infoDaten ? infoDaten.regularMarketVolume : '--'}</td>
                            </tr>
                            <tr>
                                <td>Marktkapitalisierung</td>
                                <td>{infoDaten ? infoDaten.marketCap : '--'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="markt-daten">
                    <h3>Bewertungskennzahlen</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Kurs-Gewinn-Verhältnis (Trailing P/E)</td>
                                <td>{infoDaten ? infoDaten.trailingPE : '--'}</td>
                            </tr>
                            <tr>
                                <td>Zielpreis (Durchschnitt)</td>
                                <td>{infoDaten ? infoDaten.targetMeanPrice : '--'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="markt-daten">
                    <h3>Dividenden</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Erwartete Dividende</td>
                                <td>{liveDaten ? (liveDaten.expectedDividend || '0,00 %') : '--'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

                        <Empfehlungen/>
            
        </div>

        </>
        ) : (
            <>
                <h2>Bitte Aktien Ticker angeben.</h2>
            </>
        )}
    </div>
  );
}
