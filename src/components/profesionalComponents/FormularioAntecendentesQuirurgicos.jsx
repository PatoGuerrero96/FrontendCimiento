import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";
import moment from "moment";
const FormularioAntecedentesQuirurgicos = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [enfermedades, setEnfermedades] = useState([]);
    const [datosPaciente, setDatosPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [ocultarseccion, setOcultarSeccion] = useState(false);
    const [ocultarQuirurgico, setOcultarquirurgico] = useState({});
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [quirurgicoActualId, setQuirurgicoActualId] = useState(null);
    const [loadingEnfermedades, setLoadingEnfermedades] = useState(true);
    const [nombre, setNombre] = useState('');
    const [anio, setAnio] = useState('');
    const [enfermedadId, setEnfermedadId] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [quirurgicoIdSeleccionada, setQuirurgicoIdSeleccionado] = useState(null);
    const toggleQuirurgico = (quirurgicoId) => {
        setOcultarquirurgico((prevOcultarQuirurgico) => ({
          ...prevOcultarQuirurgico,
          [quirurgicoId]: !prevOcultarQuirurgico[quirurgicoId]
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


      useEffect(() => {
        if (consulta && Array.isArray(consulta.quirurgico)) {
          setDatosPaciente(consulta.quirurgico);
        }
      }, [consulta]);
      const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
      const hayCamposVacios = Object.values(datosPaciente).some(
        (quirurgico) =>
          !quirurgico.nombre||
          quirurgico.guardadoporpaciente ===true
      );
      const actualizarPaciente = async () => {
        const confirmar = await Swal.fire({
          title: '¿Estas seguro de actualizar este antecedente quirúrgico?',
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
        if (!tokenPro || !quirurgicoActualId) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
      
        try {
          const quirurgico = datosPaciente[quirurgicoActualId];
      
          await clientAxios.put(`/profesional/editar-quirurgicos-paciente/${quirurgico._id}`, quirurgico, config);
          fetchData();
          Swal.fire('¡Perfecto!', 'Antecedente quirúrgico actualizado con éxito', 'success');
        } catch (error) {
          console.error(error.message);
        }
      }
      };
      const handleChange = (e, quirurgicoId) => {
        const { name, value } = e.target;
        setDatosPaciente((prevState) => ({
          ...prevState,
          [quirurgicoId]: {
            ...prevState[quirurgicoId],
            [name]: value
          }
        }));
        setQuirurgicoActualId(quirurgicoId); // Establecer el ID del tratamiento actual
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
            Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el antecedente quirúrgico', 'error');
            return;
          }
          if (!anio) {
            Swal.fire('¡Error!', 'Por favor, Agregue el año de la cirujia', 'error');
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
          await clientAxios.post('/profesional/agregar-quirurgicos-paciente', {
            enfermedad: enfermedadId,
            nombre,
            anio,
            pacienteId: consulta.paciente._id,
          },config);
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );
          setConsulta(data);
          setDatosPaciente(data.quirurgico);
          fetchData();
          setNombre('');
          setAnio('');
          setEnfermedadId({});
          setMostrarFormulario(false)
          // Mostrar mensaje de éxito o redireccionar a otra página
          Swal.fire('¡Perfecto!', 'Antecedente quirúrgico actualizado con éxito', 'success');
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se puede guardar el antecedente quirúrgico', 'error');
        }
      };
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
        <div className="mx-auto max-w-7xl rounded-md border  mb-2">
        <div className="flex justify-start gap-2 py-1 px-4  rounded-t-lg bg-lila-300">
              <div>
              {consulta.paciente?.historiaclinica?.quirurgico==='No' && !datosPaciente.length || consulta.paciente?.historiaclinica?.quirurgico==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.quirurgico==='Si' && !datosPaciente.length  ?
         <h1 className="text-white font-semibold mt-0.5 text-sm">Antecedentes Quirúrgicos: </h1>:<h1 className="text-white font-semibold text-sm">Antecedentes Quirúrgicos {` (${consulta.quirurgico.length})`} 
                </h1>}
       
              </div>
              <div>
{consulta.paciente?.historiaclinica?.quirurgico==='No' && !datosPaciente.length ?
  <h1 className=" text-white">No</h1>
:''}
 {consulta.paciente?.historiaclinica?.quirurgico==='Sin datos' && !datosPaciente.length?
  <h1 className=" text-white">Sin datos</h1>
:''}
    {consulta.paciente?.historiaclinica?.quirurgico==='Si' && !datosPaciente.length?
  <h1 className=" text-white">Si</h1> 
:''}
</div>
{consulta.paciente?.historiaclinica?.quirurgico==='No' && !datosPaciente.length || consulta.paciente?.historiaclinica?.quirurgico==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.quirurgico==='Si' && !datosPaciente.length  ?
'':
              <div>
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
        {consulta.quirurgico.length ? 
        <div>
        {Object.keys(datosPaciente).map((quirurgicoId,index) => {
        const numeroEnumeracion = index + 1;
        const quirurgico = datosPaciente[quirurgicoId];
        const CamposVacios =
        !quirurgico.nombre||
        quirurgico.guardadoporpaciente ===true;
        const nombreVacio = !quirurgico.nombre  || quirurgico.guardadoporpaciente ===true;
        const aniocirujiaVacio = !quirurgico.anio;
        const isQuirurgicoOculto = ocultarQuirurgico[quirurgicoId] || false;
        const handleModalOpen = (quirurgicoId) => {
          setModalOpen(quirurgicoId);
        const quirurgico = datosPaciente[quirurgicoId];
        if (quirurgico) {
          setQuirurgicoIdSeleccionado(quirurgico._id);
          console.log(quirurgicoIdSeleccionada)
        }
        };
return (
<div className="border-b border-b-indigo-200" key={quirurgicoId}>
<div className="container mx-auto p-1">
<div className="grid grid-cols-10 items-center ">
  <div className="col-span-9 flex justify-start gap-2 ">
    <div className="">
    <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
    </div>
    <div className="flex gap-1">
      <p className="text-md font-regular">
        {quirurgico.nombre}:
      </p>
      <p className="text-sm mt-1 font-regular">
        {quirurgico.anio ? `${quirurgico.anio}` : ''}
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
      onClick={() => toggleQuirurgico(quirurgicoId)}
    >
      {isQuirurgicoOculto ? (
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
      {isQuirurgicoOculto && (
        <>
         {showButton ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 ">
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="nombre" className=" ">Procedimiento quirúrgico:</label>
      {nombreVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
key={quirurgicoId}
type="text"
className={`border px-2 py-1 rounded-lg w-full ${quirurgico.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="nombre"
placeholder="Ej:Apendicectomía"
value={quirurgico.nombre || ''}
onChange={(e) => handleChange(e, quirurgicoId)}
/>
    </div>
    <div className="flex flex-col text-sm">
  <div className="flex">
    <label htmlFor="nombre">Año de la cirugía:</label>
    {aniocirujiaVacio && (
      <span className="text-red-500 text-md">
        <FaExclamation className="animate-pulso text-lg" />
      </span>
    )}
  </div>
  <input
    key={quirurgicoId}
    type="text"
    className={`border px-2 py-1 rounded-lg w-full ${
      quirurgico.guardadoporpaciente ? 'text-gray-600' : 'text-black'
    }`}
    name="anio"
    placeholder="Ej: 2018"
    value={quirurgico.anio || ''}
    onChange={(e) => {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        handleChange(e, quirurgicoId);
      }
    }}
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
      value={quirurgico.enfermedad || ''}
      onChange={(e) => handleChange(e, quirurgicoId)}
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
      <label htmlFor="nombre" className="font-bold">Procedimiento quirúrgico:</label>
      <label>{quirurgico.nombre || ''} </label>
    </div>
    <div className="flex items-center  gap-1">
      <label htmlFor="ultimocontrol" className="font-bold">
      Año de la cirugía:
      </label>
      <label>{quirurgico.anio||''}</label>
    </div>

    <div className="flex items-center  gap-1">
      <label htmlFor="ultimocontrol" className="font-bold">
      Enfermedad asociada:
      </label>
      <label>{quirurgico.enfermedad ||''}</label>
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
            onClick={() => handleModalOpen(quirurgicoId)}
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
                    Exámenes relacionados
                  </h2>
          {Object.keys(datosPaciente).map((quirurgicoId) => {
            const quirurgico = datosPaciente[quirurgicoId];
          
            if (quirurgicoId === modalOpen) {
              const examenesFiltrados = consulta.examenes.filter((examen) => examen.quirurgico === quirurgico._id);
          
              return (
                <div key={quirurgicoId}>
                  <h3 className="text-lg font-semibold text-gray-600">Antecedente quirúrgico: {quirurgico.nombre}</h3>
                  {examenesFiltrados.length === 0 ? (
                    <p className=" text-lila-300">Aún no hay exámenes para este antecedente</p>
                  ) : (
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-purple-200">
                          <th className="border px-4 py-2">Nombre del examen</th>
                          <th className="border px-4 py-2">Enfermedad asociada</th>
                          <th className="border px-4 py-2">Estado</th>
                          <th className="border px-4 py-2">Documento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examenesFiltrados.map((examen) => (
                          <tr key={examen._id} className="border">
                            <td className="border px-4 py-2">{examen.nombre}</td>
                            <td className="border px-4 py-2">
                              {examen.enfermedad ? (
                                <p className="">{examen.enfermedad.nombre}</p>
                              ) : (
                                <p className="text-yellow-500">No tiene enfermedad asociada</p>
                              )}
                            </td>
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
      style={{ position: 'absolute', top: '-10px' }}
    >
    { mostrarFormulario ?  <div className="flex"> 
 < IoMdCloseCircle className="text-2xl"/>
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
    <h1 className=" text-center text-xl font-bold p-1">Nuevo antecedente quirúrgico</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className=" ">Procedimiento quirúrgico:</label>
        <input
  type="text"
  className="border  px-2 py-1 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Ej:Apendicectomía"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
  <label htmlFor="anio">Año de la cirugía:</label>
  <input
    type="text"
    className="border px-2 py-1 rounded-lg w-full"
    name="anio"
    id="anio"
    placeholder="Ej:2018"
    value={anio}
    onChange={(e) => {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        setAnio(e.target.value);
      }
    }}
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

export default FormularioAntecedentesQuirurgicos