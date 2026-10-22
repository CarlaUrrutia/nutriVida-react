import { Route, Routes } from "react-router-dom";
import "./App.css"
import Header from "./components/Header"
import Footer from "./components/Footer";
import RutaPrivada from "./components/RutaPrivada"

import Home from "./views/Home";
import Productos from "./views/Productos"
import Producto from "./views/Producto"
import Login from "./views/Login"
import Registro from "./views/Registro"
import Carrito from "./views/Carrito"
import Panel from "./views/Panel"
import MiPerfil from "./views/MiPerfil"
import NotFound from "./views/NotFound"

import { itemsMenu } from "./data/menu"

function App() {
  return (
    <>
      <Header
        itemsMenu={itemsMenu}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route
          path="/admin"
          element={
            <RutaPrivada soloAdmin>
              <Panel />
            </RutaPrivada>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaPrivada>
              <MiPerfil />
            </RutaPrivada>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
