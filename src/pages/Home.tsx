// Home.tsx (Versión Modificada para nueva estructura)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Home.css'; // Asegúrate de que esta ruta sea correcta

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  return (
    <div className="home-container">
      {/* Banner superior - Tomado del diseño del Archivo 2 */}
      <div className="top-banner">
        <span className="top-banner-text">
          Bienvenido a VeciMarket
        </span>
      </div>

      {/* NUEVO CONTENEDOR PARA EL TÍTULO Y SUBTÍTULOS */}
      <div className="header-title-card"> {/* Nueva clase aquí */}
        <h1 className="main-header-title">VeciMarket</h1>
        <p className="main-header-subtitle">Tu mercado vecinal online.</p>
        <p className="main-header-subtitle">Compra local, apoya a tu comunidad.</p>
      </div>

      {/* Los botones de Iniciar Sesión/Registrarse del Archivo 1, pero estilizados con el diseño del Archivo 2 si no está autenticado */}
      {!isAuthenticated && (
        <div className="main-header-buttons-grid"> {/* Unificamos la idea de card-grid aquí para no autenticados */}
          <div className="home-card-auth"> {/* Nueva clase para las tarjetas de autenticación */}
            <h2>¿Ya tienes cuenta?</h2>
            <p>Accede a tu perfil y continúa explorando.</p>
            <button onClick={() => navigate('/login')} className="card-button">Iniciar Sesión</button>
          </div>
          <div className="home-card-auth">
            <h2>¿Eres nuevo?</h2>
            <p>Únete a nuestra comunidad y apoya el comercio del barrio.</p>
            <button onClick={() => navigate('/register')} className="card-button">Registrarse</button>
          </div>
        </div>
      )}
      {/* ... (resto del código igual) ... */}
      
      {/* Mostrar las secciones de categorías e información solo si está autenticado - Contenido del Archivo 1 */}
      {isAuthenticated && (
        <>
          <section className="authenticated-section-box"> {/* Nueva clase para las secciones de autenticado */}
            <h2>¿Qué quieres hacer?</h2>
            <div className="authenticated-category-grid"> {/* Nueva clase */}
              <div className="authenticated-category-card">🛒 Comprar Productos</div>
              <div className="authenticated-category-card">🏪 Vender como Locatario</div>
              <div className="authenticated-category-card">🚴 Repartir Pedidos</div>
              <div className="authenticated-category-card">📊 Ver Gestión Vecinal</div>
            </div>
          </section>

          <section className="authenticated-section-box"> {/* Reutilizamos la clase */}
            <h2>¿Por qué usar esta plataforma?</h2>
            <div className="authenticated-info-cards"> {/* Nueva clase */}
              <div className="authenticated-info-card">
                <h3>Impulsa el comercio local</h3>
                <p>Da visibilidad a las tiendas pequeñas de tu vecindario y equilibra las oportunidades de venta.</p>
              </div>
              <div className="authenticated-info-card">
                <h3>Fácil y seguro</h3>
                <p>Compra y vende sin complicaciones, con métodos de pago confiables y soporte vecinal.</p>
              </div>
              <div className="authenticated-info-card">
                <h3>Logística conectada</h3>
                <p>Repartidores en tiempo real para que tus pedidos lleguen rápido y sin problemas.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Sección de información general (para todos los usuarios) - Tomada del Archivo 2 */}
      <div className="general-info-section-card"> {/* Renombrado para no colisionar con .info-card del isAuthenticated */}
        <div className="info-content-wrapper"> {/* Para la flexbox */}
          <div className="general-info-text">
            Esta plataforma conecta a compradores, locatarios y repartidores de un mismo vecindario.
            Nuestro objetivo es digitalizar el comercio de barrio, facilitar el acceso a productos locales,
            mejorar la visibilidad de pequeños emprendedores y fomentar una logística colaborativa.
            <br /><br />
            Todo desde una aplicación simple, cercana y hecha a medida de nuestra comunidad.
          </div>
          <div className="general-info-image-container">
            <img
              src="https://img.freepik.com/vector-gratis/edificio-tiendas-vectores-dibujos-animados-calle-ciudad-vista-rascacielos-urbanos-ilustracion-isometrica-apartamentos-cerca-tranvia-ciudad-nadie-dia-soleado-arquitectura-juegos-retro-papel-tapiz-grafico-2d_107791-22114.jpg"
              alt="Ilustración mercado vecinal"
            />
          </div>
        </div>
      </div>

      {/* Footer - Tomado del Archivo 2 */}
      <div className="home-footer">
        <p className="footer-text">VeciMarket © 2025 · Proyecto universitario para fomentar el comercio local.</p>
      </div>
    </div>
  );
};

export default Home;