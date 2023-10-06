import { Link, useLocation } from "react-router-dom"
import { useState,useEffect } from "react"
import useAuth from "../../hooks/useAuth"
import clientAxios from "../../config/axios"
const HeaderConsultas = () => {
  const {auth} = useAuth()
  const [consultas, setConsultas] = useState([]);
  const [ perfil, setPerfil ] = useState({});
  const location = useLocation();
  useEffect(() => {
    setPerfil(auth)
  
  }, [])

  useEffect(()=>{
    const obtenerNotificacionesConsultas = async() =>{
      try {
        const token = localStorage.getItem('token')
        if(!token) return
        
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            
        }
        }
        const { data } = await clientAxios.get('/pacientes/obtener-lista-consultas',config)
         setConsultas(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerNotificacionesConsultas()      
  },[consultas])
  
  const marcarConsultasAceptadasComoLeidas = async datos  =>{

    try {
      const token = localStorage.getItem('token')
      if(!token){
        setCargando(false)
        return
      } 
      const config ={
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
      }
        const url = `/pacientes/cambiar-estado-consultas-aceptadas/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)           
      }
    
    catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = async e =>{
    e.preventDefault()
    await  marcarConsultasAceptadasComoLeidas(perfil)
    
   }

   const consultasproAceptadas = consultas.filter(con => con.paciente?._id === auth?._id && con.leidopacienteheader === false && con.estado === 'pagado');
   const numNotificacionesAceptadas = consultasproAceptadas.length;
   
   const consultasproPendientes = consultas.filter(con => con.paciente?._id === auth?._id && con.leidopacienteheader === false && con.estado === 'pendiente');
   const numNotificacionesPendientes = consultasproPendientes.length;
   
   const consultasproRechazada = consultas.filter(con => con.paciente?._id === auth?._id && con.leidopacienteheader === false && con.estado === 'rechazada');
   const numNotificacionesRechazada = consultasproRechazada.length;
   
   const consultasproFinalizadas = consultas.filter(con => con.paciente?._id === auth?._id && con.leidopacienteheader === false && con.estado === 'finalizado');
   const numNotificacionesFinalizadas = consultasproFinalizadas.length;
  return (
    <>
      <header className=" bg-lila-300 ">
     <div className="container mx-auto flex flex-col md:flex-row justify-center items-center font-nunito   ">
<nav className="flex flex-col items-start md:flex-row justify-content: flex-start xl:gap-1 sm:gap-1 xl:mt-2 lg:mt-0">
{ numNotificacionesAceptadas > 0 ?
 <Link to="/paciente/tus-consultas"  className={`text-white text-sm hover:text-gray-300 bg-green-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/tus-consultas' && 'text-gray-300  '}`}>Consultas aceptadas
 <div className="bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ml-2">
            {numNotificacionesAceptadas}
            </div>
 </Link>

  :   <Link to="/paciente/tus-consultas"  className={`text-white text-sm hover:text-gray-300 bg-green-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/tus-consultas' && 'text-gray-300  '}`}>Consultas aceptadas
    </Link>
}
{ numNotificacionesPendientes > 0 ?
 <Link to="/paciente/consultas-pendientes"  className={`text-white text-sm hover:text-gray-300 bg-yellow-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas-pendientes' && 'text-gray-300  '}`}>Consultas pendientes
 <div className="bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ml-2">
            {numNotificacionesPendientes}
            </div>
 </Link>
  :   <Link to="/paciente/consultas-pendientes"  className={`text-white text-sm hover:text-gray-300 bg-yellow-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas-pendientes' && 'text-gray-300  '}`}>Consultas pendientes
    </Link>
}
{ numNotificacionesRechazada > 0 ?
 <Link to="/paciente/consultas-rechazadas"  className={`text-white text-sm hover:text-gray-300 bg-red-500 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas-rechazadas' && 'text-gray-300  '}`}>Consultas rechazadas
 <div className="bg-red-300 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ml-2">
            {numNotificacionesRechazada}
            </div>
 </Link>
  :   <Link to="/paciente/consultas-rechazadas"  className={`text-white text-sm hover:text-gray-300 bg-red-500 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas-rechazadas' && 'text-gray-300  '}`}>Consultas rechazadas
    </Link>
}
{ numNotificacionesFinalizadas > 0 ?
 <Link to="/paciente/consultas-finalizadas"  className={`text-white text-sm hover:text-gray-300 bg-green-800 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas-finalizadas' && 'text-gray-300  '}`}>Consultas finalizadas
 <div className="bg-red-800 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ml-2">
            {numNotificacionesFinalizadas}
            </div>
 </Link>
  :   <Link to="/paciente/consultas-finalizadas"  className={`text-white text-sm hover:text-gray-300 bg-green-800 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas-finalizadas' && 'text-gray-300  '}`}>Consultas finalizadas
    </Link>
}
         
 <button className='text-white text-sm hover:text-gray-300 bg-indigo-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex  ' onClick={handleSubmit}>Limpiar notificaciones <span className="">🧹</span>
 </button>
         </nav>
     </div>
   </header>
    </>
  )
}

export default HeaderConsultas