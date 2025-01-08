import React, { use, useEffect, useState } from 'react';

import './Order.css';
import {  useNavigate, useParams } from 'react-router-dom';
import OrderFetch from './OrderFetch';
import KontoFetch from '../konto/KontoFetch';


export default function Order() {
  const {liveKurs: urlLiveKurs} = useParams();
  const {ticker: urlTicker} = useParams();
  const {orderType: urlOrderType} = useParams();
  const {companyName: urlCompanyName} = useParams();

  const [liveKurs, setLiveKurs] = useState(urlLiveKurs);
  const [ticker, setTicker] = useState(urlTicker);
  const [orderType, setOrderType] = useState(urlOrderType);
  const [companyName, setCompanyName] = useState(urlCompanyName);

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
      <div className="body-order">

      {!aufWeiterGeklickt ? (

        <div className="order-card hide" >
          <div className="order-top">
            <div className="order-top-infos">
              <h1>{orderType === "buy" ? "Kaufen" : "Verkaufen"}</h1>
            </div>
            <p className='order-verfuegbar'>{guthaben} $ verfügbar</p>
          </div>

          <div className="order-middle">
            <div className="middle-value">
              <input type="text" name="anteileInput" id="anteileInput" placeholder="Anteile" onInput={handleInput}/>
              <p id="gesamtWertAusgabe">Gesamt: {gesamtWert} $</p>
              {/* Fehlermeldung Hinzufügen, dass wenn der gewünschte Betrag größer als das Guthaben ist */}
              <p id="gesamtWertAusgabe">{inputIstGroeserAlsGuthaben ? "Nicht genug Guthaben!": " "}</p>
            </div>
          </div>

          <div className="order-bottom ">
            <select name="inputType" id="inputType" onChange={handleInputTypes}>
              <option value="anteile">Anteile</option>
              <option value="geldWert">Geld</option>
            </select>
            <button   className={` ${input === "" ? "btn-disabled" : "nextBtn"} ${inputIstGroeserAlsGuthaben ? "btn-disabled" : "nextBtn"}`} onClick={openUebersicht}>Weiter ❯</button>
          </div>
        </div>

      ) : (
        <>
        {!aufBestaetigenGeklickt ? (
          <div className="order-card">
          <div className="order-top">
            <div className="order-top-infos">
              <h1>Übersicht</h1>
            </div>
          </div>

          <div className="order-middle">
            <div className="order-infos">
              <table className='order-uebersicht-tab'>
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
              
            </div>
            <h3>Gesamtbetrag: {gesamtWert} $</h3>
            
          </div>
          <div className="order-bottom uebersicht-btn">
            <button className='nextBtn ' onClick={openUebersicht}>❮ Zurück</button>
            <button className='nextBtn ' onClick={() => transaktionStarten()}>Bestätigen</button>
          </div>
        </div>
        ): (
          <div className="order-card">
            <div className="order-top">
              <div className="order-top-infos">
                <h1>Bestätigung</h1>
              </div>
            </div>

            {isTransaktionFehlgeschlagen ? (
              <>
                <div className="order-middle">
                  <p>Die Transaktion ist fehlgeschlagen. Versuche es bitte erneut.</p>
                </div>
                <div className="order-bottom">
                  <button className='nextBtn ' onClick={() => openAktie(ticker)}>Fertig</button>
                </div>
              </>
            ) : (
              <>
                <div className="order-middle">
                  <p>Du hast {input} Aktie(n) für {gesamtWert} $ {orderType === "buy" ? "gekauft" : "verkauft"} ! </p>
                </div>

                <div className="order-bottom">
                  <button className='nextBtn ' onClick={openPortfolio}>Fertig</button>
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
