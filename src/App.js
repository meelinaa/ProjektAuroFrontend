import './App.css';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from "react-router-dom";

import Header from './pages/header/Header';
import Portfolio from './pages/portfolio/Portfolio';
import Aktie from './pages/aktie/Aktie';
import Order from './pages/orders/Order';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header/>}>
      <Route index element={<Portfolio/>} />
      <Route path="aktie" element={<Aktie/>}/>
      <Route path="order" element={<Order/>}/>

    </Route>
  )
)


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
