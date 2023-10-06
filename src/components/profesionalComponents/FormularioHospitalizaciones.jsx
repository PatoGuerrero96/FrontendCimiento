import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";
import moment from "moment";
const FormularioHospitalizaciones = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [datosPaciente, setDatosPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [ocultarseccion, setOcultarSeccion] = useState(false);
    const [ocultarAntecedente, setOcultarAntecedente] = useState({});
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [HospitalizacionActualId, setHospitalizacionId] = useState(null);
    const [loadingEnfermedades, setLoadingEnfermedades] = useState(true);
    const [enfermedadId, setEnfermedadId] = useState('');
    const [enfermedades, setEnfermedades] = useState([]);
    const [nombre, setNombre] = useState('');
    const [fechaingreso, setFecha] = useState('');
    const [fechasalida, setFechasalida] = useState('');
    const toggleAntecedente = (hospitalizacionesId) => {
        setOcultarAntecedente((prevOcultarAntecedente) => ({
          ...prevOcultarAntecedente,
          [hospitalizacionesId]: !prevOcultarAntecedente[hospitalizacionesId]
        }));
      };
      const cerrarModal = () => {
        setMostrarFormulario(false);
      };


      const fetchData = async () => {
      const tokenPro = localStorage.getItem("tokenPro");
      if (!tokenPro) return;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPro}`,
        },
      };
        try {
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );
          setConsulta(data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
        useEffect(() => { 
        fetchData();
        }, [id]);
      const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset());
        const formatoFecha = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        };
        return nuevaFecha.toLocaleDateString('es-CL', formatoFecha);
      };

      useEffect(() => {
        if (consulta && Array.isArray(consulta.hospitalizaciones)) {
          setDatosPaciente(consulta.hospitalizaciones);
        }
      }, [consulta]);
      const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
      const hayCamposVacios = Object.values(datosPaciente).some(
        (hospitalizaciones) =>
          !hospitalizaciones.nombre||
          !hospitalizaciones.fechaingreso ||
          !hospitalizaciones.fechasalida ||
          hospitalizaciones.guardadoporpaciente ===true
      );
      const actualizarPaciente = async () => {
        const confirmar = await Swal.fire({
          title: '¿Estás seguro de actualizar esta hospitalización?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#5d5ddb',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar'
          }).then((result) => {
          if (result.isConfirmed) {
              return true;
          } else {
              return false;
          }
      })
      if(confirmar) { 
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro || !HospitalizacionActualId) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
      
        try {
          const hospitalizaciones = datosPaciente[HospitalizacionActualId];
      
          await clientAxios.put(`/profesional/editar-hospitalizaciones-paciente/${hospitalizaciones._id}`, hospitalizaciones, config);
         fetchData();
          Swal.fire('¡Perfecto!', 'Hospitalización actualizada con éxito', 'success');
        } catch (error) {
          console.error(error.message);
        }
      }
      };
      const handleChange = (e,hospitalizacionesId) => {
        const { name, value } = e.target;
        setDatosPaciente((prevState) => ({
          ...prevState,
          [hospitalizacionesId]: {
            ...prevState[hospitalizacionesId],
            [name]: value
          }
        }));
      
        setHospitalizacionId(hospitalizacionesId); 
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (!nombre) {
            Swal.fire('¡Error!', 'Por favor, Agregue un nombre para la hospitalización', 'error');
            return;
          }
          if (!fechaingreso) {
            Swal.fire('¡Error!', 'Por favor, Agregue una fecha para la hospitalización', 'error');
            return;
          }
          if (!fechasalida) {
            Swal.fire('¡Error!', 'Por favor, Agregue una fecha para la hospitalización', 'error');
            return;
          }
          const tokenPro = localStorage.getItem("tokenPro");
          if (!tokenPro) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`,
            },
          };
          await clientAxios.post('/profesional/agregar-hospitalizaciones-paciente', {
            nombre,
            fechaingreso,
            fechasalida,
            enfermedad: enfermedadId,
            pacienteId: consulta.paciente._id,
          },config);
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );

          setConsulta(data);
          setDatosPaciente(data.hospitalizaciones);
          fetchData();
          setNombre('');
          setFecha('');
          setMostrarFormulario(false)
          // Mostrar mensaje de éxito o redireccionar a otra página
          Swal.fire('¡Perfecto!', 'Hospitalizacion actualizada con éxito', 'success');
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se puede guardar la hospitalización', 'error');
        }
      };
      useEffect(() => {
        const tokenPro = localStorage.getItem("tokenPro");
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`,
          },
        };
      
        const ObtenerEnfermedades = async () => {
          try {
            const { data } = await clientAxios.get(
              `/profesional/obtener-enfermedades`,
              config
            );
      
            if (consulta && consulta.paciente) {
              const enfermedadesFiltradas = data.filter(
                (enfermedad) => consulta.paciente._id === enfermedad.paciente
              );
              setEnfermedades(enfermedadesFiltradas);
              setLoadingEnfermedades(false);
            }
          } catch (error) {
            console.log(error);
          }
        };
      
        ObtenerEnfermedades();
      }, [consulta]);
      const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));
      const VerFormularioCerrado = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
  return (
    <>
          {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
        <div className="mx-auto max-w-7xl rounded-md  border mb-2 ">
        <div className="flex justify-start gap-2 py-1 px-4  rounded-t-lg bg-lila-300">
              <div>
              {consulta.paciente?.historiaclinica?.enfermedad==='No'  && !datosPaciente.length || consulta.paciente?.historiaclinica?.enfermedad==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.enfermedad==='Si' && !datosPaciente.length  ?
                <h1 className="text-white font-semibold text-sm">Hospitalizaciones:</h1>:<h1 className="text-white font-semibold text-sm">Hospitalizaciones{` (${consulta.hospitalizaciones.length})`}
                </h1>}

              </div>
              <div className="">
{consulta.paciente?.historiaclinica?.hospitalizaciones==='No' && !datosPaciente.length ?
  <h1 className=" text-white">No</h1>
:''}
 {consulta.paciente?.historiaclinica?.hospitalizaciones==='Sin datos' && !datosPaciente.length?
  <h1 className=" text-white">Sin datos</h1>
:''}
    {consulta.paciente?.historiaclinica?.hospitalizaciones==='Si' && !datosPaciente.length?
  <h1 className=" text-white">Si</h1>
:''}
</div>
{consulta.paciente?.historiaclinica?.enfermedad==='No'  && !datosPaciente.length || consulta.paciente?.historiaclinica?.enfermedad==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.enfermedad==='Si' && !datosPaciente.length  ?
''
             : <div>
                <button
                  className="rounded-md inline-flex space-x-1 items-center text-white hover:text-white hover:bg-indigo-500"
                  onClick={() => {setOcultarSeccion(!ocultarseccion); setMostrarFormulario(false);} }
                >
                  <span className="text-xs font-regular  lg:block">
                    {ocultarseccion ? (
                      <div className="flex gap-2">
                        <p className=" text-2xl"> <MdKeyboardArrowDown/></p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <p className=" text-2xl"><MdKeyboardArrowRight/></p>
                      </div>
                    )}
                  </span>
                </button>
              </div>} 
              <div>
              {hayCamposVacios && (
                  <p className="text-red-600 text-2xl">
                    <FaExclamation className="animate-pulso" />
                    </p>
              )}
              </div>          
        </div>
        <div className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>
        <div className="mx-auto max-w-7xl rounded-md">
        <div className="border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50">
        {consulta.hospitalizaciones.length ? 
        <div>
        {Object.keys(datosPaciente).map((hospitalizacionesId, index) => {
         const numeroEnumeracion = index + 1;
        const hospitalizaciones = datosPaciente[hospitalizacionesId];
        const CamposVacios =
        !hospitalizaciones.nombre||
        !hospitalizaciones.fechaingreso ||
        !hospitalizaciones.fechasalida ||
        hospitalizaciones.guardadoporpaciente ===true;
        const nombreVacio = !hospitalizaciones.nombre  || hospitalizaciones.guardadoporpaciente ===true;
        const fechaVacio = !hospitalizaciones.fechaingreso;
        const fechasalidaVacio = !hospitalizaciones.fechasalida;
        const isFarmacoOculto = ocultarAntecedente[hospitalizacionesId] || false;
return (
<div className="border-b border-b-indigo-200" key={hospitalizacionesId}>
<div className="container mx-auto p-1">
<div className="grid grid-cols-10 items-center  ">
  <div className="col-span-9 flex justify-start gap-2 ">
  <div className="">
    <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
    </div>
  <div className="flex gap-1">
      <p className="text-md font-regular">
        {hospitalizaciones.nombre} :
      </p>
      <p className="text-sm mt-1 font-regular">
        {hospitalizaciones.fechaingreso ? `(${formatearFecha(hospitalizaciones.fechaingreso)})` : ''}
      </p>


    </div>

  {CamposVacios && (
       <div className="flex mt-1">

    <p className="text-red-500 text-md"><FaExclamation className="animate-pulso text-xl" /></p>
    </div>
  )}
  <div>
  <button
    className="text-blue-500 focus:outline-none"
    onClick={() => toggleAntecedente(hospitalizacionesId)}
  >
    {isFarmacoOculto ? (
      <p className="text-3xl"><MdKeyboardArrowDown /></p>
    ) : (
      <p className="text-3xl"><MdKeyboardArrowRight /></p>
    )}
  </button>
  </div>

</div>
</div>
      {isFarmacoOculto && (
        <>
        {showButton ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
    <div className="flex flex-col text-sm">
      <div className="flex items-center">
      <label htmlFor="nombre" className=" ">Diagnósticos principales:</label>
      {nombreVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
key={hospitalizacionesId}
type="text"
className={`border px-2 py-1 rounded-lg w-full ${hospitalizaciones.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="nombre"
placeholder="Ej:Nombre del diagnóstico"
value={hospitalizaciones.nombre || ''}
onChange={(e) => handleChange(e, hospitalizacionesId)}
/>
    </div>
    <div className="flex flex-col text-sm">
        <div className="flex">
        <label htmlFor="fechaingreso" className=" ">Fecha de ingreso:</label>
      {fechaVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
    <input
key={hospitalizacionesId}
type="date"
className={`border px-2 py-1 rounded-lg w-full ${hospitalizaciones.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="fechaingreso"
placeholder="Ej:Fecha de ingreso"
value={hospitalizaciones.fechaingreso || ''}
onChange={(e) => handleChange(e, hospitalizacionesId)}
/>
    </div>
    <div className="flex flex-col text-sm">
        <div className="flex">
        <label htmlFor="fechaingreso" className=" ">Fecha de salida:</label>
      {fechasalidaVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
    <input
key={hospitalizacionesId}
type="date"
className={`border px-2 py-1 rounded-lg w-full ${hospitalizaciones.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="fechasalida"
placeholder="Ej:Fecha de salida"
value={hospitalizaciones.fechasalida || ''}
onChange={(e) => handleChange(e, hospitalizacionesId)}
/>
    </div>
    <div className="flex flex-col text-sm">
  <label htmlFor="enfermedad" className="">Asociar a</label>
  {loadingEnfermedades ? (
    <span>Cargando...</span>
  ) : (
    <select
      className="border  px-2 py-1 rounded-lg w-full"
      name="enfermedad"
      value={hospitalizaciones.enfermedad || ''}
      onChange={(e) => handleChange(e, hospitalizacionesId)}
    >
      <option value={null}>Sin enfermedad</option>
      {enfermedades.map((enfermedad) => (
        <option key={enfermedad._id} value={enfermedad._id}>{enfermedad.nombre}</option>
      ))}
    </select>
  )}
</div>
    <div className="flex flex-col text-sm">
        <div className="flex">
        <label htmlFor="fechaingreso" className=" ">Examen:</label>
    </div>
{ hospitalizaciones.documento?.secure_url ?<a className="border px-2 py-1 rounded-lg w-full" href={hospitalizaciones.documento?.secure_url} target="_blank">Examen</a> : 'Sin Examen'} 


    </div>

  </div>
   ) : (
    <div className="flex flex-col text-sm gap-1">
    <div className="flex items-center  gap-1">
      <label htmlFor="nombre" className="font-bold">Diagnósticos principales:</label>
      <label>{hospitalizaciones.nombre || ''} </label>
    </div>
    <div className="flex items-center  gap-1">
      <label htmlFor="ultimocontrol" className="font-bold">
      Fecha de ingreso:
      </label>
      <label>{hospitalizaciones.fechaingreso||''}</label>
    </div>
    <div className="flex items-center  gap-1">
      <label htmlFor="ultimocontrol" className="font-bold">
      Fecha de salida:
      </label>
      <label>{hospitalizaciones.fechasalida||''}</label>
    </div>
    <div className="flex items-center  gap-1">
      <label htmlFor="ultimocontrol" className="font-bold">
      Enfermedad asociada:
      </label>
      <label>{hospitalizaciones.enfermedad||''}</label>
    </div>


  </div>
)}
  <div className="flex justify-center p-2">
    {showButton && (
      <button onClick={actualizarPaciente} className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
        Actualizar
      </button>
    )}
  </div>
    <div className="flex justify-end">
      </div>
    </>
      )}
</div>


</div>

);

})}
</div>
: 
''}
<div>



