import { useEffect, useState } from "react"
import clientAxios from "../../config/axios";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ModalMotivo } from "./ModalMotivo";
import {ModalHora} from "./ModalHora"
import proAuth from "../../hooks/proAuth"
import moment from 'moment-timezone';
import { Paginacion } from "../Paginacion"
import { parseISO, isSameDay, startOfDay,parse, isAfter, isBefore} from 'date-fns';
dayjs.extend(utc);
dayjs.extend(timezone);
const FormularioinicioMotivos= ({}) => {

    const [motivos, setMotivos] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [motivo, setMotivo] = useState(null);
    const [hora, setHora] = useState(null);
    const [showModalHora, setShowModalHora] = useState(false);
    const [motivoId, setMotivoId] = useState(null);
    const {authpro} =  proAuth()
    const [orden, setOrden] = useState("descendente");
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState (1);
   const [porPagina, setPorPagina] = useState (5);
   

    const [filtroGenero, setFiltroGenero] = useState("");
    const [filtroRangoEdad, setFiltroRangoEdad] = useState("");
const [searchDias, setSearchDias] = useState([]);
const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState('');
const [horaFinSeleccionada, setHoraFinSeleccionada] = useState('');
const [edadMin, setEdadMin] = useState("");
const [edadMax, setEdadMax] = useState("");
const rangosEdad = [
  { id: 1, nombre: '0 meses a 1 mes', edadMin: 0, edadMax: 0, mesMin: 0, mesMax: 1 },
  { id: 2, nombre: '1 mes a 12 meses', edadMin: 0, edadMax: 1, mesMin: 1, mesMax: 12 },
  { id: 3, nombre: '12 meses a 2 años', edadMin: 1, edadMax: 2, mesMin: 0, mesMax: 0 },
  { id: 4, nombre: '2 años a 6 años', edadMin: 2, edadMax: 6, mesMin: 0, mesMax: 0 },
  { id: 5, nombre: '6 años a 13 años', edadMin: 6, edadMax: 13, mesMin: 0, mesMax: 0 },
  { id: 6, nombre: '13 años a 17 años', edadMin: 13, edadMax: 17, mesMin: 0, mesMax: 0 },
  { id: 7, nombre: 'Adultos', edadMin: '', edadMax: '', mesMin: 0, mesMax: 0 },

];


const handleHover = async (id) => {
  const tokenPro = localStorage.getItem('tokenPro');
  if (!tokenPro) return;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenPro}`
    }
  };
  
  const {data } = await clientAxios(`/profesional/obtener-motivo/${id}`,config);

  setHora(data);
  setShowModalHora(true);
};
const handleCloseModal = () => {
  setTimeout(() => {
    setShowModalHora(false);
    setHora(null);
  }, 1000);
};
const handleSearchDiasChange = (event) => {
  const { value } = event.target;
  setSearchDias(value.trim() === "" ? [] : value.split(","));
};

const filtrarPorDias = (motivo) => {
  if (searchDias.length === 0) return true;
  return searchDias.some((dia) => motivo.paciente[dia.trim().toLowerCase()]);
};
  
    const handleClick = async (id) => {
      const tokenPro = localStorage.getItem('tokenPro');
      if (!tokenPro) return;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPro}`
        }
      };
      
      const {data } = await clientAxios(`/profesional/obtener-motivo/${id}`,config);

      setMotivo(data);
      setShowModal(true);
      
    };
    const formatearFecha = (fecha) => {
      const nuevaFecha = new Date(fecha)
      nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
      return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
      
      const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const cumpleanos = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        const mes = hoy.getMonth() - cumpleanos.getMonth();
      
        if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
          edad--;
        }

        return edad;
      }
      const calcularMes = (fecha) => {
        const fechaNacimiento = new Date(fecha);
        const mesActual = new Date().getMonth();
        const mesNacimiento = fechaNacimiento.getMonth();
        let edadMeses = mesActual - mesNacimiento ; 
      
        if (edadMeses <= 0) { // si la resta da 0 o menos, sumamos 12 para obtener el mes correcto
          edadMeses += 12;
        }
      
        if (edadMeses > 12) { // si la edad en meses es mayor a 12, la ajustamos a 12
          edadMeses = 12;
        }

        return edadMeses;
      }

      

      const filtrarPorEdad = (motivos) => {
        if (filtroRangoEdad === "") {
          return motivos;
        } else {
          const rangoEdad = rangosEdad.find((rango) => rango.id === parseInt(filtroRangoEdad));
      
          if (rangoEdad.id === 7) {
            return motivos.filter((motivo) => {
              const edad = calcularEdad(motivo.paciente.fechaNacimiento);
              const mes = calcularMes(motivo.paciente.fechaNacimiento);
      
              if (edad < edadMin || edad > edadMax) {
                return false;
              }
              if (edad === edadMin && mes < 0) {
                return false;
              }
              if (edad === edadMax && mes > 0) {
                return false;
              }
              return true;
            });
          } else {
            return motivos.filter((motivo) => {
              const edad = calcularEdad(motivo.paciente.fechaNacimiento);
              const mes = calcularMes(motivo.paciente.fechaNacimiento);
              if (edad < rangoEdad.edadMin || edad > rangoEdad.edadMax) {
                return false;
              }
              if (edad === rangoEdad.edadMin && mes < rangoEdad.mesMin) {
                return false;
              }
              if (edad === rangoEdad.edadMax && mes > rangoEdad.mesMax) {
                return false;
              }
              return true;
            });
          }
        }
      };
      
      
      
      const handleSelectChange = (event) => {
        setFiltroRangoEdad(event.target.value);
        setEdadMin("18");
        setEdadMax("");
      };


    useEffect(()=>{
        const obtenerEspecialidades = async() =>{
          try {
            const tokenPro = localStorage.getItem('tokenPro')
            if(!tokenPro) return
      
            const config={
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
            }
            }
            const { data } = await clientAxios.get('/profesional/traer-especialidad',config)
            setEspecialidades(data)
          } catch (error) {
            console.log(error)
          }
      
        }
        obtenerEspecialidades()      
      },[])
      useEffect(() => {
        const obtenerMotivosConsulta = async () => {
          try {
            const tokenPro = localStorage.getItem('tokenPro');
            if (!tokenPro) return;
      
            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
              }
            };
      
            const { data } = await clientAxios.get('/profesional/obtener-motivos', config);
      
            // Modificar la estructura de los datos
            const motivos = data.map((motivo) => ({
              ...motivo,
              paciente: motivo.paciente[0], // Obtener el primer elemento del array
            }));
            setMotivos(motivos);
            setLoading(false);

          } catch (error) {
            console.log(error);
          }
        };
      
        obtenerMotivosConsulta();
      }, [motivos]);
      useEffect(()=>{
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
            const { data } = await clientAxios.get('/profesional/obtener-consultas',config)
            setConsultas(data)
          } catch (error) {
            console.log(error)
          }
      
        }
        obtenerMotivosConsulta()      
      },[consultas])


      const removeAccents = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };
      
      const motivosfiltrados = motivos
      .filter(
        (motivo) =>
          motivo.estado === "publicado" &&
          motivo.visible === true &&
          !consultas.some(
            (con) =>
              con.motivoconsulta === motivo._id &&
              con.profesional === authpro._id
          ) &&
          (filtroGenero === "" || motivo.paciente.sexo === filtroGenero)
      )
  .filter(motivo => motivo.titulo.toString().toLowerCase().includes(searchValue.toLowerCase())
  ||motivo.descripcion.toString().toLowerCase().includes(searchValue.toLowerCase())
   )
   .filter(motivo => {
    if (motivo.especialidades === 'General' || motivo.especialidades === 'Médico General') {
      return true; // Se muestra si la especialidad es 'General' o 'Médico General'
    } else {
      const especialidadesProfesional = especialidades.map(e => removeAccents(e.nombre.toLowerCase()));
      const especialidadesMotivo = motivo.especialidades.toLowerCase().split(', ');
      return especialidadesMotivo.some(especialidad => especialidadesProfesional.some(profesional => removeAccents(profesional).includes(removeAccents(especialidad))));
    }
  })
   
  
  .sort((a, b) => {
    if (orden === "descendente") {
      return new Date(b.fecha) - new Date(a.fecha);
    } else {
      return new Date(a.fecha) - new Date(b.fecha);
    }
  })
  .filter((motivo) => filtrarPorEdad([motivo]).length > 0)
  .filter((motivo) => {
    if (fechaSeleccionada === null ) {
      return true; // Si no se ha seleccionado una fecha ni una hora de inicio, se muestra el motivo
    }
  
    const fechaSeleccionadaParsed = fechaSeleccionada !== null ? startOfDay(parseISO(fechaSeleccionada)) : null;
  
    return motivo.horarios.some((horario) => {
      const fechaHorario = startOfDay(parseISO(horario.fecha));

      // Verificar si la fecha concuerda
      if (fechaSeleccionada !== null && !isSameDay(fechaHorario, fechaSeleccionadaParsed)) {
        return false;
     }
  
      return true;
    });
  })
  .filter((motivo) => {
    if (!motivo.horarios || motivo.horarios.length === 0) {
      return true; // Si no hay valor de horarios, se muestra el motivo
    }
  
    if (horaInicioSeleccionada === '') {
      return true; // Si no se ha seleccionado una hora de inicio, se muestra el motivo
    }
  
    const [horaSeleccionada, minutoSeleccionado] = horaInicioSeleccionada.split(':');
  
    const horaInicioSeleccionadaParsed = new Date();
    horaInicioSeleccionadaParsed.setHours(Number(horaSeleccionada), Number(minutoSeleccionado), 0);
  
    // Verificar si al menos uno de los horarios cumple con el filtro de hora de inicio y fin
    return motivo.horarios.some((horario) => {
      if (!horario.horarioinicio || !horario.horariofin) {
        return true; // Si no hay valor de horarioinicio o horariofin en el horario actual, se muestra el motivo
      }
  
      const [horaInicioMotivo, minutoInicioMotivo] = horario.horarioinicio.split(':');
      const [horaFinMotivo, minutoFinMotivo] = horario.horariofin.split(':');
  
      const horaInicioMotivoParsed = new Date();
      horaInicioMotivoParsed.setHours(Number(horaInicioMotivo), Number(minutoInicioMotivo), 0);
  
      const horaFinMotivoParsed = new Date();
      horaFinMotivoParsed.setHours(Number(horaFinMotivo), Number(minutoFinMotivo), 0);
  
      return (
        horaInicioSeleccionadaParsed >= horaInicioMotivoParsed &&
        horaInicioSeleccionadaParsed <= horaFinMotivoParsed
      );
    });
  })
  
  

  .filter(
    (motivo) => filtrarPorDias(motivo) 
  );
  const motivosFiltradosOrdenados = filtrarPorEdad(motivosfiltrados);
  
  if (orden === "descendente") {
    motivosFiltradosOrdenados.reverse();
  }
  ;
  const maximo = Math.ceil(motivosfiltrados.length / porPagina) 

  return (
    <>
           {loading ? (
        <p>Cargando...</p>
      ) : (  <div>

<div>

<h1 className="text-center font-bold text-4xl text-lila-300 mt-2 mb-4">Motivos de consulta</h1>
</div>

<div className="flex flex-col md:flex-row md:items-center justify-center my-2 gap-2 w-full">

<div className="flex justify-end px-1 py-2 ">
  <label htmlFor="orden" className="mr-2 font-semibold">Buscar:</label>
  <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Buscar motivos de consulta" className="p-1 border rounded-md w-80 placeholder:text-sm" />

</div>

</div>
<div className="flex flex-col md:flex-row md:items-center justify-center my-2 gap-2 w-full">
<div className="flex flex-col md:flex-row justify-center items-center gap-2">

    <label htmlFor="filtro-edad">Filtrar por edad:</label>
    <select className="border rounded-md" id="filtro-edad" value={filtroRangoEdad} onChange={handleSelectChange}>
<option value="">Todos los rangos</option>
<option value="1">0 meses a 1 mes</option>
<option value="2">1 mes a 12 meses</option>
<option value="3">12 meses a 2 años</option>
<option value="4">2 años a 6 años</option>
<option value="5">6 años a 13 años</option>
<option value="6">13 años a 17 años</option>
<option value="7">Adultos</option>
</select>

  {filtroRangoEdad === "7" && (
<div className="flex flex-col md:flex-row justify-center items-center gap-2">
  <label htmlFor="edad-minima">Edad mínima:</label>
  <input
  className="w-12 border rounded-md"
    id="edad-minima"
    type="number"
    value={edadMin}
    onChange={(e) => setEdadMin(e.target.value)}
  />
  <label htmlFor="edad-maxima">Edad máxima:</label>
  <input
     className="w-12 border rounded-md "
    id="edad-maxima"
    type="number"
    value={edadMax}
    onChange={(e) => setEdadMax(e.target.value)}
  />
</div>
)}
  <label className="font-regular" htmlFor="genero">Filtrar por género:</label>
  <select id="genero" value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)} className="p-1 border rounded-md md:w-auto">
    <option value="">Todos</option>
    <option value="Hombre">Masculino</option>
    <option value="Mujer">Femenino</option>
  </select>
<label>Filtrar por fecha:</label>
<input
className="border rounded-md"
type="date"
value={fechaSeleccionada || ''}
onChange={(e) => setFechaSeleccionada(e.target.value !== '' ? e.target.value : null)}
/>
<label>Filtrar por hora:</label>
<input
className="border rounded-md"
type="time"
id="horaInicio"
value={horaInicioSeleccionada || ''}
onChange={(e) => setHoraInicioSeleccionada(e.target.value)}
/>
  <button onClick={() => { setFiltroGenero(""); setOrden("descendente"); setFiltroRangoEdad("");  setFechaSeleccionada(null); setHoraInicioSeleccionada("");
  }} className="bg-lila-200 hover:bg-lila-100 text-white px-2 py-1 rounded-lg md:w-auto">Borrar filtros</button>
</div>
</div>
<hr  />
<div className="grid grid-cols-1 md:grid-cols-1 xl:px-60  gap-4 mt-2 mr-20">
  {motivosfiltrados.slice(
                (pagina - 1)* porPagina,
                (pagina - 1 ) * porPagina + porPagina
                )
    .sort((a, b) => moment(b.fecha).valueOf() - moment(a.fecha).valueOf())
    .map((motivo) => {
      if (!Array.isArray(motivo.horarios) || motivo.horarios.length === 0) {
        return null; // No se muestra el motivo si no tiene horarios
      }
      
      return (
        <div key={motivo._id} className="bg-white rounded-lg shadow-md overflow-hidden w-full mb-10 border-t mt-2">


    <div className="p-4">
      <h2 className="text-lg font-medium text-gray-800 text-center">
        {motivo.titulo}
      </h2>
      <div className="flex justify-between items-center ">
        <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
          Publicado: {formatearFecha(motivo.fecha)}
        </span>
        <div className="flex space-x-2">
          <div className="inline-block bg-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">
            <p className="text-xs font-medium text-gray-700">Sexo</p>
            <p className="text-xs font-regular text-slate-800">{motivo.paciente.sexo || ''}</p>
          </div>
          <div className="inline-block bg-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">
            <p className="text-xs font-medium text-gray-700">Edad</p>
            <p className="text-xs font-regular text-slate-800">{calcularEdad(motivo.paciente.fechaNacimiento)} {'años'} </p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-lg font-regular text-slate-800">{motivo.descripcion || ''}</p>
      <div className="bg-gray-100 rounded-lg px-1  py-1 mt-2">
      <h1 className="text-md "> ⌚ Horarios disponibles Paciente</h1>
      {Array.isArray(motivo.horarios) && motivo.horarios.length > 0 ? (
<div className="grid grid-cols-2 md:grid-cols-8 gap-4 px-1 py-2 mt-1">
  {motivo.horarios
    .filter((horario) => moment(horario.fecha).isSameOrAfter(moment(), 'day'))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map((horario, index) => (
      <div
        key={index}
        className="bg-lila-100 py-2 px-1 text-xl font-regular text-white rounded-md"
      >
        <h4 className="text-xs font-regular mb-2">
          {moment(horario.fecha).format('DD/MM/YYYY')}
        </h4>
        <h4 className="text-xs font-regular mb-2">
          {horario.horarioinicio ||  ''} - {horario.horariofin ||' '}
        </h4>
      </div>
    ))}
</div>
) : (
<div>
  <p className="mt-4 text-lila-400 text-lg italic">
    El paciente no ha registrado sus horarios
  </p>
</div>
)}
</div>


      
   

    </div>
    <div className="bg-gray-100 px-4 py-3 flex gap-2">
      <button
        className="bg-lila-200 hover:bg-lila-100 px-5 py-1 rounded-md text-white"
        onClick={() => handleClick(motivo._id)}
  
      >
        Ver Más
      </button>
    </div>
  
  
  </div>
   );
  })}
  <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
{showModal && <ModalMotivo motivo={motivo} onClose={() => setShowModal(false)} />}
{showModalHora && (
    <ModalHora motivo={hora} onClose={() => handleCloseModal()} />
  )}
</div>

      </div>  )}


  </>
  )
}

export default FormularioinicioMotivos