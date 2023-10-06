import React from 'react'
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react'
import HeaderHistoria from "../../components/pacienteComponents/HeaderHistoria"
import clientAxios from '../../config/axios'
import TablaExamenesPendientes from '../../components/pacienteComponents/TablaExamenesPendientes'
import Alerta from "../../components/Alerta"
import useHistoriaCli from '../../hooks/paciente/useHistoriaCli'
const ExamenesPendientes = () => {
  const [enfermedades, setEnfermedades] = useState([]);
  const [alerta, setAlerta ]= useState({})
  const {nombre,setNombre,enfermedadId,setEnfermedadId,documento,setDocumento, guardarExamen,auth} =  useHistoriaCli()

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nombre  || !documento) {
      setAlerta({ msg: 'Hay campos vacíos', error: true });
      setTimeout(() => setAlerta({}), 4000);
      return;
    }
    const resultado = await guardarExamen();
    if (resultado && resultado.error) {
      setAlerta({ msg: 'Error al subir el examen, revise el formato', error: true });
      setTimeout(() => setAlerta({}), 5000);
      return;
    }
    setNombre('');
    setDocumento('');
    setEnfermedadId({});
  };
  const { msg } = alerta
  return (
    <>
      <div className="bg-lila-300 margen  py-1 pb-5 shadow-md dark:bg-slate-700 ">
    <nav className="nav font-regular font-nunito text-white ">
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

 

  <h1 className="text-left xl:px-64  text-white font-regular mt-4 font-nunito text-4xl dark:text-white "><span className="font-semibold"> {auth.nombres} {auth.apellidos}  </span> </h1>
       </div>
      <HeaderHistoria/>
      <div  className='mt-10' >
        <div className='flex justify-center'>
        <div className=' text-center  w-5/12'>

        </div>
        </div>
        <h1 className='text-4xl text-center text-lila-300 font-bold py-4'>Registra tus examenes pendientes</h1>
    </div>

    <TablaExamenesPendientes/>
    </>
  )
}

export default ExamenesPendientes