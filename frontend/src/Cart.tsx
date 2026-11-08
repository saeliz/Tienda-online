import { useCarrito } from './context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import './assets/Styles/Cart.css';

export default function Cart() {
  // Obtenemos los productos del carrito, la función eliminar y el total
  const { carrito, eliminarDelCarrito, total } = useCarrito();
  const navigate = useNavigate();

  // Si el carrito está vacío mostramos mensaje
  if (carrito.length === 0) return (
    <div className="cart-vacio">
      <h2>Tu carrito está vacío</h2>
      <button onClick={() => navigate('/catalogo')}>Ver productos</button>
    </div>
  );

  return (
    <div className="cart-container">
      <h1>🛒 Mi Carrito</h1>

      {/* Iteramos cada producto del carrito */}
      {carrito.map((p, i) => (
        <div className="cart-item" key={i}>
          <img src={p.imagen} alt={p.nombre} />
          <div className="cart-item-info">
            <h3>{p.nombre}</h3>
            {/* Mostramos el color como círculo con el color real */}
            <p>Color: <span style={{ backgroundColor: p.colorSeleccionado, display: 'inline-block', width: 16, height: 16, borderRadius: '50%', verticalAlign: 'middle' }} /></p>
            <p>Talla: {p.tallaSeleccionada}</p>
            <p>Cantidad: {p.cantidad}</p>
            <p>PEN {(p.precio * p.cantidad).toFixed(2)}</p>
            {/* Eliminamos por id + color + talla para no borrar variantes diferentes */}
            <button onClick={() => eliminarDelCarrito(p.id, p.colorSeleccionado, p.tallaSeleccionada)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <h2>Total: PEN {total.toFixed(2)}</h2>
        <button className="cart-btn-pagar" onClick={() => navigate('/checkout')}>
          Ir a pagar →
        </button>
      </div>
    </div>
  );
}