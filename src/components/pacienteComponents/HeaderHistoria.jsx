import { Link, useLocation } from "react-router-dom"
import { useState,useEffect } from 'react'
import clientAxios from "../../config/axios";
const HeaderHistoria = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenArchivo, setIsOpenArchivo] = useState(false);
  const [examenesPendientes, setExamenesPendientes] = useState(0);
  const [examenes, setExamenes] = useState([]);
  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenuArchivo = () => {
    setIsOpenArchivo(!isOpenArchivo);
  };
  useEffect(() => {
  const obtenerExamenes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
  
      const { data } = await clientAxios.get('/pacientes/obtener-examenes', config);
  
      setExamenes(data);
  
      // Contar los exámenes con estado false
      const pendientes = data.filter((examen) => !examen.estado);
      setExamenesPendientes(pendientes.length);
    } catch (error) {
      console.log(error);
    }
  };
  obtenerExamenes()
}, []);
  const examenesPendientesClass = examenesPendientes > 0 ? 'bg-red-500' : '';
  return (
    <>
      <header className="pt-6 bg-lila-300 ">
     
     <div className="container mx-auto flex flex-col md:flex-row justify-center items-center font-nunito   ">
         <nav className="flex flex-col items-center md:flex-row xl:gap-1 sm:gap-1 xl:mt-2 lg:mt-0  ">
             <Link to="/paciente/historia-clinica" className={`text-white text-sm hover:text-gray-300 bg-blue-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular ${location.pathname === '/paciente/historia-clinica' && 'text-gray-400  '}`}>Historial Clínica</Link>
             <Link to="/paciente/diagnosticos" className={`text-white text-sm hover:text-gray-300 bg-yellow-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular ${location.pathname === '/paciente/diagnosticos' && 'text-gray-600'}`}>Diagnósticos</Link>
             <Link to="/paciente/examenes" className={`text-white text-sm hover:text-gray-300 bg-green-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular ${location.pathname === '/paciente/examenes' && 'text-gray-600'}`}>Examenes</Link>

             <div className="relative">
             <button
                      onClick={toggleSubMenuArchivo}
                      className={`text-white text-sm hover:text-gray-300 bg-pink-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular ${location.pathname === '/paciente/examenes' && 'text-gray-600'}`}>
                      Archivos
                    </button>
              {isOpenArchivo && (
                <div className="absolute left-0 mt-2 bg-pink-600 shadow-lg rounded-md py-2 bottom-10">
                  <Link
                    to="/paciente/examenesPendientes"
                    className=" text-xs block px-2 py-1 text-gray-200  hover:text-gray-600">
                    QR radiografías
                  </Link>
                  <hr />
                  <Link
                    to="/paciente/examenes"
                    className=" text-xs block px-2 py-1 text-gray-200  hover:text-gray-600">
                   Protocolos hospitalarios 
                  </Link>
                  <hr />
                  <Link
                    to="/paciente/examenes"
                    className=" text-xs block px-2 py-1 text-gray-200  hover:text-gray-600">
                   Epicrisis
                  </Link>
                </div>
              )}
            </div>             
            <Link to="/paciente/eventos" className={`text-white text-sm hover:text-gray-300 bg-red-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular ${location.pathname === '/paciente/eventos' && 'text-gray-600'}`}>Eventos</Link>
             <Link to="/paciente/seguimiento-consulta" className={`text-white text-sm hover:text-gray-300 bg-purple-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular ${location.pathname === '/paciente/seguimiento-consulta' && 'text-gray-400'}`}>Seguimiento de consultas</Link>
         </nav>
     </div>
   </header>
    </>
  )
}

export default HeaderHistoria