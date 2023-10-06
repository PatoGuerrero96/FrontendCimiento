import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";
import moment from "moment";
const FormularioAlergia = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [datosPaciente, setDatosPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [ocultarseccion, setOcultarSeccion] = useState(false);
    const [ocultarAlergia, setOcultarAlergia] = useState({});
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [AlergiaActualId, setAlergiaActualId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [obsalergia, setObsalergia] = useState('');
    const toggleAlergia = (alergiaId) => {
        setOcultarAlergia((prevOcultarAlergia) => ({
          ...prevOcultarAlergia,
          [alergiaId]: !prevOcultarAlergia[alergiaId]
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
        if (consulta && Array.isArray(consulta.alergias)) {
          setDatosPaciente(consulta.alergias);
        }
      }, [consulta]);
      const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
      const hayCamposVacios = Object.values(datosPaciente).some(
        (alergias) =>
          !alergias.nombre||
          !alergias.obsalergia ||
          alergias.guardadoporpaciente ===true
      );
      const actualizarPaciente = async () => {
        const confirmar = await Swal.fire({
          title: '¿Estas seguro de actualizar esta alergia?',
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
        if (!tokenPro || !AlergiaActualId) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
      
        try {
          const alergias = datosPaciente[AlergiaActualId];
      
          await clientAxios.put(`/profesional/editar-alergias-paciente/${alergias._id}`, alergias, config);
          fetchData();
          Swal.fire('¡Perfecto!', 'Alergia actualizada con éxito', 'success');
        } catch (error) {
          console.error(error.message);
        }
      }
      };
      const handleChange = (e, alergiaId) => {
        const { name, value } = e.target;
        setDatosPaciente((prevState) => ({
          ...prevState,
          [alergiaId]: {
            ...prevState[alergiaId],
            [name]: value
          }
        }));
        setAlergiaActualId(alergiaId); // Establecer el ID del tratamiento actual
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (!nombre) {
            Swal.fire('¡Error!', 'Por favor, Agregue un nombre para la alergia', 'error');
            return;
          }
          if (!obsalergia) {
            Swal.fire('¡Error!', 'Por favor, Agregue una observación para esta alergia', 'error');
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
          await clientAxios.post('/profesional/agregar-alergias-paciente', {
            nombre,
            obsalergia,
            pacienteId: consulta.paciente._id,
          },config);
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );
          setConsulta(data);
          setDatosPaciente(data.alergias);
          fetchData();
          setNombre('');
          setMostrarFormulario(false)
          // Mostrar mensaje de éxito o redireccionar a otra página
          Swal.fire('¡Perfecto!', 'Alergia actualizada con éxito', 'success');
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se puede guardar la alergia', 'error');
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
        <div className="mx-auto max-w-7xl rounded-md  border  mb-2">
        <div className="flex justify-start gap-2 py-1 px-4  rounded-t-lg bg-lila-300">
              <div>
              {consulta.paciente?.historiaclinica?.alergia==='No'  && !datosPaciente.length || consulta.paciente?.historiaclinica?.alergia==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.alergia==='Si' && !datosPaciente.length  ?
               <h1 className="text-white font-semibold text-sm"> Alergias:</h1>:<h1 className="text-white font-semibold text-sm">Alergias{` (${consulta.alergias.length})`} 
                </h1>}

              </div>
              <div>
{consulta.paciente?.historiaclinica?.alergia==='No' && !datosPaciente.length ?
  <h1 className=" text-white">No</h1> 
:''}
{consulta.paciente?.historiaclinica?.alergia==='Sin datos'  && !datosPaciente.length?
  <h1 className=" text-white">Sin datos</h1>
:''}
{consulta.paciente?.historiaclinica?.alergia==='Si' && !datosPaciente.length?
 <h1 className=" text-white">Si</h1>
:''}
</div>
{consulta.paciente?.historiaclinica?.alergia==='No'  && !datosPaciente.length || consulta.paciente?.historiaclinica?.alergia==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.alergia==='Si' && !datosPaciente.length  ?
''
            :
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
        <div className="border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50">
        {consulta.alergias.length ? 
        <div>
        {Object.keys(datosPaciente).map((alergiaId,index) => {
         const numeroEnumeracion = index + 1;
        const alergias = datosPaciente[alergiaId];
        const CamposVacios =
        !alergias.nombre||
        !alergias.obsalergia ||
        alergias.guardadoporpaciente ===true;
        const nombreVacio = !alergias.nombre  || alergias.guardadoporpaciente ===true;
        const obsVacio = !alergias.obsalergia;
        const isAlergiaOculto = ocultarAlergia[alergiaId] || false;
return (
<div className="border-b border-b-indigo-200" key={alergiaId}>
<div className="container mx-auto p-1">
<div className="grid grid-cols-10 items-center ">
  <div className="col-span-9 flex justify-start gap-2 ">
  <div className="">
  <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
  </div>
  <div className="flex gap-1">
      <p className="text-md font-regular">
        {alergias.nombre}:
      </p>
      <p className="text-sm mt-1 font-regular">
        {alergias.obsalergia ? `${alergias.obsalergia}` : ''}
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
    onClick={() => toggleAlergia(alergiaId)}
  >
    {isAlergiaOculto ? (
      <p className="text-3xl"><MdKeyboardArrowDown /></p>
    ) : (
      <p className="text-3xl"><MdKeyboardArrowRight /></p>
    )}
  </button>
  </div>

</div>
</div>
      {isAlergiaOculto && (
        <>
        {showButton ? (
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-1">
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="nombre" className=" ">Nombre de la alergia</label>
      {nombreVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
key={alergiaId}
type="text"
className={`border px-2 py-1 rounded-lg w-full ${alergias.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="nombre"
placeholder="Ej:Al mani"
value={alergias.nombre || ''}
onChange={(e) => handleChange(e, alergiaId)}
/>
    </div>
    <div className="flex flex-col text-sm">
        <div className="flex">
        <label htmlFor="obsalergia" className=" ">Observación de la alergia</label>
      {obsVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
    <input
        key={alergiaId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${alergias.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        placeholder="Ej:Agregue información de esta alergia"
        name="obsalergia"
        value={alergias.obsalergia || ''}
        onChange={(e) => handleChange(e, alergiaId)}
      />
    </div>

  </div>
   ) : (
    <div className="flex flex-col text-sm gap-1">
    <div className="flex items-center  gap-1">
      <label htmlFor="nombre" className="font-bold">Nombre de la alergia:</label>
      <label>{alergias.nombre || ''} </label>
    </div>
    <div className="flex items-center  gap-1">
      <label htmlFor="ultimocontrol" className="font-bold">
      Observación de la alergia:
      </label>
      <label>{alergias.obsalergia||''}</label>
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
    style={{ position: 'absolute', top: '-10px' }}
    >
    { mostrarFormulario ?  <div className="flex"> 
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
    <h1 className=" text-center text-xl font-bold p-1">Nueva alergia</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className=" ">Nombre de la alergia:</label>
        <input
  type="text"
  className="border  px-2 py-1 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Ej:Al mani"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="obsalergia"className=" ">Observación para la alergia:</label>
        <input
  type="text" 
  id="obsalergia"
  placeholder="Ej:Observación de la alergia"
  className="border  px-2 py-1 rounded-lg w-full "
  value={obsalergia}
  onChange={(e) => setObsalergia(e.target.value)}
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

export default FormularioAlergia