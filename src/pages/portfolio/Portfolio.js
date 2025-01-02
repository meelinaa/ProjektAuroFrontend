import React from 'react'

import './Portfolio.css';


export default function Portfolio() {
  return (
    <div className="bodyPortfolio">
      <h1>Willkommen NAME</h1>

      <div className="aktienUebersicht">
        <h2>Portfolio</h2>
        <table>
    <thead>
      <th>Aktie</th>
      <th>Kurs</th>
      <th>Gesamtwert</th>
      <th>Performance</th>
      <th>Rendite</th>
      <th>Buy In</th>
      <th>Anteile</th>
    </thead>
    <tbody>
      <tr>
        <td>NVDA</td>
        <td>130,34 §</td>
        <td>2510,32 $</td>
        <td>20 %</td>
        <td>300 $</td>
        <td>124,53 $</td>
        <td>76,34543234</td>
      </tr>

      <tr>
        <td>NVDA</td>
        <td>130,34 §</td>
        <td>2510,32 $</td>
        <td>20 %</td>
        <td>300 $</td>
        <td>124,53 $</td>
        <td>76,34543234</td>
      </tr>

      <tr>
        <td>NVDA</td>
        <td>130,34 §</td>
        <td>2510,32 $</td>
        <td>20 %</td>
        <td>300 $</td>
        <td>124,53 $</td>
        <td>76,34543234</td>
      </tr>

      <tr>
        <td>NVDA</td>
        <td>130,34 §</td>
        <td>2510,32 $</td>
        <td>20 %</td>
        <td>300 $</td>
        <td>124,53 $</td>
        <td>76,34543234</td>
      </tr>

      <tr>
        <td>-</td>
        <td>-</td>
        <td>12.685,64 $</td>
        <td>20 %</td>
        <td>1500 $</td>
        <td>-</td>
        <td>-</td>
      </tr>

    </tbody>
        </table>

      </div>

      <div className="empfehlungenUebersicht">
        <h2>Empfelungen</h2>
        <div className="empfehlungenUebersichtAusgabe">
          <table>
      <thead>
        <th>Beste Aktien</th>
      </thead>
      <tbody>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
      </tbody>
      
          </table>
          <table>
      <thead>
        <th>Beliebteste Aktien</th>
      </thead>
      <tbody>
      <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
        <tr>
          <td><img src="logo" /></td>
          <td>NVDA</td>
        </tr>
      </tbody>
      
          </table>
        </div>
      </div>

      <div className="analyseUebersicht">
        <h2>Analyse</h2>
        <div className="placeholderAnalyse">
          <div className="placeholder">

          </div>

          <table>
            <thead>
              <th>Aktie</th>
              <th>Anteil in %</th>
            </thead>
            <tbody>
              <tr>
                <td>NDVA</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>NDVA</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>NDVA</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>NDVA</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>NDVA</td>
                <td>20%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}