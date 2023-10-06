import { Link } from 'react-router-dom'
import HeaderHistoria from "../../components/pacienteComponents/HeaderHistoria"
import { useState, useEffect } from "react"
import clientAxios from "../../config/axios"
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
const Diagnostico = () => {
  const { enfermedades, auth, setEnfermedades} =  useHistoriaCli()
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
  useEffect(()=>{
    const obtenerEnfermedades = async() =>{
      try {
        const token = localStorage.getItem('token')
        if(!token) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }
        const { data } = await clientAxios.get('/pacientes/obtener-enfermedad',config)
        setEnfermedades(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerEnfermedades()
  
  },[])

  return (
    <>
      <div className="bg-lila-300 margen  py-1 pb-5 shadow-md dark:bg-slate-700 ">
    <nav className="nav font-regular font-nunito text-white">
        <ul className="flex items-center dark:text-white">
            <li className="p-4  cursor-pointer active hover:text-slate-300 hover:underline">
            <Link to="/paciente/perfil-paciente"> <h2 className=" text-md">Perfil de usuario </h2></Link>
            </li>
            &gt;
            <li className="p-4 cursor-pointer  hover:text-slate-300 hover:underline">
            <Link to="/paciente/historia-clinica"> <h2 className="text-md ">Historia clinica</h2></Link>
            </li>
       
        </ul>
    </nav>

 

  <h1 className="text-left text-white xl:px-64 font-regular mt-4 font-nunito text-4xl dark:text-white shado"><span className="font-semibold"> {auth.nombres} {auth.apellidos}  </span> </h1>
       </div>
      <HeaderHistoria/>
      <div className="py-10 bg-gray-100  bg-opacity-50   ">

        {enfermedades.length ?
         <div className="mx-auto container max-w-6xl md:w-3/4 shadow-md bg-yellow-600 ">
         <div className="max-w-sm mx-auto md:w-full md:mx-0 ">
            <h1 className="text-white font-nunito px-3 py-3 mt-2">Tus diagnósticos</h1>
         </div>
       <div className="bg-white space-y-1 flex justify-center  ">
       <div className=" w-full">
 <div className="">{enfermedades.map(enf => (
   
   <div key={enf._id} className="py-0.5">
               <div className="mx-5 my-10 bg-white  shadow-md px-5 py-5 rounded-xl">
                
           <p className="font-bold text-2xl py-1 uppercase font-nunito text-slate-700 "> {enf.nombre}
               <span className="font-normal normal-case text-black"></span>
              
           </p>
           <hr />
           <p className="font-bold text-md py-1  font-nunito text-slate-700">Año de diagnóstico: {' '}
               <span className="font-normal normal-case font-nunito text-black"> {enf.fechadiagnostico} </span>

           </p>
           <p className="font-bold text-md py-1 font-nunito text-slate-700">Tratamiento: {' '}
               <span className="font-normal normal-case font-nunito text-black"> {enf.tratamiento} </span>

           </p>
           { enf.ultimocontrol === null || ' ' ?
           
           <p className="font-bold py-1  text-md font-nunito text-slate-700">Último control: {' '}
       </p>
           :
                       <p className="font-bold py-1  text-md font-nunito text-slate-700">Último control: {' '}
                       <span className="font-normal font-nunito normal-case text-black"> {formatearFecha(enf.ultimocontrol)} </span>
       
                   </p>
           }

           <p className="font-bold text-md py-1  font-nunito  text-slate-700">Examenes: {' '}
               <span className="font-normal normal-case font-nunito text-black"> {enf.examenes} </span>

           </p>
           <p className="font-bold text-md py-1   font-nunito text-slate-700">Propios del diagnóstico: {' '}
               <span className="font-normal font-nunito normal-case text-black"> {enf.obsdiagnostico} </span>

           </p>
           <p className="font-bold text-md py-1   font-nunito  text-slate-700">Eventos: {' '}
               <span className="font-normal  font-nunito normal-case text-black"> {enf.eventos} </span>

           </p>



         </div>

   </div>
))}   </div>
</div>

       

       </div>
     </div>
        :
        
        'Aún no has agregado diagnósticos de enfermedades a tu historia clínica'}
     
    </div>
    
    
    </>
  )
}

export default Diagnostico