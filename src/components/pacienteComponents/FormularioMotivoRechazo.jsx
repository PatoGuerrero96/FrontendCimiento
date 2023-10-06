import  { useState,useEffect} from "react";
import useAuth from "../../hooks/useAuth"
import { useParams } from 'react-router-dom';
import clientAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";
const FormularioMotivoRechazo = ({ }) => {
  const [consulta, setConsulta] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate()
  const [nuevoComentario, setNuevoComentario] = useState('');
  const actualizarComentario = async ( nuevoComentario) => {
    try {
      if (!nuevoComentario) {
        Swal.fire('¡Error!', 'Por favor, no envie el comentario vacío', 'error');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        setCargando(false);
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const url = `/pacientes/comentario-consulta/${id}`;
      const body = {
        comentario: nuevoComentario
      };
      const response = await clientAxios.put(url, body, config);
      if (response.status === 200) {
        Swal.fire({
          title: 'Muchas gracias por tu opinión',
          text: 'Tu comentario fue guardado',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        });
      navigate("/paciente")
    }
      return response.data;

    } catch (error) {
      console.log(error);
    }
  };

      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };

        const fetchData = async () => {
          try {
            const response = await clientAxios.get(`/pacientes/ver-consulta/${id}`, config);
            if(Array.isArray(response.data)) {
              setConsulta(response.data);
            } else {
              setConsulta([response.data]);
            }
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      }, []);
      const handleSubmit = async (e) => {
        e.preventDefault();
        await actualizarComentario( nuevoComentario);
        setNuevoComentario('');
      };
  return (
    <>
        <div className="text-center py-10 xl:px-80  ">
    {consulta.map((con) => (
  
  <div key={con._id}>
          <h1 className="text-5xl text-indigo-600 font-bold">¿Por qué rechazaste la <span className="text-5xl uppercase text-gray-700 font-bold">Propuesta de consulta</span> del profesional: {con.profesional.nombres} {con.profesional.apellidos} ?</h1>
          </div>
        ))}
    <div className="flex  items-center justify-center shadow-lg mt-5 mx-auto mb-4 max-w-4xl">
   <form onSubmit={handleSubmit} className="w-full  bg-white rounded-lg px-4 pt-2">
      <div className="flex flex-wrap -mx-3 mb-6">
         <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Escribenos el mótivo por el cual rechazaste la consulta</h2>
         <div className="w-full md:w-full px-3 mb-2 mt-2">
            <textarea className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-36 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" 
            name="comentario" placeholder='Escribe tu comentario...' 
            value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)}
            ></textarea>
         </div>
         <div className="w-full md:w-full flex items-start  px-3">
            <div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
               <svg fill="none" className="w-5 h-5 text-gray-600 mr-1" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
               </svg>
               <p className="text-xs md:text-sm pt-px">Tu opinión no sera vista por el profesional.</p>
            </div>
            <div className="-mr-1">
            <button className="bg-blue-600 text-white font-medium py-1 px-4  rounded-lg tracking-wide mr-1 blue:bg-red-400" >Enviar comentario</button>
            </div>
         </div>
         </div>
      </form>
   </div>

   </div>
     
     </>
  )
}

export default FormularioMotivoRechazo