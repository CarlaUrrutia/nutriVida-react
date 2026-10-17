import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css"
import  Header from "./components/Header"
import Footer from "./components/Footer";

import Home from "./views/Home";
import Productos from "./views/Productos"


import {itemsMenu} from "./data/menu"

function App() {
  return (
    <>
      <Header 
        titulo="NutriVida" 
        subtitulo="Centro Nutricional" 
        itemsMenu={itemsMenu} 
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
  

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