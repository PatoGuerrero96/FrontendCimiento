import React from 'react'
import { Link } from 'react-router-dom'
import HeaderHistoria from "../../components/pacienteComponents/HeaderHistoria"
import useAuth from "../../hooks/useAuth"
import { useState,useEffect } from 'react'
import clientAxios from '../../config/axios'
import Historiaclinicapdf from '../../components/pacienteComponents/Historiaclinicapdf'
const SeguimientoConsultas = () => {
  const {auth} =  useAuth()
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerConsultas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await clientAxios.get('/pacientes/obtener-consultas', config);
      const consultasFiltradas = response.data.filter(
        (consulta) => consulta.estado === 'finalizado' ||  consulta.estado === 'pagado' &&  consulta.paciente === auth._id
      );
      setConsultas(consultasFiltradas);
      setCargando(false); // Establecer cargando en false cuando se obtengan las consultas
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    obtenerConsultas();
  }, []);
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
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

 

  <h1 className="text-left xl:px-64 font-regular text-white mt-4 font-nunito text-4xl dark:text-white shado"><span className="font-semibold"> {auth.nombres} {auth.apellidos}  </span> </h1>
       </div>
      <HeaderHistoria/>
<div className='flex justify-center p-4'>
  <div className=' bg-lila-300 hover:bg-lila-100  max-w-lg px-3 py-1 rounded-md text-white'>
  <Historiaclinicapdf/>
  </div>

</div>
  <div className="flex flex-col items-center p-4">
    {cargando ? (
      <p>Cargando consultas...</p>
    ) : (
      consultas.map((consulta) => (
        <div key={consulta._id} className="bg-white shadow rounded-lg w-full max-w-xl p-4 mb-4">
          <div className="flex items-center mb-2">
          {consulta.profesional.image ? (
  <img
    src={consulta.profesional.image.secure_url}
    className="w-12 h-12 rounded-full mr-2"
    alt="Imagen del profesional"
  />
) : (
  <img
    src="https://res.cloudinary.com/dde62spnz/image/upload/v1684334055/Imagenes%20sitio/sinfoto_bm34kj.png"
    className="w-12 h-12 rounded-full mr-2"
    alt="Imagen predeterminada"
  />
)}
            <h2 className="text-lg font-semibold text-gray-700">Profesional:</h2>

            <h3 className="text-lg ">{consulta.profesional.nombres} {consulta.profesional.apellidos}</h3>
          </div>
          <p className="text-gray-700 text-justify">{consulta.motivoconsulta.titulo || ''}</p>
          <p className="text-gray-700 text-justify ">{consulta.motivoconsulta.descripcion || ''}</p>
          <p className="text-gray-700 text-justify text-md "> <span className='font-bold'>Registro de la consulta:</span> {consulta.registro || ''}</p>
          <div className=" border-b pt-2 text-gray-500">
            <p className='text-sm'> <span className='font-bold'>Fecha: </span>{ formatearFecha(consulta.fecha)  || ''}</p>
          </div>
          <div className="flex justify-end mt-2">
            <Link to= {`/paciente/vermas-seguimiento-consulta/${consulta._id}`}className="text-indigo-500 font-medium">Ver más</Link>
          </div>

        </div>
      ))
    )}
  </div>


    </>
  )
}

export default SeguimientoConsultas