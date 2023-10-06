import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../config/axios";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";

import moment from "moment";
const FormularioGine = () => {
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
          await clientAxios.put(`/profesional/actualizar-gine/${consulta.paciente._id}`, datosPaciente,config);
          fetchData();
          Swal.fire('¡Perfecto!', 'Sección de Antecedentes ginecoobstétricos ', 'success');          
    
        } catch (error) {
          console.error(error.message);
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
      

          setDatosPaciente((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
      
      const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));



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
                Antecedentes ginecoobstétricos
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
              </div>          
        </div>
        <div className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>
        <div className="mx-auto max-w-7xl rounded-md">
        <div className="border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2 bg-gray-50 border-b-indigo-200 ">
<div className="border-b border-b-indigo-200" >
<div className="container mx-auto p-1">
     <div>
      {showButton ? (
  <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 ">

    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="gestaciones" className="text-md">Gestaciones:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="gestaciones"
        value={datosPaciente.gestaciones || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="perdidas" className="text-md">Perdidas:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="perdidas"
        value={datosPaciente.perdidas || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="partos" className="text-md">Partos:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="partos"
        value={datosPaciente.partos || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="cesareas" className="text-md">Cesáreas:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="cesareas"
        value={datosPaciente.cesareas || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="menarquia" className="text-md">Menarquia:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="menarquia"
        value={datosPaciente.menarquia || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="ultimaregla" className="text-md">Última regla:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="ultimaregla"
        value={datosPaciente.ultimaregla || ''}
        onChange={handleChange}
    />
    </div>
    <div className="flex flex-col text-sm">
      <div className="flex">
      <label htmlFor="ultimopap" className="text-md">Último PAP:</label>

    </div>
    <textarea
        type="text"
        className="border px-4 py-2 rounded-lg w-full "
        name="ultimopap"
        value={datosPaciente.ultimopap || ''}
        onChange={handleChange}
    />
    </div>


  </div>
        ) : (''
      )}

  <div className="flex justify-center py-1">
    {showButton && (
      <button onClick={actualizarPaciente} className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-1.5 px-2 rounded-lg">
        Actualizar
      </button>
    )}
    
  </div>
</div>
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

export default FormularioGine