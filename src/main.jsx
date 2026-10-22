import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProductosProvider } from './context/ProductosContext'
import { CarritoProvider } from './context/CarritoContext'
import { FavoritosProvider } from './context/FavoritosContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <ProductosProvider>
        <FavoritosProvider>
          <CarritoProvider>
            <App/>
          </CarritoProvider>
        </FavoritosProvider>
      </ProductosProvider>
    </AuthProvider>
  </BrowserRouter>
  </StrictMode>
)
