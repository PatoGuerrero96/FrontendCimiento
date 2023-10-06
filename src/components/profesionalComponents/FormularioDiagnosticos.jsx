import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown,MdAddCircle,MdKeyboardArrowRight } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";

import moment from "moment";
const FormularioDiagnosticos = () => {
  const { id } = useParams();
  const [consulta, setConsulta] = useState(null);
  const [datosPaciente, setDatosPaciente] = useState({});
  const [loading, setLoading] = useState(true);
  const [ocultarseccion, setOcultarSeccion] = useState(false);
  const [enfermedadActualId, setEnfermedadActualId] = useState(null);
  const [ocultarEnfermedad, setOcultarEnfermedad] = useState({});
  const [nombre, setNombre] = useState('');
  const [fechadiagnostico, setFechadiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState(''); 
  const [ultimocontrol, setUltimoControl] = useState(null);
  const [obsdiagnostico, setObsdiagnostico] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nombreExamen,setNombreExamen] = useState('');
  const [enfermedadIdSeleccionada, setEnfermedadIdSeleccionada] = useState(null);
  const toggleEnfermedad = (enfermedadId) => {
    setOcultarEnfermedad((prevOcultarEnfermedad) => ({
      ...prevOcultarEnfermedad,
      [enfermedadId]: !prevOcultarEnfermedad[enfermedadId]
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
  fetchData(); // Llama a fetchData para obtener los datos iniciales
}, [id]);
  
  const actualizarPaciente = async () => {
    const confirmar = await Swal.fire({
      title: '¿Estas seguro de actualizar este diagnóstico?',
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
    });
  
    if (confirmar) {
      const tokenPro = localStorage.getItem('tokenPro');
      if (!tokenPro || !enfermedadActualId) return;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPro}`
        }
      };
  
      try {
        const enfermedad = datosPaciente[enfermedadActualId];
  
        await clientAxios.put(`/profesional/editar-enfermedades-paciente/${enfermedad._id}`, enfermedad, config);
  
        // Obtener los datos actualizados después de la actualización
        fetchData();
        
        Swal.fire('¡Perfecto!', 'Diagnóstico actualizado con éxito', 'success');
      } catch (error) {
        console.error(error.message);
      }
    }
  };
  
  
  useEffect(() => {
    if (consulta && Array.isArray(consulta.enfermedades)) {
      setDatosPaciente(consulta.enfermedades);
    }
  }, [consulta]);

  const hayCamposVacios = Object.values(datosPaciente).some(
    (enfermedad) =>
      !enfermedad.nombre ||
      !enfermedad.fechadiagnostico ||
      !enfermedad.tratamiento ||
      enfermedad.guardadoporpaciente ===true|| 
      enfermedad.pacientefechadiagnostico===true
  );
function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}

  const handleChange = (e, enfermedadId) => {
    const { name, value } = e.target;
    setDatosPaciente((prevState) => ({
      ...prevState,
      [enfermedadId]: {
        ...prevState[enfermedadId],
        [name]: value
      }
    }));
  
    setEnfermedadActualId(enfermedadId); // Establecer el ID de la enfermedad actual
  };


 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!nombre) {
        Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el diagnóstico', 'error');
        return;
      }
      if (!fechadiagnostico) {
        Swal.fire('¡Error!', 'Por favor, Agregue fecha del diagnóstico', 'error');
        return;
      }
      if (!tratamiento) {
        Swal.fire('¡Error!', 'Por favor, Agregue un tratamiento.', 'error');
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
  
      await clientAxios.post('/profesional/agregar-enfermedad-paciente', {
        pacienteId: consulta.paciente._id,
        nombre,
        fechadiagnostico,
        tratamiento,
        ultimocontrol,
        obsdiagnostico,
      },config);
      const { data } = await clientAxios.get(
        `/profesional/informacion-paciente-consulta/${id}`,
        config
      );
 
      setConsulta(data);
      setDatosPaciente(data.enfermedades);
      fetchData();
      // Limpiar los campos del formulario
      setNombre('');
      setFechadiagnostico('');
      setTratamiento('');
      setUltimoControl('');
      setObsdiagnostico('');
      setMostrarFormulario(false)

      // Mostrar mensaje de éxito o redireccionar a otra página
      Swal.fire('¡Perfecto!', 'Diangóstico actualizado con éxito', 'success');
    } catch (error) {
      console.log(error);
      // Mostrar mensaje de error
      Swal.fire('¡Error!', 'No se puede guardar el diagnóstico', 'error');
    }
  };
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
  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setOcultarSeccion(true)
  };
  const VerFormularioCerrado = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));

  return (
    <>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="mx-auto max-w-7xl rounded-md border py-2 ">
            <div className="flex justify-start gap-2 py-1 px-4 rounded-t-lg bg-lila-300">
              <div>
              {consulta.paciente?.historiaclinica?.enfermedad==='No' && !datosPaciente.length || consulta.paciente?.historiaclinica?.enfermedad==='Sin datos' && !datosPaciente.length ||consulta.paciente?.historiaclinica?.enfermedad==='Si' && !datosPaciente.length  ?
   <h1 className="text-white font-semibold mt-0.5 text-sm">Antecedentes mórbidos:</h1>:<h1 className="text-white font-semibold text-sm">Antecedentes mórbidos{` (${consulta.enfermedades.length})`} </h1>}
              </div>
              <div className="">
{consulta.paciente?.historiaclinica?.enfermedad==='No' && !datosPaciente.length ?
  <h1 className=" text-white">No</h1>
:''}
 {consulta.paciente?.historiaclinica?.enfermedad==='Sin datos' && !datosPaciente.length?
  <h1 className=" text-white">Sin datos</h1>
:''}
    {consulta.paciente?.historiaclinica?.enfermedad==='Si' && !datosPaciente.length?
  <h1 className=" text-white">Si</h1>
:''}

</div>
{consulta.paciente?.historiaclinica?.enfermedad==='No' && !datosPaciente.length || consulta.paciente?.historiaclinica?.enfermedad==='Sin datos' && !datosPaciente.length ||consulta.paciente?.historiaclinica?.enfermedad==='Si' && !datosPaciente.length  ?
''
            : <div>
            <button
              className="rounded-md inline-flex space-x-1 items-center text-white hover:text-white hover:bg-indigo-500"
              onClick={() => {setOcultarSeccion(!ocultarseccion); setMostrarFormulario(false);} }>
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

<div className="border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50 ">
{consulta.enfermedades.length ? 
<div> 
{Object.keys(datosPaciente).map((enfermedadId, index) => {
const numeroEnumeracion = index + 1;
  const enfermedad = datosPaciente[enfermedadId];
  const CamposVacios =
  !enfermedad.nombre ||
  !enfermedad.fechadiagnostico ||
  enfermedad.guardadoporpaciente ===true ||
  enfermedad.pacientefechadiagnostico===true;
  const nombreVacio = !enfermedad.nombre  || enfermedad.guardadoporpaciente ===true;
  const fechadiagnosticavacia = !enfermedad.fechadiagnostico ||  enfermedad.guardadoporpaciente ===true;
  const tratamientovacio = !enfermedad.tratamiento;
  const isEnfermedadOculta = ocultarEnfermedad[enfermedadId] || false;
  const GenerarSolicitudExamen = async (e) => {
    e.preventDefault();

    try {
      if (!nombreExamen) {
        Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el diagnóstico', 'error');
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
  
      await clientAxios.post('/profesional/agregar-solicitud-examen', {
        pacienteId: consulta.paciente._id,
        nombreExamen,
        enfermedadIdSeleccionada
      },config);
      const { data } = await clientAxios.get(
        `/profesional/informacion-paciente-consulta/${id}`,
        config
      );
 
      setConsulta(data);
      setDatosPaciente(data.examenes);
      setNombreExamen('');
      // Mostrar mensaje de éxito o redireccionar a otra página
      Swal.fire('¡Perfecto!', 'La solicitud de examen fue creada', 'success');
    } catch (error) {
      console.log(error);
      // Mostrar mensaje de error
      Swal.fire('¡Error!', 'No se puede generar la solicitud', 'error');
    }
  };
  const handleModalOpen = (enfermedadId) => {
    setModalOpen(enfermedadId);
    // Obtener el ID de la enfermedad y almacenarlo en el estado
  const enfermedad = datosPaciente[enfermedadId];
  if (enfermedad) {
    setEnfermedadIdSeleccionada(enfermedad._id);
  }
  };

  return (
<div className="border-b border-b-indigo-200" key={enfermedadId}>
  <div className="container mx-auto p-1">
  <div className="grid grid-cols-2 items-center  ">
  <div className="flex justify-start gap-2 ">
    <div className="">
    <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
    </div>
    <div>
    <h2 className="text-md font-regular">
    {enfermedad.nombre}:
    </h2>
      </div>
      <div>
    <h2 className="text-md font-regular">
    {enfermedad.guardadoporpaciente ===false ? ` (${enfermedad.fechadiagnostico}) `  : ` (${enfermedad.fechadiagnostico}) ` } 
    
    </h2>
      </div>

    {CamposVacios && (
         <div className="flex mt-1">
      <p className="text-red-500 text-md"><FaExclamation className="animate-pulso text-xl" /></p>
      </div>
    )}
    <div>

    <button
      className="text-blue-500 focus:outline-none"
      onClick={() => toggleEnfermedad(enfermedadId)}
    >
      {isEnfermedadOculta ? (
        <p className="text-3xl">< MdKeyboardArrowDown/></p>
      ) : (
        <p className="text-3xl"><MdKeyboardArrowRight /></p>
      )}
    </button>
    </div>


  </div>


</div>
        {isEnfermedadOculta && (
          <>
   {showButton ? (
  <div className="grid grid-cols-1 sm:grid-cols-1 gap-1">
    <div className="flex flex-col text-sm">
  <div className="flex items-center">
    <label htmlFor="nombre">Nombre del diagnóstico:</label>
    {nombreVacio && (
      <span className="text-red-500 text-md">
        <FaExclamation className="animate-pulso text-lg" />
      </span>
    )}
    <input
      key={enfermedadId}
      type="text"
      className={`border px-2 py-1.5 rounded-lg ml-2 flex-grow ${enfermedad.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
      name="nombre"
      placeholder="Nombre exacto del diagnóstico"
      value={enfermedad.nombre || ''}
      onChange={(e) => handleChange(e, enfermedadId)}
    />
  </div>
</div>
      <div className="flex flex-col text-sm">
        <div className="flex items-center">
        <label htmlFor="fechadiagnostico" className={` ${enfermedad.pacientefechadiagnostico===true ? 'text-gray-600' : 'text-black'}`}> Año del diagnóstico: {enfermedad.pacientefechadiagnostico===true ? enfermedad.fechadiagnostico : '' }</label>
        {fechadiagnosticavacia && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
<input
  key={enfermedadId}
  type="text"
  pattern="^[0-9]*$" 
  className={`border px-2 py-1.5 rounded-lg ml-6 flex-grow ${enfermedad.guardadoporpaciente ? 'text-gray-600' : 'text-black' }`}
  name="fechadiagnostico"
  placeholder="Agrega el año del diagnóstico"
  value={enfermedad.fechadiagnostico || ''}
  onChange={(e) =>
  {  
    const re = /^[0-9\b]+$/; // Expresión regular que acepta solo números
    if (e.target.value === '' || re.test(e.target.value)) {
      handleChange(e, enfermedadId)
  }
}}

/>

</div>
      </div>
      <div className="flex flex-col  text-sm">
        <div className="flex items-center">
        <label htmlFor="ultimocontrol" className="mb-2">Último control:</label>
        <input
          key={enfermedadId}
          type="date"
          className={`border px-2 py-1.5 rounded-lg ml-16 flex-grow ${enfermedad.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
          name="ultimocontrol"
          value={enfermedad.ultimocontrol || null}
          onChange={(e) => handleChange(e, enfermedadId)}
        />
        </div>

      </div>

      <div className="flex flex-col text-sm">
        <div className="flex items-center">
        <label htmlFor="tratamiento" className="mb-2">Tratamiento:</label>
        {tratamientovacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
                        <textarea
          key={enfermedadId}
          type="text"
          className={`border px-2 py-2 rounded-lg ml-20 flex-grow ${enfermedad.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
          name="tratamiento"
          placeholder="Tratamiento para este diagnóstico"
          value={enfermedad.tratamiento || ''}
          onChange={(e) => handleChange(e, enfermedadId)}
        />
        </div>

      </div>
      <div className="flex flex-col text-sm">
        <div className="flex items-center">
        <label htmlFor="obsdiagnostico" className="mb-2">Observaciones diagnóstico:</label>
        <textarea
          key={enfermedadId}
          type="text"
          className={`border px-2 py-2 rounded-lg ml-1 flex-grow ${enfermedad.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
          name="obsdiagnostico"
          placeholder="Agregar recomendaciones o información relevante"
          value={enfermedad.obsdiagnostico || ''}
          onChange={(e) => handleChange(e, enfermedadId)}
        />
        </div>
      </div>
      </div>
      ) : (
        <div className="flex flex-col text-sm gap-1">
        <div className="flex items-center  gap-1">
          <label htmlFor="nombre" className="font-bold">Nombre del diagnóstico:</label>
          {nombreVacio && (
            <span className="text-red-500 text-md">
              <FaExclamation className="animate-pulso text-lg" />
            </span>
          )}
          <label>{enfermedad.nombre||''} </label>
        </div>
        <div className="flex items-center gap-1">
          <label
            htmlFor="fechadiagnostico"
            className={`font-bold ${
              enfermedad.pacientefechadiagnostico === true
                ? "text-gray-600"
                : "text-black"
            }`}
          >
            Año del diagnóstico:{"  "}
            {enfermedad.pacientefechadiagnostico === true
              ? enfermedad.fechadiagnostico
              : ""}
          </label >

          <label>{enfermedad.fechadiagnostico||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="ultimocontrol" className="font-bold">
            Último control:
          </label>
          <label>{enfermedad.ultimocontrol||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="tratamiento" className="font-bold">
            Tratamiento:
          </label>

          <label >{enfermedad.tratamiento||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="obsdiagnostico" className="font-bold">
            Observaciones diagnóstico:
          </label>
          <label>{enfermedad.obsdiagnostico||''}</label>
        </div>
      </div>
    )}
    <div className="flex justify-center py-2">   
        {showButton && (
                <button onClick={actualizarPaciente} className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
                Actualizar
              </button>
    )}
      </div>
      <div className="flex justify-start">
      <button
  className="px-1 py-1 bg-lila-200 hover:bg-lila-100 rounded-md text-sm text-white"
  onClick={() => handleModalOpen(enfermedadId)}
>
  Registro relacionado
</button>
        </div>
      </>
        )}
  </div>
  {modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-gray-900 bg-opacity-25 absolute inset-0"></div>
    <div className="grid grid-cols-1 gap-4 bg-white rounded-lg shadow-lg pt-0 pb-10 pl-10 pr-10 z-10">
      <div>
      <div className="flex justify-end">
          <button
            className="px-2 py-1 mt-4 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm"
            onClick={() => setModalOpen(null)}
          >
            X
          </button>
        </div>
        {/* Parte derecha con la tabla de exámenes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
          Registro relacionado
        </h2>
{Object.keys(datosPaciente).map((enfermedadId) => {
  const enfermedad = datosPaciente[enfermedadId];

  if (enfermedadId === modalOpen) {
    const examenesFiltrados = consulta.examenes.filter((examen) => examen.enfermedad === enfermedad._id);

    return (
      <div key={enfermedadId}>
        <h3 className="text-lg font-semibold text-gray-600">Antecedente mórbido: {enfermedad.nombre}</h3>
        {examenesFiltrados.length === 0 ? (
          <p className=" text-lila-300">Aún no hay exámenes para este diagnóstico</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-purple-200">
                <th className="border px-4 py-2">Nombre del examen</th>
                <th className="border px-4 py-2">Estado</th>
                <th className="border px-4 py-2">Documento</th>
              </tr>
            </thead>
            <tbody>
              {examenesFiltrados.map((examen) => (
                <tr key={examen._id} className="border">
                  <td className="border px-4 py-2">{examen.nombre}</td>
                  <td className="border px-4 py-2">
                    {examen.estado ? (
                      <p className="text-green-500">Disponible</p>
                    ) : (
                      <p className="text-yellow-500">Pendiente</p>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {examen.documento?.secure_url ? (
                      <a
                        href={examen.documento.secure_url}
                        download="nombre_del_archivo"
                        className="bg-lila-200 hover:bg-lila-100 text-white font-nunito font-semibold py-2 px-4 rounded inline-flex items-center"
                      >
                        Descargar Examen 📥
                      </a>
                    ) : (
                      'Aún no se ha subido el examen'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return null;
})}
</div>

      </div>
    </div>
  </div>
)}




</div>

  );

})}
</div>
: 
' '}
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
    >
      {mostrarFormulario ? (
        <div className="flex">
          <IoMdCloseCircle className="text-2xl" />
        </div>
      ) : (
        <div className="flex">
          <MdAddCircle className="text-2xl" />
        </div>
      )}
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

      <form className="p-2 " onSubmit={handleSubmit}>
    <h1 className=" text-center text-xl font-bold p-2">Nuevo diagnóstico</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className="mb-2 ">Nombre del diagnóstico</label>
        <input
  type="text"
  className="border px-4 py-2 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Nombre exacto del diagnóstico"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="fechadiagnostico"className="mb-2 ">Año del diagnóstico:</label>
        <input
  type="text" 
  id="fechadiagnostico"
  placeholder="Agrega el año del diagnóstico"
  className="border px-4 py-2 rounded-lg w-full "
  value={fechadiagnostico}
  onChange={(e) =>
    {  
      const re = /^[0-9\b]+$/; // Expresión regular que acepta solo números
      if (e.target.value === '' || re.test(e.target.value)) {
        setFechadiagnostico(e.target.value)
    }
  }}
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="ultimocontrol"className="mb-2 ">Último control:</label>
        <input
  type="date" 
  id="ultimocontrol"
  className="border px-4 py-2 rounded-lg w-full "
  value={ultimocontrol}
  onChange={(e) => setUltimoControl(e.target.value)} 
/>
      </div>
    </div>

    <div className="flex flex-col text-sm">
        <label htmlFor="tratamiento" className="mb-2">Tratamiento:</label>
        <textarea
          type="text"
          id="tratamiento"
          className="border px-4 py-2 rounded-lg w-full"
          value={tratamiento}
          placeholder="Tratamiento para este diagnóstico"
          onChange={(e) => setTratamiento(e.target.value)} 
        />
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="obsdiagnostico" className="mb-2">Observaciones diagnóstico:</label>
        <textarea
          type="text"
          id="obsdiagnostico"
          className="border px-4 py-2 rounded-lg w-full"
          placeholder="Agregar recomendaciones o información relevante"
          value={obsdiagnostico} 
          onChange={(e) => setObsdiagnostico(e.target.value)} 
        />
      </div>

    <div className="flex justify-center py-2">
        <button  type="submit" className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-2 px-4 rounded-lg">
         Guardar
        </button>
        
      </div>

  </form>
  </div>
        </div>
      )}
    </>
  );
};

export default FormularioDiagnosticos;