</div>
        </div>
        </div>
        </div>
        <div className="relative mb-2">
        {showButton && (
 <button
 onClick={VerFormularioCerrado}
 className="text-sm rounded-full focus:outline-none focus:border-lila-200 text-white bg-lila-100 hover:bg-lila-100 hover:text-lila-200"
 style={{ position: 'absolute', top: '-10px' }}
>    { mostrarFormulario ?  <div className="flex"> 
 < IoMdCloseCircle className="text-2xl "/>
 </div>  :<div className="flex"> 
      <MdAddCircle className="text-2xl"/> 
      </div> }
  </button>
    )}
     </div>
        </div>
        </>
        )}
  {mostrarFormulario && (
      <div className="fixed inset-0 flex  items-center justify-center z-50">
      <div
        className="bg-gray-800 bg-opacity-75  absolute inset-0 pointer-events-none"
        onClick={cerrarModal}
      ></div>
      <div className="bg-white rounded-lg p-6 relative w-96 ">
        <button onClick={cerrarModal} className="absolute top-0 right-0 p-2 ">
        < IoMdCloseCircle className="text-3xl text-lila-300  hover:text-lila-100 "/>
        </button>
  <form className="p-1" onSubmit={handleSubmit}>
    <h1 className=" text-center text-xl font-bold p-1">Nueva hospitalización</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className=" ">Nombre de la hospitalización:</label>
        <input
  type="text"
  className="border  px-2 py-1 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Ej:Agregue el nombre de la hospitalización"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="fechaingreso" className=" ">Fecha de ingreso:</label>
        <input
  type="date"
  className="border  px-2 py-1 rounded-lg w-full "
  name="fechaingreso"
  id="fechaingreso" 
  placeholder="Ej:Agregue la fecha de ingreso"
  value={fechaingreso}
  onChange={(e) => setFecha(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="fechasalida" className=" ">Fecha de salida:</label>
        <input
  type="date"
  className="border  px-2 py-1 rounded-lg w-full "
  name="fechasalida"
  id="fechasalida" 
  placeholder="Ej:Agregue la fecha de salida"
  value={fechasalida}
  onChange={(e) => setFechasalida(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
      <label htmlFor="enfermedad" className="">Asociar a</label>
  {loadingEnfermedades ? (
    <span>Cargando...</span>
  ) : (
    <select className='border  px-2 py-1 rounded-lg w-full' value={enfermedadId} onChange={(e) => setEnfermedadId(e.target.value)}>
  <option className='font-bold' value={null}>Sin enfermedad</option>
  {enfermedades.map((enfermedad) => (
    <option key={enfermedad._id} value={enfermedad._id}>
      {enfermedad.nombre}
    </option>
  ))}
    </select>
  )}
      </div>


    </div>
    <div className="flex justify-center py-2 ">
        <button  type="submit" className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
         Guardar 
        </button>
      </div>

  </form>
  </div>
        </div>
)}    
</>
  )
}

export default FormularioHospitalizaciones