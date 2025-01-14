import React, { useEffect, useState } from 'react'
import TransaktionenFetch from './TransaktionenFetch'
import '../style/Style.css'

export default function Transaktionen() {
    const [alleTransaktionen, setAlleTransaktionen] = useState(null);

    const [error, setError] = useState(null);

    const [infosAreShown, setInfosAreShown] = useState(false);

    const [transaktionDetails, setTransaktionDetails] = useState(null);

    const transaktionenFetch = new TransaktionenFetch();

    function openInfos(transaktion) {
        setInfosAreShown(true);
        setTransaktionDetails({
            orderType: transaktion.orderType,
            aktienName: transaktion.aktienName,
            date: transaktion.orderDateAndTime,
            kurs: transaktion.buySellKurs,
            anteile: transaktion.aktie_anteile,
            gesamtwert: gesamtwert(transaktion.buySellKurs, transaktion.aktie_anteile),
        });
    }

    function closeInfos() {
        setInfosAreShown(false);
        setTransaktionDetails(null);
    }

    useEffect(() => {
        async function fetchTransaktionen() {
            try {
                const transaktionen = await transaktionenFetch.getAlleTransaktionen();
                setAlleTransaktionen(transaktionen);
            } catch (error) {
                console.log("Fehler beim Abrufen der Transaktionen", error.message);
                setError(error.message);
            }
        }
        fetchTransaktionen();
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('de-DE', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC'
        }).format(date);
    }

    function gesamtwert(kurs, anteile) {
        if (typeof kurs !== "number" || typeof anteile !== "number") {
            return "0.00";
        }
        return (kurs * anteile).toFixed(2);
    }

    if (error) {
        return <div>Fehler: {error}</div>;
    }

    return (
        <div className="body-content">
            <h1>Deine Transaktionen</h1>
        
            <div className="basic-div">
                <table className="tabelle">
                    <thead>
                        <tr>
                            <th>Order Typ</th>
                            <th>Aktien Name</th>
                            <th>Datum</th>
                            <th>Buy / Sell Kurs</th>
                            <th>Anteile</th>
                            <th>Gesamtwert</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alleTransaktionen ? (Array.isArray(alleTransaktionen) && alleTransaktionen.map((transaktion) => (
                                <tr key={transaktion.id} onClick={() => openInfos(transaktion)}>
                                    <td className={` ${transaktion.orderType === "buy" ? "positive-change" : "negative-change"}`}>{transaktion.orderType === "buy" ? "gekauft" : "verkauft"}</td>
                                    <td>{transaktion.aktienName}</td>
                                    <td>{formatDate(transaktion.orderDateAndTime)}</td>
                                    <td>{(transaktion.buySellKurs).toFixed(2)} $</td>
                                    <td>{transaktion.aktie_anteile}</td>
                                    <td>{gesamtwert(transaktion.buySellKurs, transaktion.aktie_anteile)} $</td>
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
            </div>
                          
            {infosAreShown ? (
                <div className="card fixed-card">
                    <div className="card-top">
                        <h2>Info</h2>
                        <button className="btn" onClick={() => closeInfos()}>X</button>
                    </div>

                    <div className="card-middle">
                        <table className="basic-tabelle">
                            <tbody>
                                <tr>
                                    <td>Order Type:</td>
                                    <td>{transaktionDetails?.orderType}</td>
                                </tr>
                                <tr>
                                    <td>Aktie:</td>
                                    <td>{transaktionDetails?.aktienName}</td>
                                </tr>
                                <tr>
                                    <td>Datum:</td>
                                    <td>{formatDate(transaktionDetails.date)}</td>
                                </tr>
                                <tr>
                                    <td>Buy/Sell Kurs:</td>
                                    <td>{transaktionDetails.kurs} $</td>
                                </tr>
                                <tr>
                                    <td>Anteile:</td>
                                    <td>{transaktionDetails.anteile}</td>
                                </tr>
                                <tr>
                                    <td>Gesamtwert:</td>
                                    <td>{transaktionDetails.gesamtwert} $</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="card-bottom">
                    </div>
                </div>
            ):(
                <></>
            )}
        </div>
    )
    
}