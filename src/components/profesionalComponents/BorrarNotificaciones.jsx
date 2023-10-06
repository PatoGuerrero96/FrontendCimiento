import { useState, useEffect } from "react";
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"

const BorrarNotificaciones = () => {
    const {authpro} =  proAuth()
    const [ perfil, setPerfil ] = useState({});
    useEffect(() => {
        setPerfil(authpro)
      
      }, [])
      const marcarConsultasAceptadasComoLeidas = async datos  =>{

        try {
          const tokenPro = localStorage.getItem('tokenPro')
          if(!tokenPro){
            setCargando(false)
            return
          } 
          const config ={
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${tokenPro}`
            }
          }
            const url = `/profesional/cambiar-estado-consultas-aceptadas/${datos._id}`
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
  return (
    <>

 <button className='text-white text-sm hover:text-gray-300 bg-indigo-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex  ' onClick={handleSubmit}>Limpiar notificaciones <span className="">🧹</span>
 </button>

    </>
  )
}

export default BorrarNotificaciones