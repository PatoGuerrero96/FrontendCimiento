import { useState } from 'react';
import FormularioNotificacionesSinleer from '../../components/pacienteComponents/FormularioNotificacionesinleer';
import FormularioNotTodas from '../../components/pacienteComponents/FormularioNotTodas';
const NotificacionesConsulta = () => {
  const [showFormularioSinLeer, setShowFormularioSinLeer] = useState(true);
  const [showFormularioLeidas, setShowFormularioLeidas] = useState(false);

  const handleShowFormularioSinLeer = () => {
    setShowFormularioSinLeer(true);
    setShowFormularioLeidas(false);
  };

  const handleShowFormularioLeidas = () => {
    setShowFormularioLeidas(true);
    setShowFormularioSinLeer(false);
  };

  return (
    <>
<div className="px-4 py-2 w-full md:px-10 lg:px-20">
  <div className="px-4 py-2 w-full  rounded-lg">
    <h1 className="text-3xl text-gray-800 lg:pl-32">Notificaciones</h1>
    <div className="  flex flex-col md:flex-row md:justify-start items-center mt-4 ">
      <button onClick={handleShowFormularioSinLeer} className="px-4 py-2 text-xs bg-blue-500 text-white rounded-lg mb-2 md:mb-0 md:mr-2">No leídas</button>
      <button onClick={handleShowFormularioLeidas} className="px-4 py-2 text-xs bg-blue-500 text-white rounded-lg md:ml-2">Todas</button>
    </div>
    {showFormularioSinLeer && <FormularioNotificacionesSinleer />}
    {showFormularioLeidas && <FormularioNotTodas />}
  </div>
</div>

    </>
  );
};

export default NotificacionesConsulta;
