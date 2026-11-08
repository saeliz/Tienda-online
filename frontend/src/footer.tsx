{/* esta es la parte del footer pero abjo los derechos reservados*/}
import "./assets/Styles/footer.css";

export default function Footer() {
  return (
    <>
      {/* BENEFICIOS */}
      <section className="beneficios">
        <div className="beneficios-container">
          <div className="beneficio-item">📱 Compra por WhatsApp</div>
          <div className="beneficio-item">🔄 Cambios y devoluciones</div>
          <div className="beneficio-item">🔒 Compra 100% segura</div>
          <div className="beneficio-item">📍 Tiendas cerca de ti</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3>Empresa</h3>
            <p>Nuestra empresa</p>
            <p>Blog</p>
            <p>Tiendas</p>
          </div>

          <div className="footer-col">
            <h3>Servicio</h3>
            <p>Preguntas frecuentes</p>
            <p>Guía de compras</p>
            <p>Pagos</p>
            <p>Devoluciones</p>
          </div>

          <div className="footer-col">
            <h3>Legales</h3>
            <p>Términos</p>
            <p>Privacidad</p>
          </div>

          <div className="footer-col">
            <h3>Contacto</h3>
            <p>+51 916-044-534</p>
            <p>lizanahlizana@gmail.com</p>
            <p>Lun - Vie 9am - 6pm</p>
          </div>
        </div>

        {/* QR WHATSAPP  EJEmplo
        <div className="footer-col footer-qr">
    <h3>Escanea y compra</h3>
    <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/521234567890"
        alt="QR WhatsApp"
        className="qr-imagen"
    />
    <p className="qr-texto">📧 Escanea para escribirnos por WhatsApp</p>
</div> */}
    
        <div className="footer-bottom">
          © 2026 TIENDA ONLINE — TODOS LOS DERECHOS RESERVADOS
        </div>
      </footer>
    </>
  );
}