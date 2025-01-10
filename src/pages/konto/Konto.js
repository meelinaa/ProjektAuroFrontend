import React, { useEffect, useState } from 'react'
import KontoFetch from './KontoFetch';
import Transaktionen from '../transaktionen/Transaktionen';

import './Konto.css';


export default function Konto() {
    const [guthaben, setGuthaben] = useState(null);
    const [inhaber, setInhaber] = useState(null);
    const [error, setError] = useState(null);

    const kontoFetch = new KontoFetch();

    useEffect(() => {
        async function fetchKontoDaten() {
            try {
                const guthaben = await kontoFetch.getGuthaben();
                setGuthaben(guthaben);

                const inhaber = await kontoFetch.getName();
                setInhaber(inhaber);
            } catch (error) {
                setError(error.message);
                console.error("Fehler beim Abrufen der Daten: ", error.message);
            }
        }
        fetchKontoDaten();
    },[])

    function getCssClass(value) {
        return value > 0 ? "positive-change" : value < 0 ? "negative-change" : "";
    }

    if (error) {
        return <div>Fehler: {error}</div>;
    }

    return (
        <div className="body-content">
            <h1 h-titel>Willkommen {inhaber}</h1>
            <div className="basic-div">
                <h2 className="no-padding-margin">Dein Guthaben:</h2>
                <p className={`no-padding-margin guthaben ${getCssClass(guthaben)}`}>{guthaben} $</p>
            </div>

            <Transaktionen/>
        </div>
    )
}
