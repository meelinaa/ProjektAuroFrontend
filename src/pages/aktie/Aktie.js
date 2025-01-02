import React, { useEffect, useState } from 'react';
import AktieFetch from './AktieFetch';
import Chart from '../../pictures/BspChart.png';


import './Aktie.css';
import Order from '../orders/Order';


export default function Aktie() {
  const [ticker, setTicker] = useState('TSLA');
  const [liveDaten, setLiveDaten] = useState(null);
  const [infoDaten, setInfoDaten] = useState(null);
  const [error, setError] = useState(null);
  const [deineDaten, setDeineDaten] = useState(null);

  const [isOrderVisible, setIsOrderVisible] = useState(true);

  const aktieFetch = new AktieFetch();

  function sucheAktie(ticker) {
    aktieFetch
      .getLiveData(ticker)
      .then((data) => setLiveDaten(data))
      .catch((e) => setError(e.message));

    aktieFetch
      .getInfoData(ticker)
      .then((data) => setInfoDaten(data))
      .catch((e) => setError(e.message));

    aktieFetch
        .getPosition(ticker)
        .then((data) => setInfoDaten(data))
        .catch((e) => setError(e.message));
  }

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

  if (error) {
    return <div>Fehler: {error}</div>;
  }

  const togglleOrderOverlay = () => {
    setIsOrderVisible(!isOrderVisible);
  }

  return (
    <div className="body-aktie">
        <div className="suche-aktie">
            <form onSubmit={(e) => { e.preventDefault(); sucheAktie(ticker); }}>
                <input
                    type="text"
                    name="aktie-ticker"
                    id="aktie-ticker"
                    placeholder="TSLA"
                    onChange={(e) => setTicker(e.target.value)}
                />
                <button className="suche" type="submit">
                    Suche
                </button>
            </form>
        </div>

        <div className="aktien-ausgabe">
            <div className="aktien-kurse">
                <div className="aktien-kurse-links">
                    <div className="aktueller-kurs">
                        <h1>{infoDaten ? infoDaten.companyName : 'Tesla, Inc. (TSLA)'}</h1>
                        <div className="kurse">
                            <p className="market-price">{liveDaten ? liveDaten.regularMarketPrice : '450,95 $'} $</p>
                            <p className="market-change-percent">{liveDaten ? liveDaten.regularMarketChangePercent : '2,56 %'} %</p>
                        </div>
                    </div>

            
                    <button className="order-btn" onClick={togglleOrderOverlay}>Handeln</button>
                    
                    {/* {isOrderVisible && <Order/>} */}
                    
                    

                    <div className="deine-position">
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
                                    <td>{deineDaten ? deineDaten.gesamtwert : '2510,66 $'}</td>
                                    <td>{deineDaten ? deineDaten.performance : '+ 11,75 %'}</td>
                                    <td>{deineDaten ? deineDaten.rendite : '313,65 $'}</td>
                                    <td>{deineDaten ? deineDaten.buyIn : '406,76 $'}</td>
                                    <td>{deineDaten ? deineDaten.anteile : '90,6845468'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="aktien-kurse-rechts">
                    <img src={Chart} alt="Chart" />
                </div>
            </div>


        <div className="aktien-infos">
            <div className="markt-daten">
                <h3>Marktdaten</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Tageshandelsspanne</td>
                            <td>{infoDaten ? infoDaten.regularMarketDayRange : '427,02 - 488,54'}</td>
                        </tr>
                        <tr>
                            <td>52-Wochen-Spanne</td>
                            <td>{infoDaten ? infoDaten.fiftyTwoWeekRange : '138,80 - 488,54'}</td>
                        </tr>
                        <tr>
                            <td>Handelsvolumen</td>
                            <td>{infoDaten ? infoDaten.regularMarketVolume : '144.545.960'}</td>
                        </tr>
                        <tr>
                            <td>Marktkapitalisierung</td>
                            <td>{infoDaten ? infoDaten.marketCap : '1,413Bill.'}</td>
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
                            <td>{infoDaten ? infoDaten.trailingPE : '120,58'}</td>
                        </tr>
                        <tr>
                            <td>Zielpreis (Durchschnitt)</td>
                            <td>{infoDaten ? infoDaten.targetMeanPrice : '282,95'}</td>
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
                            <td>{liveDaten ? (liveDaten.expectedDividend || '0,00 %') : '0,03 %'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}
