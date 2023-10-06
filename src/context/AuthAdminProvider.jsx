import { useState, useEffect, createContext } from "react";
import clientAxios from "../config/axios";

const AuthAdminContext = createContext()
const toastMixin = Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'Titulo',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
const AuthAdminProvider = ({children})=>{
const [cargando, setCargando ] =useState(true)
const [ authadmin, setAuthadmin ] = useState({})
const [theme, setTheme] =  useState("light")
useEffect(() => {
    if(theme == "dark"){
      document.documentElement.classList.add("dark");

    }else{
        document.documentElement.classList.remove("dark");
    }

}, [theme])

const handleThemeSwitch=() =>{
    setTheme (theme === "dark" ? "light": "dark");
}


     useEffect(()=>{
        const autenticarUsuario = async() =>{
            const tokenAdm = localStorage.getItem('tokenAdm')
            if(!tokenAdm){
                setCargando(false)
                return
    
            } 
    
            const config ={
    
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${tokenAdm}`
                }
            }
            try {
                const {data} = await clientAxios.get(`/admin/perfil`,config)
                setAuthadmin(data)
            } catch (error) {
                console.log(error.response.data.msg)
                setAuthadmin({})
            }
    
            setCargando(false)
        }
        autenticarUsuario()
    
     }, [])
     //ELIMINAR SESION PASADO 13 DIAS 
     useEffect(() => {
        const sessionStartDateAdmin = localStorage.getItem("sessionStartDateAdmin");
    
        if (sessionStartDateAdmin) {
          const startDate = new Date(sessionStartDateAdmin);
          const currentDate = new Date();
    
          const sixDaysInMilliseconds = 13 * 24 * 60 * 60 * 1000; // 13 días en milisegundos
    
          if (currentDate - startDate >= sixDaysInMilliseconds) {
            localStorage.removeItem("tokenAdm");
            localStorage.removeItem("sessionStartDateAdmin");
          }
        }
      }, []);
     

     const cerrarSesion = ()=>{
        localStorage.removeItem('tokenAdm')
        localStorage.removeItem("sessionStartDateAdmin");
        setAuthadmin({})
      }
      const guardarPassword = async (datos) =>{
        const tokenAdm = localStorage.getItem('tokenAdm')
        if(!tokenAdm){
            setCargando(false)
            return
        } 
        const config ={
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${tokenAdm}`
            }
        }
    
        try {
             const url = '/admin/actualizar-password'
             const {data} = await clientAxios.put(url,datos,config)
             toastMixin.fire({
                animation: true,
                title: 'Tu sesión sera cerrada en los proximos segundos...',
                icon:'info'
              });
             setTimeout(()=> cerrarSesion(),8000)
             return{
                msgp:data.msg
             }

        } catch (error) {
            return{
                msgp: error.response.data.msg,
                error:true
            }
        }
    }

return(
    <AuthAdminContext.Provider
    value={{
        authadmin,
        setAuthadmin,
        cargando,
        cerrarSesion,
        handleThemeSwitch,
        guardarPassword
    }}
    >
        {children}
    </AuthAdminContext.Provider>

)
}

export{
    AuthAdminProvider
}

export default AuthAdminContext