import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";
import moment from "moment";
const FormularioTratamientofarmaco = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [enfermedades, setEnfermedades] = useState([]);
    const [datosPaciente, setDatosPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [ocultarseccion, setOcultarSeccion] = useState(false);
    const [ocultarFarmaco, setOcultarFarmaco] = useState({});
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarFormularioprevio, setMostrarFormularioprevio] = useState(false);
    const [farmacoActualId, setFarmacoActualId] = useState(null);
    const [loadingEnfermedades, setLoadingEnfermedades] = useState(true);
    const [nombre, setNombre] = useState('');
    const [horario, setHorario] = useState('');
    const [dosis, setDosis] = useState('');
    const [tipo, setTipo] = useState('');
    const [tipodeuso, setTipodeuso] = useState('');
    const [duracion, setDuracion] = useState('');
    const [formato, setFormato] = useState('');
    const [enfermedadId, setEnfermedadId] = useState('');
    const [nombreprevio, setNombreprevio] = useState('');
    const [motivosuspencion, setMotivosuspencion] = useState('');
    const toggleFarmaco = (farmacoId) => {
        setOcultarFarmaco((prevOcultarFarmaco) => ({
          ...prevOcultarFarmaco,
          [farmacoId]: !prevOcultarFarmaco[farmacoId]
        }));
      };
      const cerrarModal = () => {
        setMostrarFormulario(false);
      };
      const cerrarModalprevio = () => {
        setMostrarFormularioprevio(false);
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


      useEffect(() => {
        if (consulta && Array.isArray(consulta.farmaco)) {
          setDatosPaciente(consulta.farmaco);
        }
      }, [consulta]);
      const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
      const toggleFormularioprevio = () => {
        setMostrarFormularioprevio(!mostrarFormularioprevio);
      };
      const hayCamposVacios = Object.values(datosPaciente).some(
        (farmaco) =>
        !farmaco.nombre||
        !farmaco.horario ||
        !farmaco.dosis ||
        !farmaco.duracion || 
        !farmaco.formato || 
        !farmaco.tipo || 
        !farmaco.tipodeuso || 
        farmaco.guardadoporpaciente ===true
      );
      const actualizarPaciente = async () => {
        const confirmar = await Swal.fire({
          title: '¿Estas seguro de actualizar este tratamiento?',
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
        if (!tokenPro || !farmacoActualId) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
      
        try {
          const farmaco = datosPaciente[farmacoActualId];
      
          await clientAxios.put(`/profesional/editar-farmacos-paciente/${farmaco._id}`, farmaco, config);
          // Obtener los datos actualizados después de la actualización
          fetchData();
          Swal.fire('¡Perfecto!', 'Tratamiento actualizado con éxito', 'success');
        } catch (error) {
          console.error(error.message);
        }
      }
      };
      const handleChange = (e, farmacoId) => {
        const { name, value } = e.target;
        setDatosPaciente((prevState) => ({
          ...prevState,
          [farmacoId]: {
            ...prevState[farmacoId],
            [name]: value
          }
        }));
        setFarmacoActualId(farmacoId); // Establecer el ID del tratamiento actual
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
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (!nombre) {
            Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el farmaco', 'error');
            return;
          }
          if (!horario) {
            Swal.fire('¡Error!', 'Por favor, Agregue horario para este medicamento', 'error');
            return;
          }
          if (!dosis) {
            Swal.fire('¡Error!', 'Por favor, Agregue una dosis.', 'error');
            return;
          }
          if (!duracion) {
            Swal.fire('¡Error!', 'Por favor, Agregue duración para este medicamento', 'error');
            return;
          }
          if (!formato) {
            Swal.fire('¡Error!', 'Por favor, Agregue el formato para este medicamento', 'error');
            return;
          }
          if (!tipo) {
            Swal.fire('¡Error!', 'Por favor, Agregue un tipo de tratamiento (Agudo o Crónico)', 'error');
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
          await clientAxios.post('/profesional/agregar-farmaco-paciente', {
            enfermedad: enfermedadId,
            nombre,
            horario,
            dosis,
            duracion,
            formato,
            tipo,
            tipodeuso,
            pacienteId: consulta.paciente._id,
          },config);
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );

          setConsulta(data);
          setDatosPaciente(data.farmaco);
          // Obtener los datos actualizados después de la actualización
          fetchData();
          setNombre('');
          setHorario('');
          setDosis('');
          setDuracion('');
          setFormato('');
          setTipo('')
          setTipodeuso('')
          setEnfermedadId({});
          setMostrarFormulario(false)
          // Mostrar mensaje de éxito o redireccionar a otra página
          Swal.fire('¡Perfecto!', 'Farmaco actualizado con éxito', 'success');
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se puede guardar el farmaco', 'error');
        }
      };
      const Agregarfarmacoprevio = async (e) => {
        e.preventDefault();
        try {
          if (!nombreprevio) {
            Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el farmaco suspendido', 'error');
            return;
          }
          if (!motivosuspencion) {
            Swal.fire('¡Error!', 'Por favor, Agregue un motivo de suspención para este medicamento', 'error');
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
          await clientAxios.post('/profesional/agregar-farmaco-previo-paciente', {
            nombre:nombreprevio,
            motivosuspencion,
            pacienteId: consulta.paciente._id,
          },config);
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );

          setConsulta(data);
          setDatosPaciente(data.farmacoprevio);
           // Obtener los datos actualizados después de la actualización
          fetchData();
          setNombreprevio('');
          setMotivosuspencion('');
          setEnfermedadId({});
          setMostrarFormulario(false)
          // Mostrar mensaje de éxito o redireccionar a otra página
          Swal.fire('¡Perfecto!', 'Farmaco actualizado con éxito', 'success');
          window.location.reload();
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se puede guardar el farmaco suspendido', 'error');
        }
      };
      const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));
      const VerFormularioCerrado = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
      const VerFormularioCerradoprevio = () => {
        setMostrarFormularioprevio(!mostrarFormularioprevio);
      };
  return (
    <>
          {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
        <div className="mx-auto max-w-7xl rounded-md border  mb-2">
        <div className="flex justify-start gap-2 py-1 px-4  rounded-t-lg bg-lila-300">
              <div>
              {consulta.paciente?.historiaclinica?.farmaco==='No' && !datosPaciente.length || consulta.paciente?.historiaclinica?.farmaco==='Sin datos' && !datosPaciente.length ||consulta.paciente?.historiaclinica?.farmaco==='Si' && !datosPaciente.length  ?
   <h1 className="text-white font-semibold mt-0.5 text-sm">
   Tratamientos farmacológicos: </h1>:<h1 className="text-white font-semibold text-sm">Tratamientos farmacológicos {`(${consulta.farmaco.length})`} </h1>}

              </div>
              <div>
{consulta.paciente?.historiaclinica?.farmaco==='No' && !datosPaciente.length ? 
  <h1 className=" text-white">No</h1>
:''}
{consulta.paciente?.historiaclinica?.farmaco==='Sin datos' && !datosPaciente.length?
 <h1 className=" text-white">Sin datos</h1>
:''}
{consulta.paciente?.historiaclinica?.farmaco==='Si' && !datosPaciente.length?
 <h1 className=" text-white">Si</h1>
:''}
</div>
{consulta.paciente?.historiaclinica?.farmaco==='No' && !datosPaciente.length  || consulta.paciente?.historiaclinica?.farmaco==='Sin datos' && !datosPaciente.length ||consulta.paciente?.historiaclinica?.farmaco==='Si' && !datosPaciente.length  ?
'': <div>
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
        <div className="border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50 ">
        {consulta.farmaco.length ? 
        <div>
        {Object.keys(datosPaciente).map((farmacoId, index) => {
        const numeroEnumeracion = index + 1;
        const farmaco = datosPaciente[farmacoId];
        const CamposVacios =
        !farmaco.nombre||
        !farmaco.horario ||
        !farmaco.dosis ||
        !farmaco.duracion || 
        !farmaco.formato || 
        !farmaco.tipo || 
        !farmaco.tipodeuso || 
        farmaco.guardadoporpaciente ===true;
        const nombreVacio = !farmaco.nombre  || farmaco.guardadoporpaciente ===true;
        const horarioVacio = !farmaco.horario;
        const dosisVacio = !farmaco.dosis;
        const duracionVacio = !farmaco.duracion;
        const formatoVacio = !farmaco.formato;
        const tipoVacio = !farmaco.tipo;
        const tipodeusoVacio = !farmaco.tipodeuso;
        const isFarmacoOculto = ocultarFarmaco[farmacoId] || false;
return (
<div className="border-b border-b-indigo-200" key={farmacoId}>
<div className="container mx-auto p-1">
<div className="grid grid-cols-10 items-center ">
  <div className="col-span-9 flex justify-start gap-2 ">
    <div className="">
    <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
    </div>
    <div className="flex gap-1">
      <p className="text-md font-regular">
        {farmaco.nombre}:
      </p>
      <p className="text-sm mt-1 font-regular">
        {farmaco.formato ? `${farmaco.formato}` : ''}
      </p>
      <p className="text-sm mt-1 font-regular">
        {farmaco.dosis ? `${farmaco.dosis}` : ''}
      </p>
      <p className="text-sm mt-1 font-regular">
        {farmaco.horario ? `${farmaco.horario}` : ''}
      </p>
      <p className="text-sm  mt-1 font-regular">
        {farmaco.duracion ? `${farmaco.duracion}` : ''}
      </p>
      <p className="text-sm mt-1  font-regular">
        {farmaco.tipodeuso ? `${farmaco.tipodeuso}` : ''}
      </p>
    </div>

    {CamposVacios && (
      <div className="flex mt-1">
        <p className="text-red-500 text-md">
          <FaExclamation className="animate-pulso text-xl" />
        </p>
      </div>
    )}
    <div>
    <button
      className="text-blue-500 focus:outline-none"
      onClick={() => toggleFarmaco(farmacoId)}
    >
      {isFarmacoOculto ? (
        <p className="text-3xl">
          <MdKeyboardArrowDown />
        </p>
      ) : (
        <p className="text-3xl">
          <MdKeyboardArrowRight />
        </p>
      )}
    </button>
    </div>
  </div>

</div>
      {isFarmacoOculto && (
        <>
    {showButton ? (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="nombre" className=" ">Nombre del Farmaco</label>
      {nombreVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
key={farmacoId}
type="text"
className={`border px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="nombre"
placeholder="Ej:Paracetamol"
value={farmaco.nombre || ''}
onChange={(e) => handleChange(e, farmacoId)}
/>
    </div>
    <div className="flex flex-col text-sm">
        <div className="flex">
        <label htmlFor="horario" className=" ">Hora de consumo</label>
      {horarioVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
    <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        placeholder="Ej:Consumir cada 8 Horas"
        name="horario"
        value={farmaco.horario || ''}
        onChange={(e) => handleChange(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col  text-sm">
      
      <div className="flex">
      <label htmlFor="dosis" className="">Dosis</label>
      {dosisVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="dosis"
        placeholder="Ej: 800 ml"
        value={farmaco.dosis || ''}
        onChange={(e) => handleChange(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col  text-sm">
      
      <div className="flex">
      <label htmlFor="dosis" className="">Tipo de uso</label>
      {tipodeusoVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="tipodeuso"
        placeholder="Ej: Solo en episodios de dolor"
        value={farmaco.tipodeuso || ''}
        onChange={(e) => handleChange(e, farmacoId)}
      />
    </div>
  </div>
    ) : (
      <div className="flex flex-col text-sm gap-1">
      <div className="flex items-center  gap-1">
        <label htmlFor="nombre" className="font-bold">Nombre del farmaco:</label>
        <label>{farmaco.nombre||''}  </label>
      </div>
      <div className="flex items-center  gap-1">
        <label htmlFor="ultimocontrol" className="font-bold">
          Hora de consumo:
        </label>
        <label>{farmaco.horario||''}</label>
      </div>
      <div className="flex items-center  gap-1">
        <label htmlFor="tratamiento" className="font-bold">
            Dosis:
        </label>
        <label >{farmaco.dosis||''}</label>
      </div>
      <div className="flex items-center  gap-1">
        <label htmlFor="obsdiagnostico" className="font-bold">
        Tipo de uso:
        </label>
        <label>{farmaco.tipodeuso||''}</label>
      </div>
    </div>
  )}

{showButton ? (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-2">
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="duracion" className="">Duración</label>
      {duracionVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="duracion"
        placeholder="Ej: Durante 6 días"
        value={farmaco.duracion || ''}
        onChange={(e) => handleChange(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="formato" className="">Tipo de presentación</label>     
       {formatoVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="formato"
        placeholder="Ej: Tabletas"
        value={farmaco.formato || ''}
        onChange={(e) => handleChange(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col text-sm">
    <div className="flex">
    <label htmlFor="tipo" className="">
    Tipo de tratamiento
  </label>     
       {tipoVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>

  <select
    key={farmacoId}
    className="border px-2 py-1 rounded-lg w-full"
    name="tipo"
    placeholder="Ej: Tratamiento Agudo"
    value={farmaco.tipo || ''}
    onChange={(e) => handleChange(e, farmacoId)}
  >
    <option value="">Seleccione una opción</option>
    <option value="Agudo">Tratamiento agudo</option>
    <option value="Cronico">Tratamiento Crónico</option>
  </select>
</div>
    <div className="flex flex-col text-sm">
  <label htmlFor="enfermedad" className="">Asociar a</label>
  {loadingEnfermedades ? (
    <span>Cargando...</span>
  ) : (
    <select
      className="border  px-2 py-1 rounded-lg w-full"
      name="enfermedad"
      value={farmaco.enfermedad || ''}
      onChange={(e) => handleChange(e, farmacoId)}
    >
      <option value={null}>Sin enfermedad</option>
      {enfermedades.map((enfermedad) => (
        <option key={enfermedad._id} value={enfermedad._id}>{enfermedad.nombre}</option>
      ))}
    </select>
  )}
</div>

  </div>
      ) : (
        <div className="flex flex-col text-sm gap-1">
        <div className="flex items-center  gap-1">
          <label htmlFor="nombre" className="font-bold">Duración:</label>
          <label>{farmaco.duracion||''}  </label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="ultimocontrol" className="font-bold">
          Tipo de presentación:
          </label>
          <label>{farmaco.formato||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="tratamiento" className="font-bold">
          Tipo de tratamiento:
          </label>
          <label >{farmaco.tipo||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="obsdiagnostico" className="font-bold">
          Enfermedad asociada:
          </label>
          <label>{farmaco.enfermedad||''}</label>
        </div>
      </div>
    )}

  <div className="flex justify-center">
    {showButton && (
      <button onClick={actualizarPaciente} className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
        Actualizar 
      </button>
    )}
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
        {showButton  && (
    <button onClick={VerFormularioCerrado}
    className="text-sm rounded-full focus:outline-none focus:border-lila-200 text-white bg-lila-100 hover:bg-lila-100 hover:text-lila-200"
    style={{ position: 'absolute', top: '-10px' }}>
    { mostrarFormulario ?  <div className="flex"> 
 < IoMdCloseCircle className="text-2xl"/>
 </div>  :<div className="flex"> 
      <MdAddCircle className="text-2xl"/> 
      </div> }
  </button>
    )}
    </div>
    {showButton  && (
    <div className="relative ml-10">
  {consulta.farmacoprevio.length ? (
    ''
  ) : (
    
    <button
      onClick={VerFormularioCerradoprevio}
      className="text-sm rounded-full focus:outline-none focus:border-lila-200 text-white bg-lila-100 hover:bg-lila-100 hover:text-lila-200"
      style={{ position: 'absolute', top: '-18px' }}
    >
      {mostrarFormularioprevio ? (
        <div className="flex">
          <IoMdCloseCircle className="text-2xl" />
        </div>
      ) : (
        <div className="flex">
          <MdAddCircle className="text-2xl" />{' '}
          <p className="text-xs px-1 mt-1">Tratamiento suspendido</p>
        </div>
      )}
    </button>
  )}
</div>
    )}


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
    <h1 className=" text-center text-xl font-bold p-1">Tratamiento farmacológico</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className=" ">Nombre del farmaco:</label>
        <input
  type="text"
  className="border  px-2 py-1 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Ej:Paracetamol"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="horario"className=" ">Hora de consumo:</label>
        <input
  type="text" 
  id="horario"
  placeholder="Ej:Consumir cada 8 Horas"
  className="border  px-2 py-1 rounded-lg w-full "
  value={horario}
  onChange={(e) => setHorario(e.target.value)}
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="dosis"className="">Dosis:</label>
        <input
  type="text" 
  id="dosis"
  placeholder="Ej: 800 ml"
  className="border  px-2 py-1 rounded-lg w-full "
  value={dosis}
  onChange={(e) => setDosis(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="tipodeuso"className="">Tipo de uso:</label>
        <input
  type="text" 
  id="tipodeuso"
  placeholder="Ej:Solo en episodios de dolor"
  className="border  px-2 py-1 rounded-lg w-full "
  value={tipodeuso}
  onChange={(e) => setTipodeuso(e.target.value)} 
/>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-1">

    <div className="flex flex-col text-sm">
        <label htmlFor="duracion" className="">Duración:</label>
        <input
          type="text"
          id="duracion"
          placeholder="Ej: Durante 6 días"
          className="border  px-2 py-1 rounded-lg w-full"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)} 
        />
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="formato" className="">Formato:</label>
        <input
          type="text"
          id="formato"
          placeholder="Ej: Tabletas"
          className="border  px-2 py-1 rounded-lg w-full"
          value={formato} 
          onChange={(e) => setFormato(e.target.value)} 
        />
      </div>
      <div className="flex flex-col text-sm">
  <label htmlFor="formato" className="">
    Tipo de tratamiento:
  </label>
  <select
    className="border px-2 py-1 rounded-lg w-full"
    value={tipo}
    onChange={(e) => setTipo(e.target.value)}
  >
    <option value="">Seleccione una opción</option>
    <option value="Agudo">Tratamiento agudo</option>
    <option value="Cronico">Tratamiento Crónico</option>
  </select>
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
    <div className="flex justify-center ">
        <button  type="submit" className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
         Guardar
        </button>
      </div>

  </form>
  </div>
        </div>
)}
      {mostrarFormularioprevio && (
      <div className="fixed inset-0 flex  items-center justify-center z-50">
      <div
        className="bg-gray-800 bg-opacity-75  absolute inset-0 pointer-events-none"
        onClick={cerrarModalprevio}
      ></div>
      <div className="bg-white rounded-lg p-6 relative w-96 ">
        <button onClick={cerrarModalprevio} className="absolute top-0 right-0 p-2 ">
        < IoMdCloseCircle className="text-3xl text-lila-300  hover:text-lila-100 "/>
        </button>
  <form className="p-2" onSubmit={Agregarfarmacoprevio}>
    <h1 className=" text-center text-xl font-bold p-1">Tratamiento farmacológico suspendido</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className=" ">Nombre del farmaco suspendido:</label>
        <input
  type="text"
  className="border  px-2 py-1 rounded-lg w-full "
  name="nombreprevio"
  id="nombreprevio" 
  placeholder="Ej:Paracetamol"
  value={nombreprevio}
  onChange={(e) => setNombreprevio(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="motivosuspencion"className=" ">Motivo de suspención:</label>
        <input
  type="text" 
  id="motivosuspencion"
  placeholder="Ej:Suspendido por mala tolerancia"
  className="border  px-2 py-1 rounded-lg w-full "
  value={motivosuspencion}
  onChange={(e) => setMotivosuspencion(e.target.value)}
/>
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

export default FormularioTratamientofarmaco