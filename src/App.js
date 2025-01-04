import './App.css';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, useNavigate} from "react-router-dom";

import Header from './pages/header/Header';
import Portfolio from './pages/portfolio/Portfolio';
import Aktie from './pages/aktie/Aktie';
import Order from './pages/orders/Order';
import Start from './pages/startScreen/Start';
import { useEffect } from 'react';

function StartWithRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
      const timer = setTimeout(() => {
          navigate('/portfolio'); 
      }, 3000);

      return () => clearTimeout(timer); 
  }, [navigate]);

  return <Start />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
      <>
          <Route path="/" element={<StartWithRedirect />} />

          <Route path="/" element={<Header />}>
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="aktie" element={<Aktie />} />
              <Route path="aktie/:ticker" element={<Aktie />} />
              <Route path="order" element={<Order />} />
          </Route>
      </>
  )
);


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
