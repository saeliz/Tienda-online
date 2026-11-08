import { useState, useEffect } from 'react';
import './assets/Styles/Home.css';
import heroVideo from './assets/Videos/inicio.mp4';
import Footer from './footer';
import "./assets/Styles/footer.css";

// ── VIDEOS DE RESPALDO — se usan si el producto no tiene videos subidos ──
import vid1 from './assets/Videos/Home01.mp4';
import vid2 from './assets/Videos/video2.mp4';
import vid3 from './assets/Videos/video3.mp4';

const videosRespaldo = [vid1, vid2, vid3];

// ── DATOS DEL SLIDER HERO ──
const slides = [
  {
    badge: "🔥 OFERTA DEL DÍA",
    titulo: "Hasta",
    descuento: "-30%",
    subtitulo: "En vestidos elegantes",
    detalle: "Solo por hoy · Colección 2026",
    btn: "Ver Ofertas",
  },
  {
    badge: "✨ NUEVA LLEGADA",
    titulo: "Blusa Premium",
    descuento: "S/ 89",
    subtitulo: "Manga corta · Fluida · Moderna",
    detalle: "Envío gratis a todo el Perú",
    btn: "Comprar Ahora",
  },
  {
    badge: "💎 COLECCIÓN VIP",
    titulo: "Conjuntos desde",
    descuento: "S/ 120",
    subtitulo: "Ropa de alta calidad",
    detalle: "Más de 34 colores disponibles",
    btn: "Ver Colección",
  },
];

// ── COMPONENTE SLIDER HERO ──
function HeroSlider() {
  const [actual, setActual] = useState(0);

  // ✅ Cambia de slide automáticamente cada 3.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActual(prev => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[actual];

  return (
    <div className="hero-slider">
      <div className="hs-contenido" key={actual}>
        <span className="hs-badge">{slide.badge}</span>
        <h1 className="hs-titulo">
          {slide.titulo} <span className="hs-descuento">{slide.descuento}</span>
        </h1>
        <p className="hs-subtitulo">{slide.subtitulo}</p>
        <p className="hs-detalle">{slide.detalle}</p>
        <a href="/catalogo" className="hs-btn">{slide.btn} →</a>
      </div>
      {/* Puntos de navegación */}
      <div className="hs-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hs-dot ${i === actual ? 'activo' : ''}`}
            onClick={() => setActual(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── COMPONENTE GALERÍA DE VIDEOS ──
function GaleriaVideos({ producto, indiceRespaldo }: { producto: any; indiceRespaldo: number }) {
  const [videoActual, setVideoActual] = useState(0);
  // ✅ Estado para seguir la posición del cursor sobre la imagen
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const lista: string[] = (producto.videos && producto.videos.length > 0)
    ? producto.videos
    : [videosRespaldo[indiceRespaldo]];

  // ✅ Calcula la posición del cursor relativa a la imagen
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }

  return (
    <div className="pd-galeria">

      {/* ✅ Video principal */}
      <video
        key={lista[videoActual]}
        src={lista[videoActual]}
        className="pd-imagen-grande"
        autoPlay muted loop playsInline
      />

      {/* ✅ Columna lateral */}
      <div className="pd-lateral">

        {/* Miniaturas de videos extra */}
        {lista.length > 1 && (
          <div className="pd-videos-thumb">
            {lista.map((v, i) => (
              <video key={i} src={v} muted
                className={`pd-video-mini ${i === videoActual ? 'activo' : ''}`}
                onClick={() => setVideoActual(i)} />
            ))}
          </div>
        )}

        {/* ✅ Imagen thumbnail con zoom que sigue el cursor */}
        <div
          className="pd-imagen-thumb"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{
              transformOrigin: `${pos.x}% ${pos.y}%`,
              transform: hover ? 'scale(2.2)' : 'scale(1)',
            }}
          />
        </div>

      </div>
    </div>
  );
}


// ── COMPONENTE PRINCIPAL HOME ──
export default function Home() {
  // ✅ Carga los primeros 3 productos desde la BD
  const [destacados, setDestacados] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setDestacados(data.slice(0, 3)));
  }, []);

  return (
    <div className="home">

      {/* ── HERO CON VIDEO DE FONDO Y SLIDER ── */}
      <section className="hero">
        <div className="hero-video-wrapper">
          <video className="hero-video" autoPlay loop playsInline muted>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay" />
        </div>
        <HeroSlider />
      </section>

      {/* ── COLECCIÓN DESTACADA ── */}
      <section className="catalogo-home">
        <h2 className="catalogo-titulo">✦ Colección Destacada ✦</h2>

        {destacados.map((producto, i) => (
          <div className="pd-card" key={producto.id}>

            {/* ✅ Galería con soporte de múltiples videos */}
            <GaleriaVideos producto={producto} indiceRespaldo={i} />

            {/* Info del producto */}
            <div className="pd-info">
              <h3>{producto.nombre}</h3>

              {/* Estrellas */}
              <div className="pd-estrellas">
                {'★'.repeat(Number(producto.estrellas))}
                {'☆'.repeat(5 - Number(producto.estrellas))}
                <span> ({Number(producto.resenas).toLocaleString()})</span>
              </div>

              {/* ✅ Precio — muestra tachado + oferta si está activa */}
              <div className="pd-precio">
                {producto.enOferta && producto.precioOferta ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: 16, marginRight: 6 }}>
                      PEN {Number(producto.precio).toFixed(2)}
                    </span>
                    <span>PEN</span> {Number(producto.precioOferta).toFixed(2)}
                    <span style={{ background: "#c0392b", color: "white", borderRadius: 4, padding: "2px 6px", marginLeft: 8, fontSize: 12 }}>
                      -{Math.round((1 - Number(producto.precioOferta) / Number(producto.precio)) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <>
                    <span>PEN</span> {Number(producto.precio).toFixed(2)}
                  </>
                )}
              </div>

              {/* ✅ Solo link al catálogo — sin botón carrito ni envío */}
              <a href="/catalogo" className="pd-otros-colores">Ver más en catálogo</a>
            </div>

          </div>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── BOTÓN FLOTANTE WHATSAPP ── */}
      <a href="https://wa.me/51916044534?text=Hola%2C%20me%20interesa%20un%20producto"
        target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.531 5.858L.036 23.428a.5.5 0 0 0 .619.608l5.741-1.657A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.51-5.198-1.4l-.374-.217-3.872 1.117 1.01-3.774-.232-.384A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

    </div>
  );
}