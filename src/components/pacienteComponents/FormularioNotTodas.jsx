import React, { useState,useEffect} from "react";
import useAuth from "../../hooks/useAuth"
import clientAxios from "../../config/axios";
import { Image} from "cloudinary-react";
import { Link , useNavigate } from "react-router-dom";

const FormularioNotTodas = () => {
  const [consultas, setConsultas] = useState([]);
  const { auth} =  useAuth()
  const [isLoading, setIsLoading] = useState(true);
  const [ perfil, setPerfil ] = useState({});
  const [consultasProximas, setConsultasProximas] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    setPerfil(auth)
  
  }, [])
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
    const ConsultasLeidas= async datos  =>{

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
          const url = `/pacientes/consultasleidas/${datos._id}`
          const {data} = await clientAxios.put(url,datos,config)   
          
        }
      
      catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      const obtenerMotivosConsulta = async() =>{
        try {
          const token = localStorage.getItem('token')
          if(!token) return
    
          const config={
            headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
          }
          const { data } = await clientAxios.get('/pacientes/obtener-consultas',config)
          setConsultas(data)
          setIsLoading(false);
        } catch (error) {
          console.log(error)
        }
    
      }
      obtenerMotivosConsulta()      
    },[consultas])
    useEffect(() => {
      const token = localStorage.getItem('token')
      if(!token) return
    
      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    
      const obtenerConsultasProximas = async () => {
        const respuesta = await clientAxios.get('/pacientes/proxima-consulta',config);
        setConsultasProximas(respuesta.data);
      };
    
      obtenerConsultasProximas();
    }, []);


    const consultasPendientes = consultas.filter(con => con.paciente === auth._id && con.estado === 'pendiente');
const consultasProximasFiltradas = consultasProximas.filter(con => con.estado ==='pagado' && con.paciente._id === auth._id  );
const motivosInterconsulta = consultas.filter(
  (consulta) =>
    consulta.motivoconsulta.paciente === auth._id &&
    consulta.motivoconsulta.notificacioninterconsulta === true && consulta.motivoconsulta.leidopacienteinterconsulta ===false && consulta.estado==='finalizado'
);
const numNotificaciones = consultasPendientes.length + consultasProximasFiltradas.length+ motivosInterconsulta.length;
    const handleSubmit = async e =>{
      e.preventDefault()
      await  ConsultasLeidas(perfil)      
     }
     const handleCambiarEstado = async (id) => {
      Swal.fire({
        title: '¿Estás seguro que quieres rechazar esta propuesta de consulta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
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
            const response = await clientAxios.put(`/pacientes/rechazar-consulta/${id}`, {
              estado: 'rechazada',
            }, config);
  
            if (response.status === 200) {
              Swal.fire({
                title: 'La consulta fue rechazada con éxito',
                text: '',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              });
              navigate(`/paciente/rechazar-consulta/${id}`)
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: 'Hubo un error',
              text: 'No se pudo cambiar el estado de la consulta',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          }
        }
      });
    };
    const handleCambiarEstadoAceptado = async (id) => {
      Swal.fire({
        title: '¿Estás seguro que quieres aceptar esta propuesta de consulta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, aceptar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
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
            const response = await clientAxios.put(`/pacientes/aceptar-consulta/${id}`, {
              estado: 'pagado',
            }, config);
  
            if (response.status === 200) {
              Swal.fire({
                title: 'La consulta fue aceptada con éxito',
                text: '',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              });
              navigate(`/paciente/vermas-consulta-aprobada/${id}`)
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: 'Hubo un error',
              text: 'No se pudo cambiar el estado de la consulta',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          }
        }
      });
    };
    const Rechazarinterconsulta = async (id) => {
      Swal.fire({
        title: '¿Estás seguro que quieres rechazar esta interconsulta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
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
            const response = await clientAxios.put(`/pacientes/rechazar-interconsulta/${id}`,{interconsulta: "No",
             notificacioninterconsulta: false , propuestainterconsulta: null , motivointerconsulta:null}, config);
  
            if (response.status === 200) {
              Swal.fire({
                title: 'La interconsulta fue rechazada',
                text: '',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              });
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: 'Hubo un error',
              text: 'No se pudo rechazar la interconsulta',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          }
        }
      });
    };
    const AceptarInterconsulta = async (id) => {
      Swal.fire({
        title: '¿Estás seguro que quieres aceptar la interconsulta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, aceptar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
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
            const response = await clientAxios.put(`/pacientes/aceptar-interconsulta/${id}`, {
              visible: true, interconsulta:"Interconsulta",
              notificacioninterconsulta : false
            }, config);
  
            if (response.status === 200) {
              Swal.fire({
                title: 'La interconsulta fue aceptada',
                text: '',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              });
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: 'Hubo un error',
              text: 'No se pudo aceptar la interconsulta',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          }
        }
      });
    };


return (
  <>
  <div className="px-10 py-5">
  
      {isLoading ?
    <div className="sk-circle">
    <div className="sk-circle1 sk-child"></div>
    <div className="sk-circle2 sk-child"></div>
    <div className="sk-circle3 sk-child"></div>
    <div className="sk-circle4 sk-child"></div>
    <div className="sk-circle5 sk-child"></div>
    <div className="sk-circle6 sk-child"></div>
    <div className="sk-circle7 sk-child"></div>
    <div className="sk-circle8 sk-child"></div>
    <div className="sk-circle9 sk-child"></div>
    <div className="sk-circle10 sk-child"></div>
    <div className="sk-circle11 sk-child"></div>
    <div className="sk-circle12 sk-child"></div>
  </div>

  :
  <div>
        <div className="py-2">
         { numNotificaciones.length=== 0 ? 
         ''
         :  
         <div>
          {consultasProximasFiltradas.slice(0, 10).map((con) => (
          <div key={con._id}  className="bg-lila-300 rounded-md">
          < h1 className="text-white text-md px-0.5 font-regular font-semibold"> RECORDATORIO DE CONSULTA</h1>
          <p className="text-white text-sm px-0.5 font-regular">{con.paciente.nombres} recuerda que tienes una consulta para {new Date(con.fecha).toLocaleDateString()} a las {con.horarioinicio}  <span className="text-lg">📅</span> </p>
          </div>))}
          </div>
          }
          </div>
      <div className="   w-full bg-gray-700 rounded-lg">

          <div className=" flex justify-end">
          <button className=" pr-4  text-white rounded-lg text-sm py-0.5" onClick={handleSubmit}>Marcar todas como leidas</button>
          </div>
          
         { numNotificaciones.length=== 0 ? 
          <h1 className="text-white text-2xl text-center"> No hay Notificaciones...</h1>
         :    
         <div>
                                                  {motivosInterconsulta.slice(0, 10).map((con) => (
               <div key={con._id} className="mb-4 bg-gray-700 rounded-lg  px-10 py-4">
               {con.profesional.image?.public_id ?
                <Image cloudName="dde62spnz" publicId={con.profesional.image?.public_id}  width="50"></Image>
               :''}
                 <h1 className="text-blue-400">PROPUESTA DE INTERCONSULTA</h1> 
               <p className="text-white text-sm px-0.5 font-regular">El profesional <span className="font-semibold">{con.profesional.nombres} {con.profesional.apellidos} </span> 
                Sugiere generar una interconsulta para tu motivo: <span className="text-red-400">{con.motivoconsulta.titulo}</span> </p>
                <div className="border mr-1 border-gray-700 rounded-md px-0.5">
               <p className="text-gray-300 text-sm "> {""} </p>
               <p className="text-gray-300 text-sm ">¿Quieres que tu motivo sea visible para los siguientes profesionales?: <span className=" text-gray-200 font-semibold">{con.motivoconsulta.propuestainterconsulta}</span> </p>
               <p className="text-gray-300 text-sm ">Motivo de la interconsulta: <span className=" text-gray-200 font-semibold">{con.motivoconsulta.motivointerconsulta || ' '}</span> </p>
               <div className="flex text-regular text-xs gap-1 mb-1 flex-col md:flex-row md:items-center">
                <div className="flex-grow">
                  <button className="bg-green-600 px-2 py-2 text-md rounded-lg text-white mr-2 "  onClick={() =>  AceptarInterconsulta(con.motivoconsulta._id)}>Aceptar</button>
                </div>
                <button className="bg-red-600 px-0.5 py-0.5 rounded-lg text-white" onClick={() => Rechazarinterconsulta(con.motivoconsulta._id)}>Rechazar</button>
              </div>
                <hr />
               </div>
             </div>
        ))}
          
                  {consultasPendientes.slice(0, 10).map((con) => (
             <div key={con._id} className="mb-4 bg-gray-700 rounded-lg  px-10 py-4">
             {con.profesional.image?.public_id ?
              <Image cloudName="dde62spnz" publicId={con.profesional.image?.public_id}  width="50"></Image>
             :''}
            
            <h1 className="text-orange-400">PROPUESTA DE CONSULTA</h1> 
               
               <p className="text-white text-sm px-0.5 font-regular">El profesional <span className="font-semibold">{con.profesional.nombres} {con.profesional.apellidos} </span> 
                esta interesado en tu caso: <span className="text-red-400">{con.motivoconsulta.titulo}</span> </p>
                <div className="border mr-1 border-gray-700 rounded-md px-0.5">
               <p className="text-gray-300 text-sm "> {""} </p>
               <p className="text-gray-300 text-sm ">Fecha propuesta: { formatearFecha(con.fecha)} </p>
               <p className="text-gray-300 text-sm">Horario propuesto: {con.horarioinicio}{'-'}{con.horariofin}</p>
               <p className="text-gray-300 text-sm">Valor:{con.precio && !isNaN(parseFloat(con.precio))? `$${parseFloat(con.precio).toLocaleString('es-CL')}`: ''}</p>
               <div className="flex text-regular text-xs gap-1 mb-1 flex-col md:flex-row md:items-center ">
                <div className="flex-grow">
                  <button className="bg-green-600 px-2 py-2 text-md rounded-lg text-white mr-2"  onClick={() =>  handleCambiarEstadoAceptado(con._id)}>Aceptar</button>
                  <Link className="bg-blue-600 px-2 py-2 text-md rounded-lg text-white" to={`/paciente/vermas-consulta/${con._id}`}>Conocer Más</Link>
                </div>
                <button className="bg-red-600 px-0.5 py-0.5 rounded-lg text-white" onClick={() => handleCambiarEstado(con._id)}>Rechazar</button>
              </div>

               </div>
               <hr />
             </div>
      ))}
         <div>
         </div>
         </div>
         }
        
      </div>

       </div>


}
  </div>
  </>
)
}
export default FormularioNotTodas