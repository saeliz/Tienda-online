import { useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./assets/Styles/Todo.css";

interface MenuSection {
  title: string;
  items: { label: string; hasArrow?: boolean; href?: string }[];
}

const menuSections: MenuSection[] = [
  {
    title: "Elegant Clothes",
    items: [
      { label: "Ropa para damas",      hasArrow: true, href: "/catalogo?categoria=damas" },
      { label: "Ropa para caballeros", hasArrow: true, href: "/catalogo?categoria=caballeros" },
      { label: "Ropa para niñas",      hasArrow: true, href: "/catalogo?categoria=niñas" },
      { label: "Ropa para niños",      hasArrow: true, href: "/catalogo?categoria=niños" },
    ],
  },
  {
    title: "Elegant Shoes",
    items: [
      { label: "Calzados para damas",      hasArrow: true, href: "/catalogo?categoria=calzado-damas" },
      { label: "Calzados para caballeros", hasArrow: true, href: "/catalogo?categoria=calzado-caballeros" },
      { label: "Calzados para niñas",      hasArrow: true, href: "/catalogo?categoria=calzado-niñas" },
      { label: "Calzados para niños",      hasArrow: true, href: "/catalogo?categoria=calzado-niños" },
    ],
  },
  {
    title: "Other Products",
    items: [
      { label: "Tarjetas de Regalo", hasArrow: true },
      { label: "Libros",             hasArrow: false },
      { label: "A Live",             hasArrow: true },
      { label: "Tienda internacional", hasArrow: true },
      { label: "Ver todo",           hasArrow: false },
    ],
  },
  {
    title: "Ayuda y configuración",
    items: [
      { label: "Tu Cuenta",        hasArrow: false },
      { label: "Español",          hasArrow: false },
      { label: "Peru",             hasArrow: false },
      { label: "Servicio al Cliente", hasArrow: false },
      { label: "Identifícate",     hasArrow: false },
    ],
  },
];

interface TodoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Todo({ isOpen, onClose }: TodoProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // ✅ ESENCIAL: permite navegar a rutas con parámetros (?categoria=damas, etc.)
  const navigate = useNavigate();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay oscuro */}
      <div className={`todo-overlay ${isOpen ? "todo-overlay--visible" : ""}`} onClick={onClose} />

      {/* Panel lateral */}
      <aside ref={sidebarRef} className={`todo-sidebar ${isOpen ? "todo-sidebar--open" : ""}`}>
        {/* Header */}
        <div className="todo-header">
          <div className="todo-header__user">
            <span className="todo-header__icon">👤</span>
            <span className="todo-header__title">Hola, Identifícate</span>
          </div>
          <button className="todo-close-btn" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        {/* Scroll content */}
        <div className="todo-content">
          {menuSections.map((section) => (
            <div key={section.title} className="todo-section">
              <h3 className="todo-section__title">{section.title}</h3>
              <ul className="todo-section__list">
                {section.items.map((item) => (
                  <li key={item.label} className="todo-item">

                    {/* ✅ ESENCIAL: onClick navega a la ruta del item si tiene href
                        - navigate(item.href) → va a /catalogo?categoria=damas (por ejemplo)
                        - onClose()           → cierra el panel lateral automáticamente  */}
                    <button
                      className="todo-item__btn"
                      onClick={() => {
                        if (item.href) {
                          navigate(item.href);
                          onClose();
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      {item.hasArrow && <span className="todo-item__arrow">›</span>}
                    </button>

                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}