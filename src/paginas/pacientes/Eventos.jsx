import React from 'react'
import { Link } from 'react-router-dom'
import HeaderHistoria from "../../components/pacienteComponents/HeaderHistoria"
import useAuth from "../../hooks/useAuth"
import FormularioEventos from '../../components/pacienteComponents/FormularioEventos'
const Eventos = () => {
  const {auth} =  useAuth()
  return (
    <>
      <div className="bg-lila-300 margen  py-1 pb-5 shadow-md dark:bg-slate-700 ">
    <nav className="nav font-regular text-white font-nunito ">
        <ul className="flex items-center dark:text-white">
            <li className="p-4  cursor-pointer active hover:text-slate-300 hover:underline">
            <Link to="/paciente/perfil-paciente"> <h2 className=" text-md">Perfil de usuario   </h2></Link>
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

      <FormularioEventos/>
    
    </>
  )
}

export default Eventos