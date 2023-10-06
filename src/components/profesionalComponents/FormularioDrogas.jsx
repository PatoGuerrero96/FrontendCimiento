import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import moment from "moment";
const FormularioDrogas = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState([]);
    const [datosPaciente, setDatosPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [ocultarseccion, setOcultarSeccion] = useState(false);
    const [ocultarActividad, setOcultarActividad] = useState(true);

    const toggleActividad = () => {
      setOcultarActividad(!ocultarActividad);
    };
    const fetchData = async () => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro) return;
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };
      try {
        const { data } = await clientAxios.get(`/profesional/informacion-paciente-consulta/${id}`, config);
     setConsulta(data)
      } catch (error) {
        console.log(error);
      }
    };
      useEffect(() => {    
        fetchData();
      }, [id]); 
      useEffect(() => {
        if (consulta && consulta.paciente) {
          setDatosPaciente(consulta.paciente);
          setLoading(false); 
        }
      }, [consulta]);
      const actualizarPaciente = async () => {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
        try {
          await clientAxios.put(`/profesional/editar-indentificacion-paciente/${consulta.paciente._id}`, datosPaciente,config);
       fetchData();
          Swal.fire('¡Perfecto!', 'Sección de consumo de drogras actualizado', 'success');          
    
        } catch (error) {
          console.error(error.message);
          // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Si el campo es 'drogas', actualiza solo esa propiedad dentro de historiaclinica
        if (name === 'drogas') {
          setDatosPaciente((prevState) => ({
            ...prevState,
            historiaclinica: {
              ...prevState.historiaclinica,
              [name]: value
            }
          }));
        } else {
          // Si es otro campo, actualiza directamente en el objeto 'datosPaciente'
          setDatosPaciente((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
      };
      
      const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));
      const CamposVacios =
      !datosPaciente.obsdrogas ||
      datosPaciente?.historiaclinica?.drogas==='Sin datos';
     const nombreVacio = !datosPaciente.obsdrogas;
     const actividadVacia = datosPaciente?.historiaclinica?.drogas ==='Sin datos' || '';

  return (
    <>
          {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
        <div className="mx-auto max-w-7xl rounded-md  mb-1">
        <div className="flex justify-start gap-2 py-1 px-4 rounded-t-lg bg-lila-300">
              <div>
                <h1 className="text-white font-semibold text-sm">
                Drogas: {datosPaciente?.historiaclinica?.drogas} 
                </h1>
              </div>
              <div>
                <button
                  className="rounded-md inline-flex space-x-1 items-center text-white hover:text-white hover:bg-indigo-500"
                  onClick={() => setOcultarSeccion(!ocultarseccion)  }
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
              </div>
              <div>
              {CamposVacios && (
       <div className="flex mt-1">
    <p className="text-red-500 text-md"><FaExclamation className="animate-pulso text-xl" /></p>
    </div>
  )}
              </div>          
        </div>
        <div className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>
        <div className="mx-auto max-w-7xl rounded-md">
        <div className="border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2 bg-gray-50 border-b-indigo-200 ">
<div className="border-b border-b-indigo-200" >
<div className="container mx-auto p-1">
<div className="grid grid-cols-2 items-center ">
<div className="flex justify-start gap-2">
  <div>
  <h2 className="text-md font-regular">
  {datosPaciente?.historiaclinica?.drogas} 
  </h2>
    </div>

  {CamposVacios && (
       <div className="flex mt-1">
    <p className="text-red-500 text-md"><FaExclamation className="animate-pulso text-xl" /></p>
    </div>
  )}
        <button
          className="text-blue-500 focus:outline-none"
          onClick={toggleActividad}
        >
          {ocultarActividad ? (
            <p className="text-3xl"><MdKeyboardArrowRight /></p>
          ) : (
            <p className="text-3xl"><MdKeyboardArrowDown /></p>
          )}
        </button>
</div>
</div>
{ocultarActividad ? null : (
  
     <div>
      {showButton ? (
  <div className="grid grid-cols-1 sm:grid-cols-1 ">

    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="obsdrogas" className="text-md  ">Observaciones de consumo de drogas:</label>
      {nombreVacio && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="obsdrogas"
        value={datosPaciente.obsdrogas || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="drogas" className="text-md  ">¿Consume drogas?</label>
      {actividadVacia && (
              <span className="text-red-500 text-md"><FaExclamation className="animate-pulso text-lg" /></span>
                )}
    </div>
    <select
  className="border px-4 py-2 rounded-lg w-full"
  name="drogas"
  value={datosPaciente.historiaclinica.drogas || ""}
  onChange={handleChange}
>
  <option value="">Seleccione una opción</option>
  <option value="Si">Si</option>
  <option value="No">No</option>
</select>
    </div>
  </div>
         ) : (
          <div className="flex flex-col text-sm gap-1">
          <div className="flex items-center  gap-1">
            <label htmlFor="nombre" className="font-bold">Observaciones de consumo de drogas:</label>
            <label>{datosPaciente.obsdrogas || ''} </label>
          </div>
          <div className="flex items-center  gap-1">
            <label htmlFor="ultimocontrol" className="font-bold">
            ¿Consume drogas?:
            </label>
            <label>{datosPaciente.historiaclinica.drogas ||''}</label>
          </div>
        </div>
      )}

  <div className="flex justify-center py-1">
    {showButton && (
      <button onClick={actualizarPaciente} className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
        Actualizar 
      </button>
    )}
    
  </div>

  </div>
    )}
</div>


</div>



        </div>
        </div>
        </div>
        </div>
        </>
        )}
    
</>
  )
}

export default FormularioDrogas