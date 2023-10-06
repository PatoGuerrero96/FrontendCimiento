import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import clientAxios from '../../config/axios';
import useAuth from "../../hooks/useAuth"
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
  event:'Evento'
}
const BigCalendar = () => {
  const [eventos, setEventos] = useState([]);
  const [fecha, setFecha] = useState("")
  const [horarioinicio, setHorarioInicio ] = useState("")
  const [horariofin, setHorarioFin] = useState("")
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { auth} =  useAuth()
  const [showModal, setShowModal] = useState(false); 
  const [showModalConsulta, setShowModalConsulta] = useState(false);
  const [showModalControl, setShowModalControl] = useState(false); 
  const [consultas, setConsultas] = useState([]);
  const [controles, setControles] = useState([]);
  const obtenerEventos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await clientAxios.get('/pacientes/ver-MiHorario', config);
      setEventos(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const obtenerControles = async() =>{
      try {
        const token = localStorage.getItem('token')
        if(!token) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }
        const { data } = await clientAxios.get(`/pacientes/ver-controles-paciente/${auth._id}`,config)
        setControles(data)

      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerControles()      
  },[])
  useEffect(() => {
    const obtenerMotivosConsulta = async() =>{
      try {
        const token = localStorage.getItem('token')
        if(!token) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }
        const { data } = await clientAxios.get('/pacientes/obtener-consultas',config)
        setConsultas(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerMotivosConsulta()      
  },[])

  useEffect(() => {
    obtenerEventos();
  }, [eventos]);
  const eliminarHorario = async (id) => {
    const confirmar = await Swal.fire({
      title: '¿Estás seguro de eliminar tu horario disponible?',
      text: "!No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9ba4ea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!'
      }).then((result) => {
      if (result.isConfirmed) {
          return true;
      } else {
          return false;
      }
  })
  if(confirmar) {
    try {
      const token = localStorage.getItem('token')
      if(!token) return
  
      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      await clientAxios.delete(`/pacientes/borrar-horario/${selectedEvent.id}`,config);
      setEventos(eventos.filter((evento) => evento.id !== id)); 
      setShowModal(false)

    } catch (error) {
      console.log(error);
    }
  }
  };

    const consultasPendientes = consultas.filter(con => con.paciente === auth._id && con.estado === 'pagado').map(consulta => {
      
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
        title: ` Consulta con el Profesional: ${consulta.profesional.nombres} ${consulta.profesional.apellidos} (${consulta.profesional.especialidad}) Motivo:(${consulta.motivoconsulta.titulo})`,
        start,
        end,
        id:` ${consulta._id} `,
        isHorario: false
      };
    });
};

const formatEventos = (eventos) => {
  return eventos.map((evento) => {
    const start = dayjs.utc(evento.fecha).utcOffset(0).toDate(); // Asegúrate de aplicar el desplazamiento horario adecuado
    const end = dayjs.utc(evento.fecha).utcOffset(0).toDate(); // Asegúrate de aplicar el desplazamiento horario adecuado

    const [hours, minutes] = evento.horarioinicio.split(":");
    start.setUTCHours(hours);
    start.setUTCMinutes(minutes);

    const [hours2, minutes2] = evento.horariofin.split(":");
    end.setUTCHours(hours2);
    end.setUTCMinutes(minutes2);

    return {
      title: `Horario disponible ${evento.horarioinicio}-${evento.horariofin}`,
      start,
      end,
      id: evento._id,
      isHorario: true 
    };
  });
};

const formatControles = () => {
  return controles.map((control) => {
    const fecha = dayjs(control.fecha).tz("America/Santiago").toDate();

    // Establece la hora de inicio y fin en la fecha correspondiente
    fecha.setHours(0);
    fecha.setMinutes(0);

    return {
      title: `Indicación de Control para el motivo de consulta: ${control.motivoconsulta.titulo}`,
      start: fecha,
      end: fecha,
      id: control._id,
      isHorario: false
    };
  });
};


const handleSelectEvent = (event) => {
  if (event.title.includes('Horario')) {
    setSelectedEvent(event);
    // Obtener la fecha, hora de inicio y hora de fin del evento
    const fecha = event.start.toISOString().substring(0, 10);

    const horaInicio = event.start.getHours() + 4; // Sumar 4 horas a la hora de inicio
    const minutosInicio = event.start.getMinutes();
    const horaFin = event.end.getHours() + 4; // Sumar 4 horas a la hora de fin
    const minutosFin = event.end.getMinutes();

    setFecha(fecha);
    setHorarioInicio(`${horaInicio}:${minutosInicio}`);
    setHorarioFin(`${horaFin}:${minutosFin}`);
    setShowModal(true);
  }
  if (event.title.includes('Consulta')) {
    const selectedConsulta = consultasPendientes.find(consulta => event.id.includes(consulta._id));
    setSelectedEvent(selectedConsulta);
    setShowModalConsulta(true);
  }
  if (event.title.includes('Control')) {
    const selectedControl = controles.find(control => event.id.includes(control._id));
    setSelectedEvent(selectedControl);
    setShowModalControl(true);
  }

};
  const closeModal = () => {
    setSelectedEvent(null); // Desmarca el evento seleccionado al cerrar el modal
    setShowModal(false); // Oculta el modal al cerrarlo
  };
  const closeModalConsulta = () => {
    setSelectedEvent(null); 
    setShowModalConsulta(false);
  };
    const closeModalControl = () => {
    setSelectedEvent(null); 
    setShowModalControl(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fecha || !horarioinicio || !horariofin) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos deben ser completados',
      });
      return;
    }
    // Convertir la fecha y hora a hora de Chile sin desplazamiento de zona horaria
    const fechaSantiago = moment.tz(fecha, 'YYYY-MM-DD', 'America/Santiago').toISOString();
    const data = {
      fecha: fechaSantiago,
      horarioinicio: horarioinicio,
      horariofin: horariofin
    };
  
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
  
    clientAxios
      .put(`/pacientes/actualizar-horario-paciente/${selectedEvent.id}`, data, config)
      .then((response) => {
        // Actualizar la lista de eventos para reflejar los cambios
        const updatedEvents = eventos.map((event) => {
          if (event.id === selectedEvent.id) {
            return {
              ...event,
              fecha: fecha,
              horarioinicio: horarioinicio,
              horariofin: horariofin
            };
          } else {
            return event;
          }
        });
        setEventos(updatedEvents);
        obtenerEventos();
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleEliminarHorario = async (id) => {
    
   await eliminarHorario(id);
    obtenerEventos();
  };
  const eventosFormateados = formatEventos(eventos);
const consultasFormateadas = formatconsultas(consultasPendientes);
const controlesFormateados = formatControles();
const eventosCombinados = eventosFormateados.concat(consultasFormateadas, controlesFormateados);

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    if (event.title.includes('Horario disponible')) {
      backgroundColor = '#9ecb90'
     

    } else {
      backgroundColor = '#cfb1ff'; 
    }
    if (event.title.includes('Control')) {
      backgroundColor = '#86c6e9'
     
    } 

    return {
      style: {
        backgroundColor,
      },
    };
  };
    return (
     
          
      <div>
       <h1 className='text-center font-bold text-4xl text-lila-300 py-2 '>Tu calendario de consultas y horarios disponibles</h1>
<Calendar
  culture="es"
  localizer={localizer}
  events={eventosCombinados}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 600 }}
  eventPropGetter={eventStyleGetter}
  onSelectEvent={handleSelectEvent}
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
          <form onSubmit={handleSubmit}>
            <label htmlFor="fecha" className="block text-gray-700 font-bold mb-2">
              Fecha:
            </label>
            <input className=' rounded-md border' type="date" id="fecha" name="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <label htmlFor="horaInicio" className="block text-gray-700 font-bold mb-2">
              Hora de inicio:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="horaInicio"
              type="time"
              value={horarioinicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
            />
            <br />
            <label htmlFor="horaFin" className="block text-gray-700 font-bold mb-2">
              Hora de fin:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="horaFin"
              type="time"
              value={horariofin}
              onChange={(e) => setHorarioFin(e.target.value)}
            />
            <div className="flex justify-center mt-4">
              <input
                type="submit"
                value="Editar horario"
                className="px-4 py-2 text-white font-medium rounded-md shadow-xl hover:bg-lila-100 bg-lila-200"
              />
            </div>
          </form>
          <hr className="my-6" />
          <div className="flex justify-end">
            <button
              className="ml-4 bg-coral-300 hover:bg-coral-200 text-white px-4 py-2 rounded-lg"
              title="borrar"
              onClick={() => handleEliminarHorario()}
            >
              Eliminar este horario
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{showModalConsulta && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <button
          type="button"
          className="absolute top-0 right-0 m-4 bg-gray-300  rounded-full py-1 px-1 focus:outline-none"
          onClick={closeModalConsulta}
        >
         ❌
        </button>
        <div className="bg-white px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Detalles de la consulta</h3>
          <p className="mt-2 text-sm text-gray-500">Rut: {selectedEvent.profesional.rut}</p>
          <p className="mt-2 text-sm text-gray-500">Nombre profesional: {selectedEvent.profesional.nombres} {selectedEvent.profesional.apellidos}</p>
          <p className="mt-2 text-sm text-gray-500">Fecha de la consulta: {dayjs(selectedEvent.fecha).utc().format('DD/MM/YYYY')}</p>
          <p className="mt-2 text-sm text-gray-500">Hora de inicio: {selectedEvent.horarioinicio} - Hora de fin: {selectedEvent.horariofin}</p>
          <p className="mt-2 text-sm text-gray-500">Motivo: {selectedEvent.motivoconsulta.titulo}</p>
          <p className="mt-2 text-sm text-gray-500">Descripción del Motivo: {selectedEvent.motivoconsulta.titulo}</p>
          <p className="mt-2 text-sm text-gray-500">Estado de la consulta: {selectedEvent.estado}</p>
          <div className='flex justify-center mt-2'> 
          <Link  to={`/paciente/vermas-consulta-aprobada/${selectedEvent._id}`}  className='rounded-lg bg-lila-200 hover:bg-lila-100 text-white px-2 py-2'>Ingresar</Link>
          </div>
          
        </div>
      </div>
    </div>
  </div>
)}


{showModalControl && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <button
          type="button"
          className="absolute top-0 right-0 m-4 bg-gray-300  rounded-full py-1 px-1 focus:outline-none"
          onClick={closeModalControl}
        >
         ❌
        </button>
        <div className="bg-white px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Indicaciones de control</h3>
          <p className="mt-2 text-sm text-gray-500">Fecha: {selectedEvent.fecha}</p>
          <p className="mt-2 text-sm text-gray-500">Motivo del control: {selectedEvent.descripcion}</p>
          <hr />
          <p className="mt-2 text-sm text-gray-500">Asignado por el profesional: {selectedEvent.profesional.nombres} {selectedEvent.profesional.apellidos}</p>
          <p className="mt-2 text-sm text-gray-500">Motivo de consulta: {selectedEvent.motivoconsulta.titulo} </p>


          
        </div>
      </div>
    </div>
  </div>
)}
    </div>

    );
  };
  

export default BigCalendar;
