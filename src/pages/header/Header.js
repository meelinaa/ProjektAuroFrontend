import { NavLink, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Logo from '../../pictures/Logo.png'; 
import Konto from '../../pictures/Konto.png';

import './Header.css';
import '../style/Style.css';

export default function Header() {

    const navigate = useNavigate();

    return (
        <div className="body-layout">
            <header>
                <div className="header-logo">
                    <img src={Logo} alt="Logo" onClick={() => navigate("/") }/>
                </div>
        
                <nav className="nav-menu">
                    <NavLink to="portfolio" id="nav-link">Portfolio</NavLink>
                    <NavLink to="aktie" id="nav-link">Suche</NavLink>
                </nav>
        
                <div className="header-right">
                    <div className="header-konto">
                        <NavLink to="konto">
                            <img src={Konto} alt="Konto" />
                        </NavLink>
                    </div>
                </div>
            </header>
        
            <main className="main-body">
                <Outlet/>
            </main>
        </div>
    )
}
