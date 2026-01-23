import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import ProductOverlayPage from './pages/ProductOverlayPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const showOverlay = location.pathname.startsWith('/order/cart/');

  return (
    <>
      <MenuPage />
      {showOverlay && <ProductOverlayPage />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;