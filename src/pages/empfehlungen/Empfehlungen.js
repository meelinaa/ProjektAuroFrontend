import React from 'react'
import './Empfehlungen.css';


export default function Empfehlungen() {
    const empfohleneAktien = [
        { name: 'Tesla', ticker: 'TSLA' },
        { name: 'Apple', ticker: 'AAPL' },
        { name: 'Microsoft', ticker: 'MSFT' },
        { name: 'Amazon', ticker: 'AMZN' },
        { name: 'Alphabet (Google) Class A', ticker: 'GOOGL' },
        { name: 'Alphabet (Google) Class C', ticker: 'GOOG' },
        { name: 'Meta Platforms (Facebook)', ticker: 'META' },
        { name: 'NVIDIA', ticker: 'NVDA' },
        { name: 'Berkshire Hathaway', ticker: 'BRK.B' },
        { name: 'Johnson & Johnson', ticker: 'JNJ' },
        { name: 'Visa', ticker: 'V' },
        { name: 'Procter & Gamble', ticker: 'PG' },
        { name: 'UnitedHealth Group', ticker: 'UNH' },
        { name: 'JPMorgan Chase', ticker: 'JPM' },
        { name: 'Samsung Electronics', ticker: 'SSNLF' },
        { name: 'Exxon Mobil', ticker: 'XOM' },
        { name: 'Coca-Cola', ticker: 'KO' },
        { name: 'PepsiCo', ticker: 'PEP' },
        { name: 'Walmart', ticker: 'WMT' },
        { name: 'Toyota', ticker: 'TM' }
    ];
    
    

    function navigateToAktie(ticker) {
        window.location.href = `/aktie/${ticker}`;
    }

    const first10Aktien = empfohleneAktien.slice(0, 10); 
    const next10Aktien = empfohleneAktien.slice(10, 20); 

return (
    <div className="empfehlungen-body">
        <h2>Empfehlungen</h2>
        <div className="empfohlene-aktien">
        <table className="empfohlene-aktien-tabelle">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Ticker</th>
                </tr>
            </thead>
            <tbody>
                {first10Aktien.map((aktie, index) => (
                    <tr key={index} onClick={() => navigateToAktie(aktie.ticker)}>
                        <td>{aktie.name}</td>
                        <td>{aktie.ticker}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <table className="empfohlene-aktien-tabelle">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Ticker</th>
                </tr>
            </thead>
            <tbody>
                {next10Aktien.map((aktie, index) => (
                    <tr key={index + 10} onClick={() => navigateToAktie(aktie.ticker)}>
                        <td>{aktie.name}</td>
                        <td>{aktie.ticker}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        
    </div>
);

}
