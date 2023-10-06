import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // importa la localización en español
import clientAxios from '../../config/axios';
import useAuth from "../../hooks/useAuth"
import moment from 'moment'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Horarios= () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { auth} =  useAuth()
  const [showModal, setShowModal] = useState(false); 
  const [consultas, setConsultas] = useState([]);
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
  }, []);
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
      await clientAxios.delete(`/pacientes/borrar-horario/${id}`,config);
      setEventos(eventos.filter((evento) => evento.id !== id)); 

    } catch (error) {
      console.log(error);
    }
  }
  };
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      start: new Date(prevEvent.start.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())),
      end: new Date(prevEvent.end.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())),
    }));
  };
  const handleHorarioInicioChange = (e) => {
    const newHorarioInicio = e.target.value;
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      start: new Date(prevEvent.start.setHours(newHorarioInicio.split(':')[0], newHorarioInicio.split(':')[1])),
    }));
  };
  
  const handleHorarioFinChange = (e) => {
    const newHorarioFin = e.target.value;
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      end: new Date(prevEvent.end.setHours(newHorarioFin.split(':')[0], newHorarioFin.split(':')[1])),
    }));
  };
  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Establece el evento seleccionado en el estado
    setShowModal(true); // Muestra el modal al seleccionar un evento
  };

  const handleDelete = () => {
    eliminarHorario(selectedEvent.id); // Llama a la función para eliminar el evento seleccionado
    setSelectedEvent(null); // Desmarca el evento seleccionado después de eliminarlo
    setShowModal(false); // Oculta el modal al eliminar el evento
  };
  const closeModal = () => {
    setSelectedEvent(null); // Desmarca el evento seleccionado al cerrar el modal
    setShowModal(false); // Oculta el modal al cerrarlo
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newStartDate = new Date(selectedEvent.start);
    const newEndDate = new Date(selectedEvent.end);
  
    // Obtener las horas y minutos de inicio y fin
    const newStartHours = newStartDate.getHours();
    const newStartMinutes = newStartDate.getMinutes();
    const newEndHours = newEndDate.getHours();
    const newEndMinutes = newEndDate.getMinutes();
  
    const formatTwoDigits = (value) => {
      return value.toString().padStart(2, '0'); // Agregar un cero al inicio si el valor tiene un solo dígito
    };
  
    const data = {
      fecha: selectedEvent.start.toISOString().substring(0, 10), // Obtener la fecha en formato "YYYY-MM-DD"
      horarioinicio: `${formatTwoDigits(newStartHours)}:${formatTwoDigits(newStartMinutes)}`, // Formatear el horario de inicio en formato "HH:mm"
      horariofin: `${formatTwoDigits(newEndHours)}:${formatTwoDigits(newEndMinutes)}`, // Formatear el horario de fin en formato "HH:mm"
    };
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    clientAxios.put(`/pacientes/actualizar-horario-paciente/${selectedEvent.id}`, data, config)
      .then((response) => {
        // Actualizar la lista de eventos para reflejar los cambios
        const updatedEvents = eventos.map(event => {
          if (event.id === selectedEvent.id) {
            return {
              ...event,
              fecha: selectedEvent.start,
              horarioinicio: selectedEvent.start,
              horariofin: selectedEvent.end
            };
          } else {
            return event;
          }
        });
        setEventos(updatedEvents);
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
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
        title: ` Consulta con el Profesional: ${consulta.profesional.nombres} ${consulta.profesional.apellidos} (${consulta.profesional.especialidad})`,
        start,
        end,
      };
    });
};

const formatEventos = (eventos) => {
  return eventos.map((evento) => {
    const start = dayjs.utc(evento.fecha).toDate();
    const end = dayjs.utc(evento.fecha).toDate();

    const [hours, minutes] = evento.horarioinicio.split(":");
    start.setUTCHours(hours);
    start.setUTCMinutes(minutes);

    const [hours2, minutes2] = evento.horariofin.split(":");
    end.setUTCHours(hours2);
    end.setUTCMinutes(minutes2);

    const startLocal = dayjs(start).tz("America/Santiago").toDate();
    const endLocal = dayjs(end).tz("America/Santiago").toDate();

    return {
      title: `Horario disponible ${evento.horarioinicio}-${evento.horariofin}`,
      start: startLocal,
      end: endLocal,
      id: evento._id,
    };
  });
};

  const eventosFormateados = formatEventos(eventos);
const consultasFormateadas = formatconsultas(consultasPendientes);
const eventosCombinados = eventosFormateados.concat(consultasFormateadas);
    return (
     
      <div>
      <Calendar
        culture='es'
        localizer={localizer}
        events={eventosCombinados}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable={true}
        onSelectEvent={handleSelectEvent}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
  <div className="flex items-center justify-center min-h-screen">
    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
    <div className="z-20 relative w-96 max-w-full mx-auto rounded-lg shadow-lg overflow-hidden">
      <div className="bg-white p-6">
      <form onSubmit={handleSubmit}>
      <label htmlFor="fecha">Fecha:</label>
<input
  type="date"
  id="fecha"
  name="fecha"
  value={selectedEvent.start.toISOString().substring(0, 10)} // Cargar la fecha del evento seleccionado
  onChange={handleDateChange}
/>

  <label htmlFor="horarioInicio">Horario de inicio:</label>
<input
  type="time"
  id="horarioInicio"
  name="horarioinicio"
  value={selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // Cargar el horario de inicio del evento seleccionado
  onChange={handleHorarioInicioChange}
/>

<label htmlFor="horarioFin">Horario de fin:</label>
<input
  type="time"
  id="horarioFin"
  name="horariofin"
  value={selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // Cargar el horario de fin del evento seleccionado
  onChange={handleHorarioFinChange}
/>

  <button
        className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        type="submit"
      >
        Guardar
      </button>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded mr-2"
        onClick={handleDelete}
      >
        Eliminar
      </button>
      <button
        className="bg-gray-500 text-white py-2 px-4 rounded"
        onClick={closeModal}
      >
        Cerrar
      </button>
</form>
      </div>
    </div>
  </div>
</div>
      )}
    </div>

    );
  };
  
  export default Horarios;