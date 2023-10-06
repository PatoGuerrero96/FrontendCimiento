import React, { useState,useEffect } from "react";
import useAuth from "../../hooks/useAuth"
import clientAxios from "../../config/axios";


const Notificaciones = () => {
    const [motivos, setMotivos] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const { auth} =  useAuth()
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
        const { data } = await clientAxios.get('/pacientes/obtener-motivodeconsultas',config)
        setMotivos(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerMotivosConsulta()      
  },[motivos])
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
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerMotivosConsulta()      
  },[consultas])

  const  motivosfiltrados = motivos
  .filter(motivo => motivo.estado === "publicado"&& consultas.some( con => con.motivoconsulta===motivo._id && con.paciente===auth._id && con.estado==='pendiente' ) ) // Filtrar motivos publicados

  return (
    <>

            {motivosfiltrados.map((motivo) => (
        <div key={motivo._id} className="bg-white rounded-lg shadow-md w-full mb-10  ">
          {motivo.titulo}
        

         </div>
        ))}
    
    </>
  )
}

export default Notificaciones
