import React, { use, useEffect, useState } from 'react';

import './Order.css';
import '../style/Style.css';

import {  useNavigate, useParams } from 'react-router-dom';
import OrderFetch from './OrderFetch';
import KontoFetch from '../konto/KontoFetch';

export default function Order() {
  const {liveKurs: urlLiveKurs} = useParams();
  const {ticker: urlTicker} = useParams();
  const {orderType: urlOrderType} = useParams();
  const {companyName: urlCompanyName} = useParams();

  const liveKurs = urlLiveKurs;
  const ticker = urlTicker;
  const orderType = urlOrderType;
  const companyName = urlCompanyName;

  const [guthaben, setGuthaben] = useState(null);
  const [input, setInput] = useState("");
  const [gesamtWert, setGesamtWert] = useState(null);
  
  const [inputType, setInputType] = useState("anteile");
  const [inputIstGroeserAlsGuthaben, setInputIstGroeserAlsGuthaben] = useState(false);

  const [aufWeiterGeklickt, setAufWeiterGeklickt] = useState(false);
  const [aufBestaetigenGeklickt, setAugBestaetigenGeklickt] = useState();

  const [isTransaktionFehlgeschlagen, setIsTransaktionFehlgeschlagen] = useState(false);

  const orderFetch = new OrderFetch();
  const kontoFetch = new KontoFetch();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(orderType);
    try {
      const guthaben = kontoFetch.getGuthaben();
      setGuthaben(guthaben);
    } catch (error) {
      setGuthaben(0);
    }
  },[])
 
  const handleInput = (e) => {
    const value = e.target.value;

    if (isNaN(value) || value === "") {
      setInput(0);
      setGesamtWert(0);
      setInputIstGroeserAlsGuthaben(false);
      return;
    }

    const inputValue = parseFloat(value);
    setInput(inputValue);

    const gesamtWert = (inputValue * liveKurs).toFixed(2);
    setGesamtWert(gesamtWert);

    if (gesamtWert > guthaben) {
      setInputIstGroeserAlsGuthaben(true);
    }
    else{
      setInputIstGroeserAlsGuthaben(false);
    }
  };

  const handleInputTypes = (e) => {
    setInputType(e.target.value);
  }

  const openUebersicht = () => {
    setAufWeiterGeklickt((prevState) => !prevState);
  }

  const openBestaetigung = () => {
    setAugBestaetigenGeklickt((prevState) => !prevState);
  }

  const openPortfolio = () => {
    navigate("/portfolio");
  }

  const openAktie = (ticker) => {
    navigate(`/aktie/${ticker}`);
  }

  function transaktionStarten(){
    setIsTransaktionFehlgeschlagen(false);
    try {
      orderFetch.setTransaktion(ticker, orderType, liveKurs, input, companyName);
    } catch (error) {
      setIsTransaktionFehlgeschlagen(true);
    }
    openBestaetigung();
  }

  return (
    <div className="body-content">

      {!aufWeiterGeklickt ? (
        <div className="card" >
          <div className="card-top">
              <div className="card-top-infos">
                <h1>{orderType === "buy" ? "Kaufen" : "Verkaufen"}</h1>
              </div>
              <p id="gray-text">{guthaben} $ verfügbar</p>
          </div>
          <div className="card-middle">
            <input type="text" name="anteileInput" id="anteileInput" placeholder="Anteile" onInput={handleInput}/>
            <p id="gray-text">Gesamt: {gesamtWert} $</p>
            {/* Fehlermeldung Hinzufügen, dass wenn der gewünschte Betrag größer als das Guthaben ist */}
            <p id="gray-text">{inputIstGroeserAlsGuthaben ? "Nicht genug Guthaben!": "ew"}</p>
          </div>
          <div className="card-bottom">
            <select name="inputType" className="btn" onChange={handleInputTypes}>
              <option value="anteile">Anteile</option>
              <option value="geldWert">Geld</option>
            </select>
            <button className={`${input === "" ? "btn-disabled" : "btn"} ${inputIstGroeserAlsGuthaben ? "btn-disabled" : "btn"}`} onClick={openUebersicht}>Weiter ❯</button>
          </div>
        </div>

      ) : (

        <>
        {!aufBestaetigenGeklickt ? (
          <div className="card">
            <div className="card-top">
              <div className="order-top-infos">
                <h1>{orderType === "buy" ? "Kaufen" : "Verkaufen"}</h1>
              </div>
            </div>

            <div className="card-middle">
              <table className="basic-tabelle">
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{companyName}</td>
                  </tr>
                  <tr>
                    <td>Ticker:</td>
                    <td>{ticker}</td>
                  </tr>
                  <tr>
                    <td>Anteile:</td>
                    <td>{input}</td>
                  </tr>
                  <tr>
                    <td>Aktueller Kurs:</td>
                    <td>{liveKurs} $</td>
                  </tr>
                  <tr>
                    <td>Order Typ:</td>
                    <td>{orderType === "buy" ? "Kaufen" : "Verkaufen"}</td>
                  </tr>
                </tbody>
              </table>

              <h3>Gesamtbetrag: {gesamtWert} $</h3>

            </div>
            <div className="card-bottom">
              <button className="btn" onClick={openUebersicht}>❮ Zurück</button>
              <button className="btn" onClick={() => transaktionStarten()}>Bestätigen</button>
            </div>
          </div>

        ) : (

          <div className="card">
            <div className="card-top">
              <div className="order-top-infos">
                <h1>Bestätigung</h1>
              </div>
            </div>

            {isTransaktionFehlgeschlagen ? (
              <>
                <div className="card-middle">
                  <p>Die Transaktion ist fehlgeschlagen. Versuche es bitte erneut.</p>
                </div>
                <div className="card-bottom">
                  <button className="btn" onClick={() => openAktie(ticker)}>Fertig</button>
                </div>
              </>

            ) : (

              <>
                <div className="card-middle">
                  <p>Du hast {input} Aktie(n) für {gesamtWert} $ {orderType === "buy" ? "gekauft" : "verkauft"} ! </p>
                </div>
                <div className="card-bottom">
                  <button className="btn" onClick={openPortfolio}>Fertig</button>
                </div>
              </>
            )}
          </div>
        )}
        </>
      )}
    </div>
  )
}
