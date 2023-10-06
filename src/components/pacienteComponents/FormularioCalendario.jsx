import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import clientAxios from '../../config/axios';
const FormularioCalendario = ({ onClose }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFin, setHorarioFin] = useState('');
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
  const [horarios, setHorarios] = useState({});

  const handleFechaSeleccionada = (date) => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    
    if (date.getTime() >= fechaActual.getTime()) {
      const fechaSeleccionadaIndex = fechasSeleccionadas.findIndex(
        (fecha) => fecha.getTime() === date.getTime()
      );
  
      if (fechaSeleccionadaIndex !== -1) {
        // La fecha ya está seleccionada, así que la eliminamos de la lista
        const nuevasFechasSeleccionadas = [
          ...fechasSeleccionadas.slice(0, fechaSeleccionadaIndex),
          ...fechasSeleccionadas.slice(fechaSeleccionadaIndex + 1)
        ];
        setFechasSeleccionadas(nuevasFechasSeleccionadas);
      } else {
        // La fecha no está seleccionada, así que la agregamos a la lista
        const nuevasFechasSeleccionadas = [...fechasSeleccionadas, date];
        setFechasSeleccionadas(nuevasFechasSeleccionadas);
      }
    } else {
      Swal.fire('¡Error!', 'Por favor, seleccione una fecha igual o posterior a la fecha actual', 'error');
    }
  };

  const handleHorarioInicio = (event) => {
    setHorarioInicio(event.target.value);
  };

  const handleHorarioFin = (event) => {
    setHorarioFin(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (fechasSeleccionadas.length === 0) {
      Swal.fire('¡Error!', 'Por favor, seleccione al menos una fecha', 'error');
      return;
    }
  
    if (Object.keys(horarios).length === 0) {
      Swal.fire('¡Error!', 'Por favor, ingrese un horario de inicio y fin para cada fecha', 'error');
      return;
    }
  
    const horariosGuardar = [];
    for (const fecha of fechasSeleccionadas) {
      const horarioFecha = horarios[fecha.getTime()];
      if (horarioFecha && horarioFecha.horarioInicio && horarioFecha.horarioFin) {
        const horario = {
          fecha: fecha.toISOString(), // Convertir la fecha a formato 'yyyy-MM-dd'
          horarioinicio: horarioFecha.horarioInicio,
          horariofin: horarioFecha.horarioFin,
        };
        horariosGuardar.push(horario);
      }
    }
  
    if (horariosGuardar.length === 0) {
      Swal.fire('¡Error!', 'Por favor, ingrese un horario de inicio y fin para cada fecha', 'error');
      return;
    }
  
    const data = {
      horarios: horariosGuardar,
    };
  
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      const respuesta = await clientAxios.post('/pacientes/agregar-Horario', data, config);
      Swal.fire('¡Listo!', 'Tus horarios fueron guardados', 'success');
    } catch (error) {
      console.log(error);
    }
  
    setMostrarModal(false);
    setHorarios({});
    setFechasSeleccionadas([]);
    setHorarioInicio('');
    setHorarioFin('');
    onClose();
  };
  

  const tileClassName = ({ date }) => {
    const currentDate = new Date();
    const isCurrentDate = date.toDateString() === currentDate.toDateString();
    const isPastDate = date < currentDate;
    const isSelectedDate = fechasSeleccionadas.find((fecha) => fecha.toDateString() === date.toDateString());
  
    if (isSelectedDate) {
      return 'bg-lila-200 text-black rounded-full'; // Estilo para las fechas seleccionadas
    }
  
    if (isCurrentDate) {
      return 'bg-yellow-300'; // Estilo para la fecha actual
    }
  
    if (isPastDate) {
      return 'bg-gray-700 text-white'; // Estilo para las fechas pasadas
    }
  
    return null;
  };
  const handleOpenModal = () => {
    if (fechasSeleccionadas.length > 0) {
      setMostrarModal(true);
    }
  };
  const handleHorarioChange = (fecha, campo, valor) => {
    setHorarios((prevHorarios) => {
      const horariosActualizados = { ...prevHorarios };
      const horarioFecha = horariosActualizados[fecha.getTime()] || {};
      horarioFecha[campo] = valor;
      horariosActualizados[fecha.getTime()] = horarioFecha;
      return horariosActualizados;
    });
  };
    return (
      <>
<div className='flex justify-center'>

  <div className=''>


    <Calendar
          className='p-4 rounded-lg shadow-lg max-w-xl'
          value={fechaSeleccionada}
          onChange={handleFechaSeleccionada}
          tileClassName={tileClassName}
        />
        <div className='flex justify-center'>
{fechasSeleccionadas.length > 0 && (
  <button
    className='px-4 py-2 mt-4 text-white  animate-bounce  bg-lila-200 rounded-md shadow-xl hover:bg-lila-100 focus:outline-none'
    onClick={handleOpenModal}
  >
    Regista tus horarios
  </button>
)}
</div>
        {mostrarModal && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
      <div
        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg leading-6 font-bold underline text-gray-900 mb-4">
              Fechas seleccionadas
            </h3>
            <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3 ">
              {fechasSeleccionadas.map((fecha) => (
                <li key={fecha.getTime()} className="mb-4 ">
                 <p > Fecha: <span className='font-bold'>{fecha.toLocaleDateString()}</span> </p>
   
                  <div>
                    <label className="block text-gray-700 font-regular mb-2" htmlFor="horaInicio">
                      Hora de inicio:
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="horaInicio"
                      type="time"
                      value={horarios[fecha.getTime()]?.horarioInicio || ""}
                      onChange={(e) => handleHorarioChange(fecha, "horarioInicio", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="horaFin" className="block text-gray-700 font-regular mb-2">
                      Hora de fin:
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="horaFin"
                      type="time"
                      value={horarios[fecha.getTime()]?.horarioFin || ""}
                      onChange={(e) => handleHorarioChange(fecha, "horarioFin", e.target.value)}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4 gap-1">
            <input
                type="submit"
                value="Guarda tu horario"
                className="px-2 py-3 text-white font-medium rounded-md shadow-xl hover:bg-lila-100 bg-lila-200"
              />
              <button
                type="button"
                className="px-4 py-2 mr-2 text-white bg-red-500 rounded-md shadow-xl hover:bg-red-600 focus:outline-none focus:bg-red-600"
                onClick={() => setMostrarModal(false)}
              >
                Cerrar
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
  </div>
</div>

    </>
  )
}

export default FormularioCalendario