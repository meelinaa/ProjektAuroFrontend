import React, { useEffect, useState } from 'react'
import TransaktionenFetch from './TransaktionenFetch';
import '../style/Style.css';



export default function Transaktionen() {
    const [alleTransaktionen, setAlleTransaktionen] = useState(null);

    const [error, setError] = useState(null);

    const [infosAreShown, setInfosAreShown] = useState(false);

    const [transaktionOrderType, setTransaktionOrderType] = useState(null);
    const [transaktionAktienName, setTransaktionAktienName] = useState(null);
    const [transaktionDate, setTransaktionDate] = useState(null);
    const [transaktionKurs, setTransaktionKurs] = useState(null);
    const [transaktionAnteile, setTransaktionAnteile] = useState(null);
    const [transaktionGesamtwert, setTransaktionGesamtwert] = useState(null);

    const transaktionenFetch = new TransaktionenFetch();

    function openInfos(transaktion){
        setInfosAreShown(true);
        
        setTransaktionOrderType(transaktion.orderType);
        setTransaktionAktienName(transaktion.aktienName);
        setTransaktionDate(transaktion.orderDateAndTime);
        setTransaktionKurs(transaktion.buySellKurs);
        setTransaktionAnteile(transaktion.aktie_anteile);
        setTransaktionGesamtwert(gesamtwert(transaktion.buySellKurs, transaktion.aktie_anteile));
    }

    function closeInfos(){
        setInfosAreShown(false);

        setTransaktionOrderType(null);
        setTransaktionAktienName(null);
        setTransaktionDate(null);
        setTransaktionKurs(null);
        setTransaktionAnteile(null);
        setTransaktionGesamtwert(null);
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

    function gesamtwert(kurs, anteile) {
        return (kurs * anteile).toFixed(2);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('de-DE', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
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
                                    <td className={` ${transaktion.orderType === "buy" ? "positive-change" : "negative-change"}`}>{transaktion.orderType}</td>
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
                                    <td>{transaktionOrderType}</td>
                                </tr>
                                <tr>
                                    <td>Aktie:</td>
                                    <td>{transaktionAktienName}</td>
                                </tr>
                                <tr>
                                    <td>Datum:</td>
                                    <td>{formatDate(transaktionDate)}</td>
                                </tr>
                                <tr>
                                    <td>Buy/Sell Kurs:</td>
                                    <td>{transaktionKurs} $</td>
                                </tr>
                                <tr>
                                    <td>Anteile:</td>
                                    <td>{transaktionAnteile}</td>
                                </tr>
                                <tr>
                                    <td>Gesamtwert:</td>
                                    <td>{transaktionGesamtwert} $</td>
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