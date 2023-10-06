import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";
import moment from "moment";
const FormularioAntecedenteFam = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [datosPaciente, setDatosPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [ocultarseccion, setOcultarSeccion] = useState(false);
    const [ocultarAntecedente, setOcultarAntecedente] = useState({});
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [AntecedenteActualId, setAntecedenteActualId] = useState(null);
    const [nombrediagnostico, setNombrediagnostico] = useState('');
    const [familiar, setFamiliar] = useState('');
    const toggleAntecedente = (antecedentesfamId) => {
        setOcultarAntecedente((prevOcultarAntecedente) => ({
          ...prevOcultarAntecedente,
          [antecedentesfamId]: !prevOcultarAntecedente[antecedentesfamId]
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
        if (consulta && Array.isArray(consulta.antecedentesfam)) {
          setDatosPaciente(consulta.antecedentesfam);
        }
      }, [consulta]);
      const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
      };
      const hayCamposVacios = Object.values(datosPaciente).some(
        (antecedentesfam) =>
          !antecedentesfam.nombrediagnostico||
          !antecedentesfam.familiar ||
          antecedentesfam.guardadoporpaciente ===true
      );
      const actualizarPaciente = async () => {
        const confirmar = await Swal.fire({
          title: '¿Estás seguro de actualizar este antecedentes familiar?',
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
        if (!tokenPro || !AntecedenteActualId) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
      
        try {
          const antecedentesfam = datosPaciente[AntecedenteActualId];
      
          await clientAxios.put(`/profesional/editar-antecedentefam-paciente/${antecedentesfam._id}`, antecedentesfam, config);
          fetchData();      
          Swal.fire('¡Perfecto!', 'Antecedente familiar actualizado con éxito', 'success');
        } catch (error) {
          console.error(error.message);
        }
      }
      };
      const handleChange = (e, antecedentesfamId) => {
        const { name, value } = e.target;
        setDatosPaciente((prevState) => ({
          ...prevState,
          [antecedentesfamId]: {
            ...prevState[antecedentesfamId],
            [name]: value
          }
        }));
        setAntecedenteActualId(antecedentesfamId); // Establecer el ID del antecedente familiar
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (!nombrediagnostico) {
            Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el diagnóstico', 'error');
            return;
          }
          if (!familiar) {
            Swal.fire('¡Error!', 'Por favor, Agregue una familiar para el diagnóstico', 'error');
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
          await clientAxios.post('/profesional/agregar-antecedentefam-paciente', {
            nombrediagnostico,
            familiar,
            pacienteId: consulta.paciente._id,
          },config);
          const { data } = await clientAxios.get(
            `/profesional/informacion-paciente-consulta/${id}`,
            config
          );

          setConsulta(data);
          setDatosPaciente(data.antecedentesfam);
          fetchData();  
          setNombrediagnostico('');
          setFamiliar('');
          setMostrarFormulario(false)
          // Mostrar mensaje de éxito o redireccionar a otra página
          Swal.fire('¡Perfecto!', 'Antecedente familiar actualizado con éxito', 'success');
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se puede guardar el antecedente familiar', 'error');
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
              
                {consulta.paciente?.historiaclinica?.antecedentesfam==='No'  && !datosPaciente.length || consulta.paciente?.historiaclinica?.antecedentesfam==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.antecedentesfam==='Si' && !datosPaciente.length  ?
                 <h1 className="text-white font-semibold mt-0.5 text-sm">Antecedentes familiares:</h1>:  <h1 className="text-white font-semibold text-sm">Antecedentes familiares{` (${consulta.antecedentesfam.length})`}     </h1> }
            
              </div>
              <div>
{consulta.paciente?.historiaclinica?.antecedentesfam==='No' && !datosPaciente.length ?
  <h1 className=" text-white">No</h1> 
:''}
{consulta.paciente?.historiaclinica?.antecedentesfam==='Sin datos'  && !datosPaciente.length?
  <h1 className=" text-white">Sin datos</h1>
:''}
{consulta.paciente?.historiaclinica?.antecedentesfam==='Si' && !datosPaciente.length?
 <h1 className=" text-white">Si</h1>
:''}
</div>
{consulta.paciente?.historiaclinica?.antecedentesfam==='No'  && !datosPaciente.length || consulta.paciente?.historiaclinica?.antecedentesfam==='Sin datos'  && !datosPaciente.length ||consulta.paciente?.historiaclinica?.antecedentesfam==='Si' && !datosPaciente.length  ?
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
        {consulta.antecedentesfam.length ? 
        <div>
        {Object.keys(datosPaciente).map((antecedentesfamId,index) => {
        const numeroEnumeracion = index + 1;
        const antecedentesfam = datosPaciente[antecedentesfamId];
        const CamposVacios =
        !antecedentesfam.nombrediagnostico||
        !antecedentesfam.familiar ||
        antecedentesfam.guardadoporpaciente ===true;
        const nombreVacio = !antecedentesfam.nombrediagnostico  || antecedentesfam.guardadoporpaciente ===true;
        const familiarVacio = !antecedentesfam.familiar;
        const isFarmacoOculto = ocultarAntecedente[antecedentesfamId] || false;
return (
<div className="border-b border-b-indigo-200" key={antecedentesfamId}>
<div className="container mx-auto p-1">
<div className="grid grid-cols-10 items-center ">
  <div className="col-span-9 flex justify-start gap-2 ">
  <div className="">
  <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
  </div>
  <div className="flex gap-1">
      <p className="text-md font-regular">
        {antecedentesfam.nombrediagnostico}:
      </p>
      <p className="text-sm mt-1 font-regular">
        {antecedentesfam.familiar ? `${antecedentesfam.familiar}` : ''}
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
    onClick={() => toggleAntecedente(antecedentesfamId)}
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
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="nombrediagnostico" className=" ">Antecedente familiar</label>
      {nombreVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
      <input
key={antecedentesfamId}
type="text"
className={`border px-2 py-1 rounded-lg w-full ${antecedentesfam.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
name="nombrediagnostico"
placeholder="Ej:Nombre del diagnóstico"
value={antecedentesfam.nombrediagnostico || ''}
onChange={(e) => handleChange(e, antecedentesfamId)}
/>
    </div>
    <div className="flex flex-col text-sm">
        <div className="flex">
        <label htmlFor="horario" className=" ">Familiar asociado</label>
      {familiarVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
    <select
  key={antecedentesfamId}
  className={`border px-2 py-1 rounded-lg w-full ${antecedentesfam.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
  name="familiar"
  value={antecedentesfam.familiar || ''}
  onChange={(e) => handleChange(e, antecedentesfamId)}
>
  <option value="">Selecciona una opción</option>
  <option value="Padre">Padre</option>
  <option value="Madre">Madre</option>
  <option value="Hermano">Hermano</option>
  <option value="Hermana">Hermana</option>
  <option value="Tio">Tío/a</option>
  <option value="Abuelo">Abuelo</option>
  <option value="Abuela">Abuela</option>
  <option value="Primo">Primo/a</option>
</select>
    </div>

  </div>
 ) : (
  <div className="flex flex-col text-sm gap-1">
  <div className="flex items-center  gap-1">
    <label htmlFor="nombre" className="font-bold">Antecedente familiar:</label>
    <label>{antecedentesfam.nombrediagnostico || ''} </label>
  </div>
  <div className="flex items-center  gap-1">
    <label htmlFor="ultimocontrol" className="font-bold">
    Familiar asociado:
    </label>
    <label>{antecedentesfam.familiar||''}</label>
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
        {showButton &&(
 <button
 onClick={VerFormularioCerrado}
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
    <h1 className=" text-center text-xl font-bold p-1">Nuevo Antecedente familiar</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className=" ">Nombre del antecedente familiar:</label>
        <input
  type="text"
  className="border  px-2 py-1 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Ej:Agregue nombre del diagnóstico"
  value={nombrediagnostico}
  onChange={(e) => setNombrediagnostico(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="familiar"className=" ">Familiar:</label>
            <select
            className="border  px-2 py-1 rounded-lg w-full"
            name="familiar"
            id="familiar"
            value={familiar}
            onChange={(e) => setFamiliar(e.target.value)}
            >
            <option value="">Selecciona una opción</option>
            <option value="Padre">Padre</option>
            <option value="Madre">Madre</option>
            <option value="Hermano">Hermano</option>
            <option value="Hermana">Hermana</option>
            <option value="Tio">Tío/a</option>
            <option value="Abuelo">Abuelo</option>
            <option value="Abuela">Abuela</option>
            <option value="Primo">Primo/a</option>
            </select>
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

export default FormularioAntecedenteFam