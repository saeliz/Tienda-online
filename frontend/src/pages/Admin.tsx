import { useState, useEffect } from "react";

// ✅ En Docker el frontend llama al backend via /api/
const API = "";

const categorias = ["damas", "caballeros", "niñas", "niños"];

export default function Admin() {
  const [productos, setProductos] = useState<any[]>([]);

  // ✅ Estado del formulario — incluye oferta
  const [form, setForm] = useState({
    nombre: "", precio: "", categoria: "damas",
    estrellas: "5", resenas: "0", envio: "Entrega GRATIS 8-11 mayo",
    tallas: "S,M,L,XL", colores: "#000000",
    enOferta: false,
    precioOferta: "",
  });

  const [imagen, setImagen]           = useState<File | null>(null);
  const [preview, setPreview]         = useState("");
  // ✅ Array de videos — soporta múltiples videos por producto
  const [videos, setVideos]           = useState<File[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [editId, setEditId]           = useState<number | null>(null);
  const [msg, setMsg]                 = useState("");

  // ✅ Formulario vacío reutilizable
  const formVacio = {
    nombre: "", precio: "", categoria: "damas",
    estrellas: "5", resenas: "0", envio: "Entrega GRATIS 8-11 mayo",
    tallas: "S,M,L,XL", colores: "#000000",
    enOferta: false, precioOferta: "",
  };

  useEffect(() => { cargarProductos(); }, []);

  async function cargarProductos() {
    const res  = await fetch(`${API}/api/productos`);
    const data = await res.json();
    setProductos(data);
  }

  // ✅ Cambios en inputs de texto/number/select
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ✅ Selección de imagen principal
  function handleImagen(e: any) {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  }

  // ✅ Selección de múltiples videos — sin límite fijo
  function handleVideos(e: any) {
    const files = Array.from(e.target.files) as File[];
    setVideos(files);
    setPreviewVideos(files.map(f => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMsg("");
    let rutaImagen   = "";
    let rutasVideos: string[] = [];

    // ✅ Sube imagen si hay una nueva
    if (imagen) {
      const fd  = new FormData();
      fd.append("imagen", imagen);
      const res  = await fetch(`${API}/api/productos/upload`, { method: "POST", body: fd });
      const data = await res.json();
      rutaImagen = data.ruta;
    }

    // ✅ Sube todos los videos seleccionados de una vez
    if (videos.length > 0) {
      const fd = new FormData();
      videos.forEach(v => fd.append("videos", v));
      const res  = await fetch(`${API}/api/productos/upload-videos`, { method: "POST", body: fd });
      const data = await res.json();
      rutasVideos = data.rutas;
    }

    // ✅ Imagen obligatoria solo en productos nuevos
    if (!editId && !rutaImagen) {
      setMsg("⚠️ Debes subir una imagen del producto");
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    // ✅ Construye el objeto producto
    const producto = {
      ...form,
      precio:       parseFloat(form.precio),
      estrellas:    parseInt(form.estrellas),
      resenas:      parseInt(form.resenas),
      tallas:       form.tallas.split(",").map((t: string) => t.trim()),
      colores:      form.colores.split(",").map((c: string) => c.trim()),
      enOferta:     form.enOferta,
      precioOferta: form.enOferta && form.precioOferta ? parseFloat(form.precioOferta) : null,
      ...(rutaImagen          && { imagen: rutaImagen }),
      ...(rutasVideos.length > 0 && { videos: rutasVideos }),
    };

    if (editId) {
      // ✅ Editar producto existente
      await fetch(`${API}/api/productos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
      setMsg("✅ Producto actualizado");
      setEditId(null);
    } else {
      // ✅ Crear producto nuevo
      await fetch(`${API}/api/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
      setMsg("✅ Producto agregado");
    }

    // ✅ Limpia todo
    setForm(formVacio);
    setImagen(null);    setPreview("");
    setVideos([]);      setPreviewVideos([]);
    cargarProductos();
    setTimeout(() => setMsg(""), 3000);
  }

  // ✅ Carga producto en formulario para editar
  function handleEditar(p: any) {
    setEditId(p.id);
    setForm({
      nombre:       p.nombre,
      precio:       p.precio,
      categoria:    p.categoria,
      estrellas:    p.estrellas,
      resenas:      p.resenas,
      envio:        p.envio,
      tallas:       Array.isArray(p.tallas)  ? p.tallas.join(",")  : p.tallas,
      colores:      Array.isArray(p.colores) ? p.colores.join(",") : p.colores,
      enOferta:     p.enOferta    || false,
      precioOferta: p.precioOferta || "",
    });
    setPreview(p.imagen || "");
    // ✅ Muestra los videos existentes del producto al editar
    setPreviewVideos(Array.isArray(p.videos) ? p.videos : []);
    window.scrollTo(0, 0);
  }

  // ✅ Elimina producto con confirmación
  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`${API}/api/productos/${id}`, { method: "DELETE" });
    setMsg("🗑️ Producto eliminado");
    cargarProductos();
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#c0392b" }}>🛍️ Panel Admin — Elegant Clothes</h1>

      {/* Mensaje de éxito o advertencia */}
      {msg && (
        <div style={{
          background: msg.startsWith("⚠️") ? "#fff3cd" : "#d4edda",
          padding: 12, borderRadius: 8, marginBottom: 16
        }}>
          {msg}
        </div>
      )}

      {/* ══ FORMULARIO ══ */}
      <div style={{ background: "#fff5f5", padding: 24, borderRadius: 12, marginBottom: 32 }}>
        <h2>{editId ? "✏️ Editar Producto" : "➕ Agregar Producto"}</h2>
        <form onSubmit={handleSubmit}>

          {/* Grid de campos principales */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label>Nombre del producto</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required
                style={inp} placeholder="Ej: Vestido Elegante Negro" />
            </div>
            <div>
              <label>Precio (S/)</label>
              <input name="precio" value={form.precio} onChange={handleChange} required
                type="number" step="0.01" style={inp} placeholder="132.47" />
            </div>
            <div>
              <label>Categoría</label>
              <select name="categoria" value={form.categoria} onChange={handleChange} style={inp}>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Tallas (separadas por coma)</label>
              <input name="tallas" value={form.tallas} onChange={handleChange}
                style={inp} placeholder="S,M,L,XL" />
            </div>
            <div>
              <label>Colores (códigos hex separados por coma)</label>
              <input name="colores" value={form.colores} onChange={handleChange}
                style={inp} placeholder="#FF0000,#000000" />
            </div>
            <div>
              <label>Estrellas (1-5)</label>
              <input name="estrellas" value={form.estrellas} onChange={handleChange}
                type="number" min="1" max="5" style={inp} />
            </div>
            <div>
              <label>Reseñas (cantidad)</label>
              <input name="resenas" value={form.resenas} onChange={handleChange}
                type="number" style={inp} />
            </div>
            <div>
              <label>Mensaje de envío</label>
              <input name="envio" value={form.envio} onChange={handleChange} style={inp} />
            </div>
          </div>

          {/* ── SWITCH DE OFERTA ── */}
          <div style={{ marginTop: 20, padding: 16, background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ fontWeight: "bold" }}>🏷️ Producto en Oferta</label>
              {/* Switch visual */}
              <div
                onClick={() => setForm({ ...form, enOferta: !form.enOferta, precioOferta: "" })}
                style={{
                  width: 52, height: 28, borderRadius: 14, cursor: "pointer",
                  background: form.enOferta ? "#c0392b" : "#ccc",
                  position: "relative", transition: "background 0.3s",
                }}
              >
                <div style={{
                  position: "absolute", top: 3,
                  left: form.enOferta ? 26 : 3,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "white", transition: "left 0.3s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }} />
              </div>
              <span style={{ color: form.enOferta ? "#c0392b" : "#888", fontWeight: "bold" }}>
                {form.enOferta ? "✅ Activo" : "❌ Inactivo"}
              </span>
            </div>

            {/* Campo precio oferta — solo si el switch está activo */}
            {form.enOferta && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <label>Precio de oferta (S/)</label>
                  <input name="precioOferta" value={form.precioOferta} onChange={handleChange}
                    type="number" step="0.01" style={{ ...inp, maxWidth: 200 }}
                    placeholder="Ej: 89.90" />
                </div>
                {/* Badge de descuento automático */}
                {form.precio && form.precioOferta && (
                  <span style={{ background: "#c0392b", color: "white", borderRadius: 6, padding: "4px 12px", fontWeight: "bold", marginTop: 20 }}>
                    -{Math.round((1 - Number(form.precioOferta) / Number(form.precio)) * 100)}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── IMAGEN PRINCIPAL ── */}
          <div style={{ marginTop: 16 }}>
            <label>Imagen del producto</label>
            <input type="file" accept="image/*" onChange={handleImagen}
              style={{ display: "block", marginTop: 8 }} />
            {preview && <img src={preview} style={{ marginTop: 8, height: 120, borderRadius: 8, objectFit: "cover" }} />}
          </div>

          {/* ── VIDEOS — múltiples, sin límite fijo ── */}
          <div style={{ marginTop: 16 }}>
            <label>Videos del producto (opcional — puedes seleccionar varios a la vez)</label>
            {/* ✅ multiple permite seleccionar más de un archivo */}
            <input type="file" accept="video/*" multiple onChange={handleVideos}
              style={{ display: "block", marginTop: 8 }} />
            {/* Preview de cada video seleccionado */}
            {previewVideos.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {previewVideos.map((url, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <video src={url} controls style={{ height: 100, borderRadius: 8 }} />
                    <span style={{ position: "absolute", top: 4, left: 4, background: "#c0392b", color: "white", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── BOTONES ── */}
          <button type="submit" style={btn}>
            {editId ? "💾 Guardar cambios" : "➕ Agregar producto"}
          </button>
          {editId && (
            <button type="button" onClick={() => {
              setEditId(null);
              setForm(formVacio);
              setPreview("");
              setVideos([]);
              setPreviewVideos([]);
            }} style={{ ...btn, background: "#888", marginLeft: 8 }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* ══ TABLA DE PRODUCTOS ══ */}
      <h2>📦 Productos en la tienda ({productos.length})</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#c0392b", color: "white" }}>
            <th style={th}>Imagen</th>
            <th style={th}>Nombre</th>
            <th style={th}>Categoría</th>
            <th style={th}>Precio</th>
            {/* Columna con switch de oferta */}
            <th style={th}>Oferta</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>

              <td style={td}>
                <img src={p.imagen}
                  style={{ height: 60, width: 50, objectFit: "cover", borderRadius: 4 }}
                  onError={(e: any) => e.target.style.display = "none"} />
              </td>
              <td style={td}>{p.nombre}</td>
              <td style={td}>{p.categoria}</td>

              {/* Precio — tachado si hay oferta */}
              <td style={td}>
                {p.enOferta && p.precioOferta ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: 12 }}>
                      S/ {Number(p.precio).toFixed(2)}
                    </span>
                    <span style={{ color: "#c0392b", fontWeight: "bold" }}>
                      S/ {Number(p.precioOferta).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span>S/ {Number(p.precio).toFixed(2)}</span>
                )}
              </td>

              {/* ✅ Switch de oferta directo en la tabla */}
              <td style={td}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    onClick={async () => {
                      await fetch(`${API}/api/productos/${p.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ enOferta: !p.enOferta }),
                      });
                      cargarProductos();
                    }}
                    style={{
                      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                      background: p.enOferta ? "#c0392b" : "#ccc",
                      position: "relative", transition: "background 0.3s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 2,
                      left: p.enOferta ? 22 : 2,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "white", transition: "left 0.3s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }} />
                  </div>
                  {/* Badge % descuento o texto sin oferta */}
                  {p.enOferta && p.precioOferta ? (
                    <span style={{ background: "#c0392b", color: "white", borderRadius: 4, padding: "2px 6px", fontSize: 11, fontWeight: "bold" }}>
                      -{Math.round((1 - Number(p.precioOferta) / Number(p.precio)) * 100)}% OFF
                    </span>
                  ) : (
                    <span style={{ color: "#aaa", fontSize: 12 }}>Sin oferta</span>
                  )}
                </div>
              </td>

              <td style={td}>
                <button onClick={() => handleEditar(p)}
                  style={{ background: "#f39c12", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", marginRight: 8 }}>
                  ✏️ Editar
                </button>
                <button onClick={() => handleEliminar(p.id)}
                  style={{ background: "#e74c3c", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
                  🗑️ Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── ESTILOS REUTILIZABLES ──
const inp: any = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", marginTop: 4, fontSize: 14 };
const btn: any = { marginTop: 20, background: "#c0392b", color: "white", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 16, cursor: "pointer" };
const th: any  = { padding: "10px 12px", textAlign: "left" };
const td: any  = { padding: "10px 12px" };