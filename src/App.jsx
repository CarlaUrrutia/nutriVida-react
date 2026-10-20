import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css"
import  Header from "./components/Header"
import Footer from "./components/Footer";

import Home from "./views/Home";
import Productos from "./views/Productos"
import Producto from "./views/Producto"
import Login from "./views/Login"
import Registro from "./views/Registro"


import {itemsMenu} from "./data/menu"

function App() {
  return (
    <>
      <Header 
        itemsMenu={itemsMenu} 
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto" element={<Producto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
  

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer 
        anio={2026} 
        nombreTienda="NutriVida" 
        eslogan="Tu salud es primero" 
      />
    </>
  );
}

export default App;