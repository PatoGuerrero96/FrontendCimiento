import { useParams } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import clientAxios from '../../config/axios';
import { useState, useEffect,useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es'; 
import { AiFillCalendar } from "react-icons/ai";
// habilita los plugins utc y timezone
dayjs.extend(utc);
dayjs.extend(timezone);

// define la zona horaria deseada
dayjs.tz.setDefault('America/Santiago');

const VerMotivo = () => {
  const { id } = useParams();
  const [motivo, setMotivo] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState('Hola, estoy interesado en tomar tu caso a través de Cimiento Clínico');
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState('');
  const [horarioinicio, setHoraInicio] = useState('');
  const [horariofin, setHoraFin] = useState('');
  const navigate = useNavigate()
  const [tarifaId, setTarifaId] = useState('');
  const [tarifaGlobalId, setTarifaGlobal] = useState('');
  const [esTarifaGlobal, setEsTarifaGlobal] = useState(true);
  const[ tarifas, setTarifas]= useState([])
  const[ tarifasglobales, setTarifasglobales]= useState([])
  const datePickerRef = useRef(null);
  const [precio, setPrecio] = useState('');
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null);
  const abrirFormulario = () => {
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
  };
  const fechaActualChile = dayjs().tz('America/Santiago');
 
  useEffect(() => {
    const obtenertarifas = async() =>{
      try {
        const tokenPro = localStorage.getItem('tokenPro')
        if(!tokenPro) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
        }
        }
        const { data } = await clientAxios.get('/profesional/obtener-tarifas',config)
        setTarifas(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenertarifas()
  }, []);
  useEffect(() => {
    const obtenertarifasglobales = async() =>{
      try {
        const tokenPro = localStorage.getItem('tokenPro')
        if(!tokenPro) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
        }
        }
        const { data } = await clientAxios.get('/profesional/obtener-tarifas-global',config)
        setTarifasglobales(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenertarifasglobales()
  }, []);
  function calcularHoraFin(horaInicio) {
    const tarifasArray = esTarifaGlobal ? tarifasglobales : tarifas;
    const tarifaSeleccionada = tarifasArray.find((tari) => tari._id === (esTarifaGlobal ? tarifaGlobalId : tarifaId));
    const tiempoEnMinutos = tarifaSeleccionada.tiempo;
    const fechaInicio = new Date(`2023-04-19T${horaInicio}:00`);
    const fechaFin = new Date(fechaInicio.getTime() + tiempoEnMinutos * 60000);
    const horaFin = fechaFin.toTimeString().slice(0, 5);
    return horaFin;
  }
  const enviarNotificacion = async( ) => {
    try{
      const tokenPro = localStorage.getItem("tokenPro");
      if (!tokenPro) return;

      if (!fecha) {
        Swal.fire('¡Error!', 'Por favor, seleccione una fecha.', 'error');
        return;
      }

      if (!horarioinicio) {
        Swal.fire('¡Error!', 'Por favor, agregue un horario de inicio para la consulta.', 'error');
        return;
      }
      if (!horariofin) {
        Swal.fire('¡Error!', 'Por favor, agrege hora de fin para la consulta.', 'error');
        return;
      }
      if (motivo.horariopaciente && motivo.horariopaciente.length > 0) {
        const horarioInicioSeleccionado = new Date(`2000-01-01T${horarioinicio}`);
        const horarioFinSeleccionado = new Date(`2000-01-01T${horariofin}`);
        const fechaSeleccionada = new Date(fecha);
      const fechaSeleccionadaString = fechaSeleccionada.toISOString().split('T')[0];
  
        const horarioDisponible = motivo.horariopaciente.some(
          (horario) => {
            const fechaHorario = new Date(horario.fecha.split('T')[0]);
            const horarioInicio = new Date(`2000-01-01T${horario.horarioinicio}`);
            const horarioFin = new Date(`2000-01-01T${horario.horariofin}`);
        
            return (
              fechaHorario.getTime() === new Date(fechaSeleccionadaString).getTime() &&
              (horarioInicio <= horarioInicioSeleccionado && horarioFin >= horarioFinSeleccionado) ||
              (horarioInicioSeleccionado <= horarioInicio && horarioFinSeleccionado >= horarioInicio) &&
              (horarioInicioSeleccionado >= horarioInicio && horarioFinSeleccionado <= horarioFin)
            );
            
          }
        );
        if (!horarioDisponible) {
          Swal.fire('¡Error!', 'El horario seleccionado no está disponible.', 'error');
          return;
        }
      }
      if (!precio) {
        Swal.fire('¡Error!', 'Agregue una tarifa para generar la consulta', 'error');
        return;
      }
  
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokenPro}`,
        },
      };

      const resumenDatos = `
      Fecha: ${formatearFecha(fecha)}<br>
      Horario de inicio: ${horarioinicio}<br>
      Horario de fin: ${horariofin}<br>
      Precio: $${parseFloat(precio).toLocaleString('es-CL')}
    `;
    

    const resultado = await Swal.fire({
      title: '¿Quieres enviar esta propuesta de consulta?',
      html: `Resumen de tu propuesta<br><br>${resumenDatos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });
      if (resultado.isConfirmed) {
      const fechaConZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

      const data = new FormData();
      data.append('idMotivoConsulta', motivo._id);
      data.append('idPaciente', motivo.paciente._id);
      data.append('mensaje', mensaje);
      data.append('horarioinicio', horarioinicio);
      data.append('horariofin', horariofin);
      data.append('precio', precio);
      data.append('fecha', fechaConZonaHoraria);
      await clientAxios.post('/profesional/generar-consulta', data, config);

      Swal.fire('¡Listo!', 'La propuesta de consulta fue enviada correctamente.', 'success');
      setMostrarFormulario(false)
      setMensaje('')
      setHoraFin('')
      setHoraInicio('')
      setFecha('')
      setPrecio('')
      onClose()

    }

   
  } catch (error) {
      console.log(error)
    }
  }

  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
  const formatearmesesFecha= (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

  useEffect(() => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };

    const fetchData = async () => {
      try {
        const response = await clientAxios.get(`/profesional/obtener-motivo/${id}`, config);
        setMotivo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  const isDayAvailable = (date) => {
    // Reemplaza "motivo.horariopaciente" con el campo que contiene los horarios disponibles del paciente en tu componente
    return motivo.horariopaciente.some(horario => {
      const fechaHorario = new Date(horario.fecha.split('T')[0]);
      return fechaHorario.toISOString().split('T')[0] === date.toISOString().split('T')[0];
    });
  };
//Mostrar solo dias disponibles
  const datePickerFilter = (date) => {
    return isDayAvailable(date);
  };
  //abrir calendario
  const handleCalendarButtonClick = () => {
    if (datePickerRef.current) {
      if (datePickerRef.current.isCalendarOpen()) {
        datePickerRef.current.setOpen(false);
      } else {
        datePickerRef.current.setOpen(true);
      }
    }
  };
//Cerrar calendario
  const handleCalendarBlur = () => {
    if (datePickerRef.current && datePickerRef.current.isCalendarOpen()) {
      datePickerRef.current.setOpen(false);
    }
  };
  if (!motivo) {
    return <div className='flex justify-center mt-10' role="status">
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>;
  }

  return (
    <div>
    <div className='text-center bg-coral-100 py-6'>
    <h1 className="text-4xl text-white font-semibold mb-4">Motivo de consulta</h1>
    </div>
    <div className="max-w-screen-xl mx-auto mt-10">
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h2 className='text-xl  font-regular mb-4'><span className='font-bold'>Motivo de consulta: </span> {' '} {motivo.titulo}</h2>
    <p className='text-xl font-regular mb-4'> <span className='font-bold'>Descripción del caso:</span> {' '}{motivo.descripcion}</p>
    <p className='text-lg  font-regular mb-4'> <span className='font-semibold'>Publicado:</span> {formatearFecha(motivo.fecha)}</p> 
    <p className='text-lg  font-regular mb-4'> <span className='font-semibold'>Sexo:</span> {motivo.paciente?.sexo}</p> 
    <p className='text-lg  font-regular mb-4'> <span className='font-semibold'>¿Es fumador?:</span>  {motivo.paciente.historiaclinica?.fumador}</p>
    <p className='text-lg  font-regular mb-4'> <span className='font-semibold'>¿Consume alcohol?:</span> {motivo.paciente.historiaclinica?.alcohol}</p> 
    <p className='text-lg  font-regular mb-4'> <span className='font-semibold'>¿Consume Drogas?:</span> {motivo.paciente.historiaclinica?.drogas}</p> 
    <p className='text-lg  font-regular mb-4'> <span className='font-semibold'>¿Realiza actividad fisica?:</span> {motivo.paciente.historiaclinica?.actividadfisica}</p> 

    </div>
    </div>

    <div className="max-w-screen-xl mx-auto mt-10">
  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    {motivo.enfermedades.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Enfermedades</h3>
        <ul className="list-disc ml-4">
          {motivo.enfermedades.map(enfermedad => (
            <li key={enfermedad._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{enfermedad.nombre}</h4>
              {enfermedad.fechadiagnostico ? (
                <p className="text-gray-700 mb-2">Fecha de diagnóstico: {enfermedad.fechadiagnostico}</p>
              ) : (
                ''
              )}

               {enfermedad.tratamiento ? (
                <p className="text-gray-700 mb-2">Tratamiento: {enfermedad.tratamiento}</p>
              ) : (
                ''
              )}
              {enfermedad.ultimocontrol ? (
                <p className="text-gray-700 mb-2">Último control: {formatearFecha(enfermedad.ultimocontrol)}</p>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      </div>
    ):
    <div> 
     <h3 className="text-lg font-bold mb-2">Enfermedades</h3>
     <h3 className="text-md font-regular mb-2">No</h3>
     </div>
    }
   
<hr />
{motivo.antecedentesfam.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Antecedentes familiares</h3>
        <ul className="list-disc ml-4">
          {motivo.antecedentesfam.map(antecedentesfa => (
            <li key={antecedentesfa._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{antecedentesfa.nombrediagnostico}</h4>
            </li>
          ))}
        </ul>
      </div>
    ):    <div> 
    <h3 className="text-lg font-bold mb-2">Antecedentes familiares </h3>
    <h3 className="text-md font-regular mb-2">No</h3>
    </div>}
<hr />
    {motivo.alergias.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Alergias </h3>
        <ul className="list-disc ml-4">
          {motivo.alergias.map(alergia => (
            <li key={alergia._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{alergia.nombre}</h4>
              {alergia.tratamiento ? (
                <p className="text-gray-700 mb-2">Tratamiento: {alergia.tratamiento}</p>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      </div>
    ):    <div> 
    <h3 className="text-lg font-bold mb-2">Alergias</h3>
    <h3 className="text-md font-regular mb-2">No</h3>
    </div>}
    <hr />
    {motivo.farmaco.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Tratamiento farmacológico </h3>
        <ul className="list-disc ml-4">
          {motivo.farmaco.map(farma => (
            <li key={farma._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{farma.nombre}</h4>
            </li>
          ))}
        </ul>
      </div>
    ):    <div> 
    <h3 className="text-lg font-bold mb-2">Tratamiento farmacológico</h3>
    <h3 className="text-md font-regular mb-2">No</h3>
    </div>}
    <hr />
    {motivo.quirurgico.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Antecedentes Quirúrgicos </h3>
        <ul className="list-disc ml-4">
          {motivo.quirurgico.map(qui => (
            <li key={qui._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{qui.nombre}</h4>
            </li>
          ))}
        </ul>
      </div>
    ):    <div> 
    <h3 className="text-lg font-bold mb-2">Antecedentes Quirúrgicos</h3>
    <h3 className="text-md font-regular mb-2">No</h3>
    </div>}

    <hr />
    {motivo.hospitalizaciones.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Hospitalizaciones</h3>
        <ul className="list-disc ml-4">
          {motivo.hospitalizaciones.map(hos => (
            <li key={hos._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{hos.nombre}</h4>
            </li>
          ))}
        </ul>
      </div>
    ):    <div> 
    <h3 className="text-lg font-bold mb-2">Hospitalizaciones</h3>
    <h3 className="text-md font-regular mb-2">No</h3>
    </div>}
    <hr />
    {motivo.urgencia.length ? (
      <div>
        <h3 className="text-lg font-bold mb-2">Urgencias</h3>
        <ul className="list-disc ml-4">
          {motivo.urgencia.map(urg => (
            <li key={urg._id} className="mb-4">
              <h4 className="text-md font-bold mb-2">{urg.nombreUrg}</h4>
            </li>
          ))}
        </ul>
      </div>
    ):    <div> 
    <h3 className="text-lg font-bold mb-2">Urgencias</h3>
    <h3 className="text-md font-regular mb-2">No</h3>
    </div>}
    <hr />

    {motivo.paciente?.sexo === 'Mujer' ?
     <div>
     <h3 className="text-lg font-bold mb-2">Antecedentes ginecoobstétricos</h3>
     <h2 className='text-md font-regular mb-2'>{motivo.paciente?.nginecoobstetrico || 'No' } </h2>
   </div>

    :  ' '}

    
    
  </div>
</div>
<div className=' flex justify-center py-2'>




{mostrarFormulario ? (
        <div className="fixed  z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start ">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Formulario consulta</h3>
                  <h1 className="text-md "> ⌚ Horarios disponibles Paciente:</h1>
                  <div className='bg-lila-100 rounded-lg'>
  {motivo.horariopaciente ? (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 px-1 py-2 mt-1">
      {motivo.horariopaciente
        .filter((horario) => moment(horario.fecha).isSameOrAfter(moment(), 'day'))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .map((horario) => (
          <div key={horario._id} className="bg-gray-100 py-2 px-1 text-xs text-gray-800 rounded-md">
            <h4 className="text-xs font-regular mb-2">{moment(horario.fecha).format('DD/MM/YYYY')}</h4>
            <h4 className="text-xs font-regular mb-2">{horario.horarioinicio} - {horario.horariofin}</h4>
          </div>
        ))
      }
    </div>
  ) : (
    <p className="mt-4">Sin horarios</p>
  )}
</div>

                
  <div className="mb-4">
  <label htmlFor="mensaje" className="block text-gray-700 font-bold mb-2">Mensaje</label>
  <textarea
    id="mensaje"
    name="mensaje"
    value={mensaje}
    onChange={(e) => setMensaje(e.target.value)}
   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
   ></textarea>
    </div>
    <div>
 <div className="bg-lila-300 px-1 py-1 rounded-lg w-3/4">
  
  <h1 className="text-white text-xs"> <span className="font-bold">Nota:</span> Solo puedes agregar un tipo de tarifa para cada consulta. </h1>
 </div>
 <div className="flex px-2 justify-center gap-2 flex-wrap">
  <div className="mb-4 flex flex-col items-center justify-center">
    <label htmlFor="valor" className=" text-gray-700 font-bold mb-2">
      Tarifas globales:
    </label>
    <select
      className="w-50 border max-w-2xl border-gray-300 p-2 rounded-lg"
      value={tarifaGlobalId}
      onChange={(e) => {
        const tarifaGlobalSeleccionada = tarifasglobales.find((tari) => tari._id === e.target.value);
        setTarifaSeleccionada(tarifaGlobalSeleccionada);
        setTarifaGlobal(e.target.value);
        setEsTarifaGlobal(e.target.value !== '');

        if (tarifaGlobalSeleccionada) {
          setPrecio(tarifaGlobalSeleccionada.valor.toString());
        } else {
          setPrecio('');
        }
      }}
    >
      <option value="">Selecciona una tarifa global</option>
      {tarifasglobales.map((tari) => (
        <option key={tari._id} value={tari._id}>
          {tari.nombre} ({'$'}
          {tari.valor.toLocaleString('es-CL')}, {tari.tiempo} {'Min'})
        </option>
      ))}
    </select>

  </div>

  <div className="mb-4 flex flex-col items-center justify-center ">
    <label htmlFor="valor" className="block text-gray-700 font-bold mb-2">
      Tarifas personalizadas:
    </label>
    <select
      className="w-50 max-w-5xl border border-gray-300 p-2 rounded-lg"
      value={tarifaId}
      onChange={(e) => {
        const tarifaPersonalizadaSeleccionada = tarifas.find((tari) => tari._id === e.target.value);
        setTarifaSeleccionada(tarifaPersonalizadaSeleccionada);
        setTarifaId(e.target.value);
        if (e.target.value === '') {
          setEsTarifaGlobal(true);
        } else {
          setEsTarifaGlobal(false);
        }

        if (tarifaPersonalizadaSeleccionada) {
          setPrecio(tarifaPersonalizadaSeleccionada.valor.toString());
        } else {
          setPrecio('');
        }
      }}
    >
      <option value="">Selecciona una tarifa</option>
      {tarifas.filter((tari) => tari.activo === true).map((tari) => (
        <option key={tari._id} value={tari._id}>
          {tari.nombre} ({'$'}
          {tari.valor.toLocaleString('es-CL')}, {tari.tiempo} {'Min'})
        </option>
      ))}
    </select>
  </div>
</div>    

  </div>

  <div className="mb-4">
    <label htmlFor="fecha" className="block text-gray-700 font-bold mb-2">
      Fecha:
    </label>
    <div className="flex">
      <DatePicker
        id="fecha"
        name="fecha"
        selected={fecha}
        onChange={(date) => setFecha(date)}
        minDate={new Date()}
        filterDate={datePickerFilter}
        locale={es}
        placeholderText="Fechas disponibles"
        dateFormat="dd/MM/yyyy"
        className="border-t border-l border-b w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ref={datePickerRef}
        onBlur={handleCalendarBlur}
      />
      <button
        type="button"
        className=" border-t border-r border-b py-2 px-3  focus:outline-none"
        onClick={handleCalendarButtonClick}
      >
       <AiFillCalendar/>
      </button>
    </div>
  </div>
  <div className="mb-4">
  <label htmlFor="horaInicio" className="block text-gray-700 font-bold mb-2">Hora de inicio</label>
  <input
    type="time"
    id="horarioinicio"
    name="horarioinicio"
    value={horarioinicio}
    onChange={(e) => {
      setHoraInicio(e.target.value);
      setHoraFin(calcularHoraFin(e.target.value));
    }}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  />
</div>
<div className="mb-4">
  <label htmlFor="horariofin" className="block text-gray-700 font-bold mb-2">Hora de fin</label>
  <input
    type="time"
    id="horariofin"
    name="horariofin"
    value={horariofin}
    onChange={(e) => setHoraFin(e.target.value)}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  />
</div>
<div className="mb-4">
  <label htmlFor="precio" className="block text-gray-700 font-bold mb-2">Valor de la consulta</label>
  <input
    type="text"
    id="precio"
    name="precio"
    value={precio}
    onChange={(e) => setPrecio(e.target.value)}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  />  
</div>

                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button className="bg-lila-200 px-2 py-2 rounded-md text-white hover:bg-lila-100" onClick={() =>enviarNotificacion()}>Tomar este caso</button>
              </span>
                        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        <button type="button" onClick={cerrarFormulario} className="inline-flex justify-center w-full rounded-md  px-4 py-2 bg-coral-200 hover:bg-coral-100 text-base leading-6 font-medium text-white shadow-smfocus:outline-none focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                        Cancelar
                        </button>
                        </span>
                        </div>
                        </div>
                        </div>
                        </div>
                        ) : (
                          <div className="  px-4 py-3 sm:px-6 sm:flex justify-center">
                        <button onClick={abrirFormulario} className="  w-full inline-flex justify-center rounded-md border border-transparent px-10 py-2 mb-2 bg-lila-200  font-regular text-white hover:bg-lila-100  sm:ml-3 sm:w-auto sm:text-md">
                        Tomar caso
                        </button>
                        </div>
                        )}
</div>
 </div>
  );
};

export default VerMotivo;