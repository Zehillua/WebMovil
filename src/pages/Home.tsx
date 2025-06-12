import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  return (
    <div className="home-container">
      <div className="home-inner">
        <header className="home-header">
          <div className="home-text">
            <h1>Bienvenido a la Plataforma Vecinal</h1>
            <p>Conecta con tu comunidad. Compra, vende, reparte y gestiona desde un solo lugar.</p>
            {!isAuthenticated && (
              <div className="home-buttons">
                <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                <button onClick={() => navigate('/register')}>Registrarse</button>
              </div>
            )}
          </div>
          <img
            src="https://img.freepik.com/free-photo/happy-african-american-woman-office_53876-137857.jpg"
            alt="Bienvenida"
          />
        </header>

        {/* Mostrar el resto solo si está autenticado */}
        {isAuthenticated && (
          <>
            <section className="home-categories">
              <div className="section-box">
                <h2>¿Qué quieres hacer?</h2>
                <div className="category-grid">
                  <div className="category-card">🛒 Comprar Productos</div>
                  <div className="category-card">🏪 Vender como Locatario</div>
                  <div className="category-card">🚴 Repartir Pedidos</div>
                  <div className="category-card">📊 Ver Gestión Vecinal</div>
                </div>
              </div>
            </section>

            <section className="home-info">
              <div className="section-box">
                <h2>¿Por qué usar esta plataforma?</h2>
                <div className="info-cards">
                  <div className="info-card">
                    <h3>Impulsa el comercio local</h3>
                    <p>Da visibilidad a las tiendas pequeñas de tu vecindario y equilibra las oportunidades de venta.</p>
                  </div>
                  <div className="info-card">
                    <h3>Fácil y seguro</h3>
                    <p>Compra y vende sin complicaciones, con métodos de pago confiables y soporte vecinal.</p>
                  </div>
                  <div className="info-card">
                    <h3>Logística conectada</h3>
                    <p>Repartidores en tiempo real para que tus pedidos lleguen rápido y sin problemas.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;