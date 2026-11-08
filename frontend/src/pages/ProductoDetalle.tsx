import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import '../assets/Styles/ProductoDetalle.css';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState<any>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string>('');
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  // ✅ Carga el producto desde la BD por ID
  useEffect(() => {
    fetch(`/api/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        setColorSeleccionado(data.colores[0]);
        setTallaSeleccionada(data.tallas[0]);
      });
  }, [id]);

  const handleAgregar = () => {
    agregarAlCarrito({ ...producto, colorSeleccionado, tallaSeleccionada, cantidad });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (!producto) return <p className="cargando">Cargando...</p>;

  return (
    <div className="detalle-container">
      <button className="detalle-volver" onClick={() => navigate(-1)}>← Volver</button>
      <div className="detalle-grid">

        {/* IMAGEN DEL PRODUCTO */}
        <div className="detalle-imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detalle-info">
          <h2>{producto.nombre}</h2>

          {/* ✅ Estrellas y reseñas */}
          <div className="detalle-estrellas">
            {'★'.repeat(Number(producto.estrellas))}
            {'☆'.repeat(5 - Number(producto.estrellas))}
            <span>({Number(producto.resenas).toLocaleString()})</span>
          </div>

          {/* ✅ Precio — muestra oferta si está activa, sino precio normal */}
          <div className="detalle-precio">
            {producto.enOferta && producto.precioOferta ? (
              <>
                {/* Precio original tachado */}
                <span style={{ textDecoration: "line-through", color: "#888", fontSize: 18, marginRight: 8 }}>
                  PEN {Number(producto.precio).toFixed(2)}
                </span>
                {/* Precio con descuento */}
                <span className="pen">PEN</span> {Number(producto.precioOferta).toFixed(2)}
                {/* Badge de descuento */}
                <span style={{ background: "#c0392b", color: "white", borderRadius: 4, padding: "2px 8px", marginLeft: 8, fontSize: 14 }}>
                  -{Math.round((1 - Number(producto.precioOferta) / Number(producto.precio)) * 100)}% OFF
                </span>
              </>
            ) : (
              <>
                <span className="pen">PEN</span> {Number(producto.precio).toFixed(2)}
              </>
            )}
          </div>

          <p className="detalle-envio">🚚 {producto.envio}</p>

          {/* ✅ Selector de color */}
          <div className="detalle-seccion">
            <p>Color:</p>
            <div className="detalle-colores">
              {producto.colores.map((color: string) => (
                <button
                  key={color}
                  className={`color-btn ${colorSeleccionado === color ? 'activo' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setColorSeleccionado(color)}
                />
              ))}
            </div>
          </div>

          {/* ✅ Selector de talla */}
          <div className="detalle-seccion">
            <p>Talla:</p>
            <div className="detalle-tallas">
              {producto.tallas.map((talla: string) => (
                <button
                  key={talla}
                  className={`talla-btn ${tallaSeleccionada === talla ? 'activo' : ''}`}
                  onClick={() => setTallaSeleccionada(talla)}>
                  {talla}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Selector de cantidad */}
          <div className="detalle-seccion">
            <p>Cantidad:</p>
            <div className="detalle-cantidad">
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>−</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(c => c + 1)}>+</button>
            </div>
          </div>

          {/* ✅ Botón agregar al carrito */}
          <button className="detalle-btn-carrito" onClick={handleAgregar}>
            {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>

        </div>
      </div>
    </div>
  );
}