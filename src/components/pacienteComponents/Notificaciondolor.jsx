import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../hooks/useAuth";
import { Link } from 'react-router-dom';

const NotificacionDolor = () => {
  const { auth } = useAuth();
  const mostrarNotificacionInicial = localStorage.getItem('notificacionInicio') !== 'false';
  const [mostrarNotificacion, setMostrarNotificacion] = useState(mostrarNotificacionInicial);

  const handleDismiss = () => {
    setMostrarNotificacion(false);
    localStorage.setItem('notificacionInicio', 'false');
  };
  const notificacionInicio = localStorage.getItem('notificacionInicio');
  if (!notificacionInicio) {
    localStorage.setItem('notificacionInicio', 'true');
  }
  const showNotification = () => {
    
    const notificationId = toast.success(
      (t) => (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium mr-4">
              Crea aquí tu motivo de consulta
            </div>
            <Link to="/paciente/consultas" className="text-white bg-lila-200 px-1.5 py-1.5 hover:bg-lila-100 text-sm rounded-xl uppercase focus:outline-none">
              Ingresar
            </Link>
            <button
              className="text-red-500 hover:text-gray-800 focus:outline-none ml-4"
              onClick={() => {
                toast.dismiss(notificationId);
              }}
            >
              ✕
            </button>
          </div>
          {mostrarNotificacion && (
            <button
              className="text-white bg-gray-400 hover:bg-gray-300 px-1 py-0.5 text-[10px] rounded-lg  focus:outline-none"
              onClick={handleDismiss}
            >
              No volver a mostrar
            </button>
          )}
        </div>
      ),
      {
        duration: 7000,
        position: 'top-right',
        style: {
          minWidth: '250px',
        },
      }
    );
  };

  useEffect(() => {
    if (mostrarNotificacionInicial || auth.historiaclinica?.dolor === "Si" || auth.historiaclinica?.drogas==="Si") {
      const notificationInterval = setInterval(showNotification, 60 * 1000); // Cada 1 minuto
      return () => clearInterval(notificationInterval);
    }
  }, [mostrarNotificacionInicial, auth.historiaclinica?.dolor]);

  return (
  <>
    {mostrarNotificacionInicial && (auth.historiaclinica?.dolor === "Si" || auth.historiaclinica?.drogas === "Si") && <Toaster />}
  </>
);
};

export default NotificacionDolor;
