import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Catalogo from "./Catalogo";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Todo from "./Todo";
import ProductoDetalle from "./pages/ProductoDetalle";  // 👈
import "./assets/Styles/App.css";
import Admin from "./pages/Admin";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <Todo isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <nav className="navbar-top">
        <h2 className="logo">TIENDA ONLINE</h2>

        <div className="search-bar">
          <select className="search-select">
            <option>Todos</option>
            <option>Electrónicos</option>
            <option>Ropa</option>
            <option>Hogar</option>
          </select>
          <input type="text" placeholder="Buscar productos..." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>

        <div className="navbar-top__actions">
          <div className="action-item">
            <span className="action-small">🌐 ES</span>
          </div>
          <div className="action-item">
            <span className="action-small">Hola, Identifícate</span>
            <span className="action-bold">Cuenta y Listas ▾</span>
          </div>
          <div className="action-item">
            <span className="action-small">Devoluciones</span>
            <span className="action-bold">y pedidos</span>
          </div>
          <Link to="/cart" className="cart-action">
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Carrito</span>
          </Link>
        </div>
      </nav>
      
      <nav className="navbar-bottom">
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          ☰ Todo
        </button>
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/catalogo">CATÁLOGO</Link></li>
          <li><Link to="/cart">CARRITO</Link></li>
          <li><Link to="/checkout">CHECKOUT</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />  {/* 👈 */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}