import React, { use, useEffect, useState } from 'react';

import './Order.css';
import '../style/Style.css';

import {  useNavigate, useParams } from 'react-router-dom';
import OrderFetch from './OrderFetch';
import KontoFetch from '../konto/KontoFetch';
import AktieFetch from '../aktie/AktieFetch';

export default function Order() {
  const {liveKurs: urlLiveKurs} = useParams();
  const {ticker: urlTicker} = useParams();
  const {orderType: urlOrderType} = useParams();
  const {companyName: urlCompanyName} = useParams();

  const [error, setError] = useState(null);

  const liveKurs = urlLiveKurs;
  const ticker = urlTicker;
  const orderType = urlOrderType;
  const companyName = urlCompanyName;

  const [guthaben, setGuthaben] = useState(0);
  const [input, setInput] = useState("");
  const [gesamtWert, setGesamtWert] = useState(0);
  const [anteile, setAnteile] = useState(null);

  const [deineDaten, setDeineDaten] = useState(null);
  const [anteileImBesitz, setAnteileImBesitz] = useState(0);
  const [gesamtWertImBesitz, setGesamtWertImBesitz] = useState(0);
  
  const [inputType, setInputType] = useState("anteile");
  const [inputIstGroeserAlsGuthaben, setInputIstGroeserAlsGuthaben] = useState(false);
  const [inputIstGroeserAlsAnteileImBesitz, setInputIstGroeserAlsAnteileImBesitz] = useState(false);


  const [aufWeiterGeklickt, setAufWeiterGeklickt] = useState(false);
  const [aufBestaetigenGeklickt, setAugBestaetigenGeklickt] = useState();

  const [isTransaktionFehlgeschlagen, setIsTransaktionFehlgeschlagen] = useState(false);

  const orderFetch = new OrderFetch();
  const kontoFetch = new KontoFetch();
  const aktieFetch = new AktieFetch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuthaben = async () => {
      try {
        const guthaben = await kontoFetch.getGuthaben();
        setGuthaben(guthaben);
      } catch (error) {
        console.error("Fehler beim Abrufen des Guthabens:", error);
        setError(error.message);
      }
    };

    const fetchAktienDaten = async () => {
      if (!ticker) return;
      setAnteileImBesitz(null);
  
      try {
          const deineDaten = await aktieFetch.getPosition(ticker);
          setDeineDaten(deineDaten);
      } catch (error) {
          setError(error.message);
      } 
    }
  
    fetchGuthaben();

    if (orderType === "sell") {
      fetchAktienDaten();
    }

  }, []);

  useEffect(() => {
    setInputIstGroeserAlsGuthaben(gesamtWert > guthaben);
    setInputIstGroeserAlsAnteileImBesitz(gesamtWert > deineDaten?.anzahlAktienAnteile * liveKurs)
  }, [gesamtWert, guthaben]);
 
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

    berechneWert(inputValue);
  };

  function berechneWert(inputValue) {
    if (!inputValue) {
      throw new Error("Fehler: InputValue darf nicht leer sein");
    }
    if (!inputType) {
      throw new Error("Fehler: InputType darf nicht leer sein");
    }
    if (!liveKurs) {
      throw new Error("Fehler: LiveKurs darf nicht leer sein");
    }
    if (inputType === "anteile") {
      setGesamtWert(parseFloat((inputValue * liveKurs).toFixed(2)));
      setAnteile(inputValue);
    } else {
      setGesamtWert(parseFloat(inputValue).toFixed(2));
      setAnteile(parseFloat(gesamtWert / liveKurs).toFixed(5));
    }
  }

  const handleInputTypes = (event) => {
    const selectedValue = event.target.value;
    console.log("Ausgewählter Wert:", selectedValue);
    setInputType(selectedValue); 
  };
  
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

  function navBack(ticker) {
    navigate(`/aktie/${ticker}`);
  }

  return (
    <div className="body-content">

      {/* Order Input */}
      {!aufWeiterGeklickt ? (
        <div className="card" >
          <div className="card-top-order">
              <div className="card-top-infos">
                <h1>{orderType === "buy" ? "Kaufen" : "Verkaufen"}</h1>
                <button className="btn" onClick={() => navBack(ticker)}>X</button>
              </div>
              <p id="gray-text">{guthaben} $ verfügbar</p>  
              {orderType === "sell" ? (
                <div className="order-verkaufen-infos">
                  <p id="gray-text">Anteile im Besitz: {deineDaten?.anzahlAktienAnteile} </p>
                  <p id="gray-text">Gesamtwert: {deineDaten?.anzahlAktienAnteile * liveKurs} $</p>
                </div>
              ) : (
                <></>
              )}
          </div>

          <div className="card-middle">
            <input 
              type="text" 
              name="anteileInput" 
              id="anteileInput" 
              placeholder={inputType === "anteile" ? "Anteile" : "Betrag"} 
              onChange={handleInput}  
            />
            <p id="gray-text">Gesamt: {gesamtWert} $</p>
            <p id="gray-text">{inputIstGroeserAlsGuthaben && orderType === "buy" ? "Nicht genug Guthaben!": ""}</p>
            <p id="gray-text">{inputIstGroeserAlsAnteileImBesitz && orderType === "sell" ? "Zu wenig im Besitz!": ""}</p>
          </div>

          <div className="card-bottom">
            <select name="inputType" className="btn" onChange={handleInputTypes}>
              <option value="anteile">Anteile</option>
              <option value="betrag">Betrag</option>
            </select>
            <button 
              className={`${input === "" ? "btn-disabled" : "btn"} ${inputIstGroeserAlsGuthaben ? "btn-disabled" : "btn"}`} 
              onClick={openUebersicht} 
              disabled={input === "" || inputIstGroeserAlsGuthaben}>
                Weiter ❯
            </button>
          </div>
        </div>

      ) : (

        <>
        {/* Order Übersicht */}
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
                    <td>{anteile}</td>
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
          <>
          {/* Order BEstätigung */}
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
                  <p>Du hast {anteile} Aktie(n) für {gesamtWert} $ {orderType === "buy" ? "gekauft" : "verkauft"} ! </p>
                </div>
                <div className="card-bottom">
                  <button className="btn" onClick={openPortfolio}>Fertig</button>
                </div>
              </>
            )}
          </div>
          </>
        )}
        </>
      )}
    </div>
  )
}
