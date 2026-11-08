import { useState } from 'react';
import { useCarrito } from './context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import './assets/Styles/Checkout.css';

const API = "";

export default function Checkout() {
  const { carrito, total, limpiarCarrito } = useCarrito();
  const navigate = useNavigate();

  // ── ESTADOS ──
  const [paso, setPaso]         = useState<1 | 2 | 3>(1); // 1=datos, 2=yape, 3=éxito
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState("");
  const [captura, setCaptura]   = useState<File | null>(null);
  const [previewCaptura, setPreviewCaptura] = useState("");

  // ── FORMULARIO DEL CLIENTE ──
  const [form, setForm] = useState({
    nombre: "", telefono: "", direccion: ""
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCaptura(e: any) {
    const file = e.target.files[0];
    setCaptura(file);
    setPreviewCaptura(URL.createObjectURL(file));
  }

  // ── PASO 1: valida datos y avanza a Yape ──
  function handleContinuar() {
    if (!form.nombre || !form.telefono || !form.direccion) {
      setError("Por favor completa todos los campos");
      return;
    }
    setError("");
    setPaso(2);
  }

  // ── PASO 2: sube captura y registra pedido ──
  async function handleConfirmar() {
    if (!captura) {
      setError("Debes subir la captura del pago Yape");
      return;
    }
    setEnviando(true);
    setError("");

    try {
      // ✅ Sube la captura de Yape
      const fd = new FormData();
      fd.append("captura", captura);
      const resCaptura = await fetch(`${API}/api/pedidos/upload-captura`, {
        method: "POST", body: fd
      });
      const { ruta } = await resCaptura.json();

      // ✅ Crea el pedido en la BD
      await fetch(`${API}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCliente: form.nombre,
          telefono:      form.telefono,
          direccion:     form.direccion,
          // ✅ Guarda el carrito completo como JSON
          productos:     JSON.stringify(carrito),
          total:         total,
          capturaYape:   ruta,
          estado:        "pendiente",
        }),
      });

      // ✅ Limpia carrito y muestra éxito
      limpiarCarrito();
      setPaso(3);

    } catch (err) {
      setError("Hubo un error al procesar el pedido. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  // ── PANTALLA DE ÉXITO ──
  if (paso === 3) return (
    <div className="checkout-exito">
      <div className="exito-icono">✅</div>
      <h1>¡Pedido confirmado!</h1>
      <p>Gracias por tu compra, <strong>{form.nombre}</strong>.</p>
      <p>El dueño de la tienda revisará tu pago y se pondrá en contacto contigo pronto.</p>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );

  return (
    <div className="checkout-container">
      <h1>🛒 Checkout</h1>

      {/* ── INDICADOR DE PASOS ── */}
      <div className="checkout-pasos">
        <div className={`paso ${paso >= 1 ? 'activo' : ''}`}>1. Datos</div>
        <div className="paso-linea" />
        <div className={`paso ${paso >= 2 ? 'activo' : ''}`}>2. Pago Yape</div>
      </div>

      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-grid">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div className="checkout-left">

          {/* PASO 1 — Datos del cliente */}
          {paso === 1 && (
            <div className="checkout-form">
              <h2>📋 Datos de envío</h2>

              <label>Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                placeholder="Ej: Juan Pérez" />

              <label>Teléfono / WhatsApp</label>
              <input name="telefono" value={form.telefono} onChange={handleChange}
                placeholder="Ej: 987654321" type="tel" />

              <label>Dirección de envío</label>
              <input name="direccion" value={form.direccion} onChange={handleChange}
                placeholder="Calle, número, distrito, ciudad" />

              <button className="checkout-btn" onClick={handleContinuar}>
                Continuar al pago →
              </button>
            </div>
          )}

          {/* PASO 2 — Pago con Yape */}
          {paso === 2 && (
            <div className="checkout-form">
              <h2>📱 Pago con Yape</h2>

              {/* ✅ QR de Yape — imagen estática del dueño */}
              <div className="yape-qr-box">
                <p>Escanea el QR o transfiere al número:</p>
                <img
                  src="/yape-qr.png"
                  alt="QR Yape"
                  className="yape-qr"
                  onError={(e: any) => e.target.style.display = 'none'}
                />
                <div className="yape-numero">📱 916 044 534</div>
                <div className="yape-monto">
                  Monto a pagar: <strong>PEN {total.toFixed(2)}</strong>
                </div>
              </div>

              {/* ✅ Subida de captura del pago */}
              <div className="yape-captura">
                <label>📸 Sube la captura de tu pago Yape</label>
                <input type="file" accept="image/*" onChange={handleCaptura} />
                {previewCaptura && (
                  <img src={previewCaptura} alt="Captura Yape"
                    style={{ marginTop: 12, width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover" }} />
                )}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                {/* Botón volver */}
                <button className="checkout-btn-secondary" onClick={() => setPaso(1)}>
                  ← Volver
                </button>
                {/* Confirmar pedido */}
                <button className="checkout-btn" onClick={handleConfirmar} disabled={enviando}>
                  {enviando ? "Enviando..." : "✅ Confirmar pedido"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RESUMEN DEL PEDIDO ── */}
        <div className="checkout-resumen">
          <h2>📦 Resumen del pedido</h2>
          {carrito.map((p, i) => (
            <div key={i} className="checkout-item">
              <img src={p.imagen} alt={p.nombre} />
              <div>
                <p className="item-nombre">{p.nombre}</p>
                <p className="item-detalle">
                  Talla: {p.tallaSeleccionada} | Color: {p.colorSeleccionado} | Cant: {p.cantidad}
                </p>
                <p className="item-precio">PEN {(p.precio * p.cantidad).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total:</span>
            <strong>PEN {total.toFixed(2)}</strong>
          </div>
        </div>

      </div>
    </div>
  );
}