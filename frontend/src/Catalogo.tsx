import "./assets/Styles/Catalogo.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function useSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleScroll = () => {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5)
        slider.scrollLeft = slider.scrollWidth / 2;
      if (slider.scrollLeft <= 0)
        slider.scrollLeft = slider.scrollWidth / 2;
    };
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);
  return { sliderRef, scroll };
}

function SliderSeccion({ titulo, productos, onProductoClick }: {
  titulo: string;
  productos: any[];
  onProductoClick: (id: number) => void;
}) {
  const { sliderRef, scroll } = useSlider();
  // ✅ Si hay menos de 2 productos no duplicar
  const doble = productos.length > 0 ? [...productos, ...productos] : [];

  return (
    <>
      <h2 className="titulo">{titulo}</h2>
      <div className="slider-wrapper">
        <button className="nav left" onClick={() => scroll("left")}>‹</button>
        <div className="slider" ref={sliderRef}>
          {doble.map((prod, i) => (
            <div className="slide" key={i}
              onClick={() => onProductoClick(prod.id)}
              style={{ cursor: "pointer" }}>
              <img src={prod.imagen} alt="producto" />
              <span>Promo</span>
            </div>
          ))}
        </div>
        <button className="nav right" onClick={() => scroll("right")}>›</button>
      </div>
    </>
  );
}

export default function Catalogo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria");

  // ✅ Carga productos desde la BD
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const irAProducto = (id: number) => navigate(`/producto/${id}`);

  // ✅ Filtra por categoría si viene en la URL
  const filtrados = categoria
    ? productos.filter(p => p.categoria === categoria)
    : [];

  // ✅ Agrupa por categoría para mostrar las 4 secciones
  const damas      = productos.filter(p => p.categoria === "damas");
  const caballeros = productos.filter(p => p.categoria === "caballeros");
  const ninas      = productos.filter(p => p.categoria === "niñas");
  const ninos      = productos.filter(p => p.categoria === "niños");

  // ✅ Si hay categoría → solo esa sección
  if (categoria) {
    return (
      <div className="catalogo">
        <SliderSeccion
          titulo={`Ropa para ${categoria}`}
          productos={filtrados}
          onProductoClick={irAProducto}
        />
      </div>
    );
  }

  // ✅ Sin categoría → las 4 secciones
  return (
    <div className="catalogo">
      <SliderSeccion titulo="Ropa para Damas"      productos={damas}      onProductoClick={irAProducto} />
      <SliderSeccion titulo="Ropa para Caballeros" productos={caballeros} onProductoClick={irAProducto} />
      <SliderSeccion titulo="Ropa para Niñas"      productos={ninas}      onProductoClick={irAProducto} />
      <SliderSeccion titulo="Ropa para Niños"      productos={ninos}      onProductoClick={irAProducto} />
    </div>
  );
}