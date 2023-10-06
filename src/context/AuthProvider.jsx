import { useState, useEffect, createContext } from "react";
import clientAxios from "../config/axios";
import { IoMdEye } from 'react-icons/io';



const AuthContext = createContext()

const AuthProvider = ({children})=>{
const [theme, setTheme] =  useState("light")
const [cargando, setCargando] = useState(true)
const [loading, setLoading] = useState(false)
const [motivos, setMotivos] = useState([])
const [motivo, setMotivo] = useState({})


    const [auth, setAuth] = useState({})
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
        try {
            const {data} = await clientAxios.get(`/pacientes/perfil`,config)
            setAuth(data)
        } catch (error) {
            console.log(error.response.data.msg)
            setAuth({})
        }

        setCargando(false)
    }
    autenticarUsuario()

 },  [auth])
 useEffect(() => {
    const sessionStartDate = localStorage.getItem("sessionStartDate");

    if (sessionStartDate) {
      const startDate = new Date(sessionStartDate);
      const currentDate = new Date();

      const sixDaysInMilliseconds = 13 * 24 * 60 * 60 * 1000; // 13 días en milisegundos

      if (currentDate - startDate >= sixDaysInMilliseconds) {
        localStorage.removeItem("token");
        localStorage.removeItem("sessionStartDate");
      }
    }
  }, []);
 

 const cerrarSesion = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('alertShown')
    localStorage.removeItem('notificacionInicio')
    localStorage.removeItem("sessionStartDate");
    setAuth({})
  }
  const actualizarPerfil = async datos =>{
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
    try {
        const url = `/pacientes/perfil/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
        toastMixin.fire({
            animation: true,
            title: 'Número de teléfono actualizado'
          });
        
    } catch (error) {
        console.log(error)
    }
  }

const guardarPassword = async (datos) =>{
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

    try {
         const url = '/pacientes/actualizar-password'
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

const actualizarFoto = async (image) =>{
    const form =  new FormData()
    for (let key in image) {
      form.append(key, image[key]);
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    if(!token){
        setCargando(false)
        return }


    const config ={
      headers:{
        'Content-Type': 'multipart/form-data',
          Authorization:`Bearer ${token}`
      }
  }
  try {

    const {data} = await clientAxios.put(`/pacientes/foto-perfil/${image._id}`,form,config)
   
  } catch (error) {
        return{
            msg: error.response.data.msg,
            error:true
        }
  }

  setLoading(false)
  
  }



  const actualizarContacto = async datos =>{

    const confirmar = await Swal.fire({
        title: '¿Quieres cambiar tu forma de contacto?',
        text: "Más adelante podras cambiar esta opción",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#1E90FF',
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
    
        const url = `/pacientes/actualizar-contacto/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
        toastMixin.fire({
            animation: true,
            title: 'Las forma de contactarnos contigo fue actualizada'
          });
        
    } catch (error) {
        console.log(error)
    }
  }

}
const ContactoVacio= async datos =>{
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
    const url = `/pacientes/actualizar-contacto/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)
    return data // devolver los datos actualizados
    
} catch (error) {
    console.log(error)
}
    }
const actualizarEstilodevida = async datos =>{
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
    
        const url = `/pacientes/actualizar-nopatologico/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)

        
    } catch (error) {
        console.log(error)
    }
  }

  const guardarMotivoConsulta = async (motivo) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    if (motivo.id) {
      try {
        const { data } = await clientAxios.put(`/pacientes/actualizar-motivodeconsulta/${motivo.id}`, motivo, config);
  
        const motivosActualizados = motivos.map((motivoState) => (motivoState._id === data._id ? data : motivoState));
        setMotivos(motivosActualizados);
  
        toastMixin.fire({
          animation: true,
          title: 'Motivo de consulta actualizado',
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await clientAxios.post('/pacientes/agregar-motivodeconsulta', motivo, config);
        const { createdAt, updatedAt, __v, ...motivoAlmacenado } = data;
        setMotivos([motivoAlmacenado, ...motivos]);

        // Crear un resumen de los datos guardados
        const resumenMotivoConsulta = {
            Titulo: motivoAlmacenado.titulo,
            Descripcion: motivoAlmacenado.descripcion,
            Visible: motivoAlmacenado.visible ? motivoAlmacenado.especialidades : 'Tu consulta no será visible para los profesionales.',
          };
    
          // Mostrar el resumen utilizando Sweet Alert en la ventana de éxito
          const SwalWithEyeIcon = Swal.mixin({
            customClass: {
              icon: 'icon-with-eye',
            },
            icon: 'success',
            title: '¡Listo!',
            html: `
              <p><strong>Motivo de consulta:</strong> ${resumenMotivoConsulta.Titulo}</p>
              <p><strong>Descripción de tu motivo:</strong> ${resumenMotivoConsulta.Descripcion}</p>
              <div style="display: flex; flex-direction: column; align-items: center;">
              <p><strong>Visibilidad de tu caso</strong></p>
              <p style="text-align: center;">
                ${resumenMotivoConsulta.Visible} <span class="eye-icon"><IoMdEye /></span>
              </p>
            </div>
              
              `,
          });

          // Mostrar el Sweet Alert personalizado
          SwalWithEyeIcon.fire();
      } catch (error) {
        console.log(error.response.data.msg);
      }
    }
  };
    const setEdicionMotivo = (motivo) => {
        setMotivo(motivo)
      }
      const eliminarMotivoConsulta = async (id) => {
        const confirmar = await Swal.fire({
          title: '¿Estás seguro de eliminar tu motivo de consulta?',
          text: "!No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#18bca4',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminarlo!'
          }).then((result) => {
          if (result.isConfirmed) {
              return true;
          } else {
              return false;
          }
      })
      if(confirmar) {
        try {
            const token = localStorage.getItem('token')
            const config = {
              headers:{
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              }
            }
            const {data} = await clientAxios.patch(`/pacientes/eliminar-motivodeconsulta/${id}`,{ activo: false }, config);
            const motivoActualizado = motivos.filter(motivosState => motivosState._id !== id);
            setMotivos(motivoActualizado);
            toastMixin.fire({
                animation: true,
                title: 'Eliminado correctamente'
              });
        } catch (error) {
            console.log(error);
        }
    }
      
      }
      const actualizarvisiblemotivo= async datos =>{
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
    
        const url = `/pacientes/actualizar-motivovisible/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
        
    } catch (error) {
        console.log(error)
    }
        }  


      const actualizarHorario = async datos =>{
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
    
        const url = `/pacientes/actualizar-horario/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
        toastMixin.fire({
            animation: true,
            title: 'Tu horario a sido guardado'
          });

        
    } catch (error) {
        console.log(error)
    }
  }
    return(
        <AuthContext.Provider
        value={{
            auth,
            setAuth, 
            cargando,
            cerrarSesion,
            actualizarPerfil,
            guardarPassword,
            actualizarFoto,
            loading,
            setLoading,
            handleThemeSwitch,
            actualizarContacto,
            actualizarEstilodevida,
            guardarMotivoConsulta,
            motivo,
            motivos,
            setMotivo,
            setMotivos,
            setEdicionMotivo,
            eliminarMotivoConsulta,
            actualizarHorario,
            actualizarvisiblemotivo,
            ContactoVacio
         
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext