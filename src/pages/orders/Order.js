import React, { use, useEffect, useState } from 'react';

import './Order.css';
import {  useParams } from 'react-router-dom';


export default function Order() {
  const {liveKurs: urlLiveKurs} = useParams();
  const {ticker: urlTicker} = useParams();

  const [liveKurs, setLiveKurs] = useState(urlLiveKurs);
  const [ticker, setTicker] = useState(urlTicker);
  

  const keys = [
      '1', '2', '3',
      '4', '5', '6',
      '7', '8', '9',
      ',', '0', '<'
    ];

  return (
      <div className="body-order">
    
        <div className="order-top">
          <div className="order-top-infos">
            <h1>Kaufen</h1>
            <h1>Anteile</h1>
          </div>
          <p className='order-verfuegbar'>23.567,69€ verfügbar</p>
        </div>

        <div className="order-middle">
          <div className="middle-value">
            <input type="text" name="anteileInput" id="anteileInput" placeholder="60"/>
            <p id="gesamtWertAusgabe">Gesamt: 1.980,00€</p>
          </div>
          <div className="keyboard">
            {keys.map((key, index) => (
              <button
                key={index}
                className="key"
                onClick={() => console.log(`Key pressed: ${key}`)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="order-bottom">
            <button className='nextBtn'>Weiter ➔</button>
          </div>
      </div>
    
  )
}
