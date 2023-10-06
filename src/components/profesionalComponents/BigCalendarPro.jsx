import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import clientAxios from '../../config/axios';
import proAuth from "../../hooks/proAuth"
import dayjs from 'dayjs'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import { Link } from 'react-router-dom';
const locales = {
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
const messages = {
  today: 'Hoy',
  previous: 'Anterior',
  next: 'Siguiente',
  day: 'Día',
  month: 'Mes',
  week: 'Semana',
  date:'Fecha',
  time:'Hora',
  event:'Evento',
}

const BigCalendarPro = () => {

  const { authpro} =  proAuth()
  const [consultas, setConsultas] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null);


  useEffect(() => {
    const obtenerMotivosConsulta = async() =>{
      try {
        const tokenPro = localStorage.getItem('tokenPro')
        if(!tokenPro) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
        }
        }
        const { data } = await clientAxios.get('/profesional/obtener-consultas-calendario',config)
        setConsultas(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerMotivosConsulta()      
  },[])



    const consultasPendientes = consultas.filter(con => con.profesional._id === authpro._id && con.estado === 'pagado').map(consulta => {
      
      const [hours, minutes] = consulta.horarioinicio.split(":");
      const start = dayjs.utc(consulta.fecha).tz("America/Santiago").toDate();
      start.setHours(hours);
      start.setMinutes(minutes);
        
      const [hours2, minutes2] = consulta.horariofin.split(":");
      const end = dayjs.utc(consulta.fecha).tz("America/Santiago").toDate();
      end.setHours(hours2);
      end.setMinutes(minutes2);
      
      return {
        ...consulta,
        start,
        end
      };
    });
  const formatconsultas = () => {
    return consultasPendientes.map(consulta => {
        const fecha = dayjs(consulta.fecha);
        const start = fecha.set('hour', consulta.horarioinicio.split(':')[0]).set('minute', consulta.horarioinicio.split(':')[1]).toDate();
        const end = fecha.set('hour', consulta.horariofin.split(':')[0]).set('minute', consulta.horariofin.split(':')[1]).toDate();
      return {
        title: ` Consulta con el Paciente: ${consulta.paciente.nombres} ${consulta.paciente.apellidos} (${consulta.motivoconsulta.titulo})`,
        start,
        id:` ${consulta._id} `,
        end   };
    });
};




const consultasFormateadas = formatconsultas(consultasPendientes);

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    if (event.title.includes('Consulta')) {
      backgroundColor = '#cfb1ff'
     

    } 
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const handleSelectEvent = (event) => {
    if (event.title.includes('Consulta')) {
      const selectedConsulta = consultasPendientes.find(consulta => event.id.includes(consulta._id));
      setSelectedEvent(selectedConsulta);
      setShowModal(true);
    }
  };
  const closeModal = () => {
    setSelectedEvent(null); // Desmarca el evento seleccionado al cerrar el modal
    setShowModal(false); // Oculta el modal al cerrarlo
  };
  
    return (
     
          
      <div className='py-10 px-2'>
        <h1 className='text-center font-bold text-5xl text-lila-300 py-2 '>Tu calendario de consultas</h1>
<Calendar
  culture="es"
  localizer={localizer}
  events={consultasFormateadas}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 800 }}
  onSelectEvent={handleSelectEvent}
  eventPropGetter={eventStyleGetter}
  views={['month','week', 'day', 'agenda']}
  messages={messages} 
/>

{showModal && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <button
          type="button"
          className="absolute top-0 right-0 m-4 bg-gray-300  rounded-full py-1 px-1 focus:outline-none"
          onClick={closeModal}
        >
         ❌
        </button>
        <div className="bg-white px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Detalles de la consulta</h3>
          <p className="mt-2 text-sm text-gray-500">Rut: {selectedEvent.paciente.rut}</p>
          <p className="mt-2 text-sm text-gray-500">Nombre paciente: {selectedEvent.paciente.nombres} {selectedEvent.paciente.apellidos}</p>
          <p className="mt-2 text-sm text-gray-500">Fecha de la consulta: {dayjs(selectedEvent.fecha).utc().format('DD/MM/YYYY')}</p>
          <p className="mt-2 text-sm text-gray-500">Hora de inicio: {selectedEvent.horarioinicio} - Hora de fin: {selectedEvent.horariofin}</p>
          <p className="mt-2 text-sm text-gray-500">Motivo: {selectedEvent.motivoconsulta.titulo}</p>
          <p className="mt-2 text-sm text-gray-500">Descripción del Motivo: {selectedEvent.motivoconsulta.titulo}</p>
          <p className="mt-2 text-sm text-gray-500">Estado de la consulta: {selectedEvent.estado}</p>
          <div className='flex justify-center mt-2'> 
          <Link  to={`/profesional/consulta/${selectedEvent._id}`}  className='rounded-lg bg-lila-200 hover:bg-lila-100 text-white px-2 py-2'>Ingresar</Link>
          </div>
          
        </div>
      </div>
    </div>
  </div>
)}
    </div>

    );
  };
  

export default BigCalendarPro;
