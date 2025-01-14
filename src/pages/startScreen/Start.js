import React from 'react';
import './Start.css';
import '../style/Style.css';

import Logo from '../../pictures/Logo.png'; 
import Loading from '../../pictures/Loading.gif'; 

export default function Start() {

  return (
    <div className="start-body">
      <div className="start-loading">
        <img src={Logo} alt="Logo" id="logo" />
        <img src={Loading} alt="Loading" id="loading" />
      </div>
    </div>
  )

}