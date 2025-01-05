import { NavLink, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Logo from '../../pictures/Logo.png'; 
import Konto from '../../pictures/Konto.png';

import './Header.css';


export default function Header() {

    const navigate = useNavigate();

  return (
    <div className="body-layout">
        <header>
            <div className="header-logo">
                <img src={Logo} alt="Logo" onClick={() => navigate("/") }/>
            </div>

            <nav className="nav-menu">
                <NavLink to="portfolio">Portfolio</NavLink>
                <NavLink to="aktie">Aktie</NavLink>
                <NavLink to="order/:liveKurs/:ticker">Handeln</NavLink>

            </nav>

            <div className="header-right">
                <div className="header-konto">
                    <img src={Konto} alt="Konto" />
                </div>
            </div>
            
        </header>

        <main>
            <Outlet/>
        </main>
    </div>
  )
}
