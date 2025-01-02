import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Logo from '../../pictures/Logo.png'; 
import Konto from '../../pictures/Konto.png';

import './Header.css';


export default function Header() {
  return (
    <div className="body-layout">
        <header>
            <div className="header-logo">
                <img src={Logo} alt="Logo" />
            </div>

            <nav className="nav-menu">
                <NavLink to="/">Portfolio</NavLink>
                <NavLink to="aktie">Aktie</NavLink>
                <NavLink to="order">Handeln</NavLink>

            </nav>

            <div className="header-konto">
                <img src={Konto} alt="Konto" />
            </div>
        </header>

        <main>
            <Outlet/>
        </main>
    </div>
  )
}
