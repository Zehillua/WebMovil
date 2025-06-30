import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { VALORAR_PEDIDO_REALIZADO } from '../apollo/queries';
import './ValoracionModal.css';

interface ValoracionModalProps {
  pedido: {
    _id: string;
    nombrePedido: string;
    datosLocal: {
      nombreLocal: string;
    };
    datosRepartidor: {
      nombreUsuario: string;
      vehiculo: string;
    };
    esDelivery: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ValoracionModal: React.FC<ValoracionModalProps> = ({
  pedido,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [valoracionPedido, setValoracionPedido] = useState<number>(0);
  const [valoracionDelivery, setValoracionDelivery] = useState<number>(0);
  const [valoracionLocal, setValoracionLocal] = useState<number>(0);

  const [valorarPedido, { loading }] = useMutation(VALORAR_PEDIDO_REALIZADO, {
    onCompleted: () => {
      console.log('✅ Valoración guardada exitosamente');
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('❌ Error guardando valoración:', error);
      alert('Error guardando la valoración. Intenta nuevamente.');
    }
  });

  const handleSubmit = async () => {
    if (valoracionPedido === 0 || valoracionLocal === 0 || 
        (pedido.esDelivery && valoracionDelivery === 0)) {
      alert('Por favor completa todas las valoraciones');
      return;
    }

    try {
      await valorarPedido({
        variables: {
          pedidoRealizadoId: pedido._id,
          valoraciones: {
            valoracionPedido,
            valoracionDelivery: pedido.esDelivery ? valoracionDelivery : 5,
            valoracionLocal
          }
        }
      });
    } catch (error) {
      console.error('Error valorando pedido:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="valoracion-modal-overlay">
      <div className="valoracion-modal">
        <div className="valoracion-header">
          <h3>⭐ Valora tu experiencia</h3>
          <button className="valoracion-close" onClick={onClose}>✕</button>
        </div>

        <div className="valoracion-pedido-info">
          <h4>{pedido.nombrePedido}</h4>
          <p>Local: {pedido.datosLocal.nombreLocal}</p>
          {pedido.esDelivery && (
            <p>Repartidor: {pedido.datosRepartidor.nombreUsuario}</p>
          )}
        </div>

        <div className="valoracion-section">
          <h5>🍕 Calidad del pedido</h5>
          <StarRating 
            rating={valoracionPedido} 
            setRating={setValoracionPedido}
          />
        </div>

        <div className="valoracion-section">
          <h5>🏪 Servicio del local</h5>
          <StarRating 
            rating={valoracionLocal} 
            setRating={setValoracionLocal}
          />
        </div>

        {pedido.esDelivery && (
          <div className="valoracion-section">
            <h5>🚗 Servicio de delivery</h5>
            <StarRating 
              rating={valoracionDelivery} 
              setRating={setValoracionDelivery}
            />
          </div>
        )}

        <div className="valoracion-buttons">
          <button 
            className="valoracion-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="valoracion-submit" 
            onClick={handleSubmit}
            disabled={loading || valoracionPedido === 0 || valoracionLocal === 0 || (pedido.esDelivery && valoracionDelivery === 0)}
          >
            {loading ? 'Guardando...' : 'Enviar valoración'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ COMPONENTE DE ESTRELLAS INTERACTIVAS (CORREGIDO):
interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleMouseMove = (starIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    
    // Determinar si es media estrella o estrella completa
    const newRating = percentage <= 0.5 ? starIndex - 0.5 : starIndex;
    setHoverRating(newRating);
  };

  const handleClick = (starIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    
    // Determinar si es media estrella o estrella completa
    const newRating = percentage <= 0.5 ? starIndex - 0.5 : starIndex;
    setRating(newRating);
  };

  const renderStar = (starIndex: number) => {
    const currentRating = hoverRating || rating;
    const isFull = currentRating >= starIndex;
    const isHalf = currentRating >= starIndex - 0.5 && currentRating < starIndex;

    return (
      <div
        key={starIndex}
        className="star-container"
        onMouseMove={(e) => handleMouseMove(starIndex, e)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={(e) => handleClick(starIndex, e)}
      >
        {isHalf ? (
          <span className="star star-half">★</span>
        ) : isFull ? (
          <span className="star star-full">★</span>
        ) : (
          <span className="star star-empty">☆</span>
        )}
      </div>
    );
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(renderStar)}
      <span className="rating-text">
        {rating > 0 ? `${rating.toFixed(1)} de 5` : 'Sin calificar'}
      </span>
    </div>
  );
};

export default ValoracionModal;