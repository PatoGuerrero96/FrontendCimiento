import { useEffect,useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import clientAxios from "../../config/axios";
import { Image} from "cloudinary-react";
import useAuth from "../../hooks/useAuth"

const FormularioVerMasConsulta = () => {
    const [consulta, setConsulta] = useState([]);
    const [educacion, setEducacion] = useState([]);
    const [especialidad, setEspecialidad] = useState([]);
    const [experiencia, setExperiencia] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate()
    const {auth} =  useAuth()
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
      
        const fetchData = async () => {
          try {
            const response = await clientAxios.get(`/pacientes/ver-consulta/${id}`, config);
            if(Array.isArray(response.data)) {
              setConsulta(response.data);
            } else {
              setConsulta([response.data]);
            }
      
            // Agregar condición para asegurarse de que la propiedad `profesional._id` esté definida
            if (response.data && response.data.profesional && response.data.profesional._id) {
              const {data} = await clientAxios.get(`/pacientes/obtener-educacion-pro/${response.data.profesional._id}`, config);
              setEducacion(data)

            }
            if (response.data && response.data.profesional && response.data.profesional._id) {
                const {data} = await clientAxios.get(`/pacientes/obtener-experiencia-pro/${response.data.profesional._id}`, config);
                setExperiencia(data)
  
              }
              if (response.data && response.data.profesional && response.data.profesional._id) {
                const {data} = await clientAxios.get(`/pacientes/obtener-especialidad-pro/${response.data.profesional._id}`, config);
                setEspecialidad(data)
  
              }
      
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      
      }, []);


      const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const cumpleanos = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        const mes = hoy.getMonth() - cumpleanos.getMonth();
      
        if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
          edad--;
        }

        return edad;
      }
      const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
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
          
          if (!consulta || consulta.length === 0) {
            return <p>Cargando...</p>;
          }
          if (Array.isArray(consulta) && consulta.length > 0 && consulta[0].paciente !== auth._id) {
            return (
                <div className=" bg-coral-100 w-full h-screen flex flex-col items-center justify-center">

                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold  font-nunito md:text-6xl lg:text-9xl text-white  mt-12">403</h1>
                    <h2 className="text-3xl font-semibold  font-nunito md:text-4xl lg:text-5xl text-white mt-12">No tienes permiso</h2>
                    <img  className="h-96"  src="https://res.cloudinary.com/dde62spnz/image/upload/v1683307824/Imagenes%20sitio/mano_nvygfz.png" alt="" />
                    <p className="md:text-lg font-nunito  lg:text-xl text-white mt-8">Lo sentimos no tienes el permiso para ver esta sección</p>

                </div>
            </div>
              );
          }
        
  return (
    <> 

    <div className="bg-gray-100">
         {consulta.map((con) => (
  <div key={con._id}>


 <div className="w-full text-white bg-main-color">

        <div className=" bg-gray-500 flex flex-col  px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
            <div className=" p-4 flex flex-row items-center justify-between">
                <h1 className="text-2xl font-semibold  rounded-lg focus:outline-none focus:shadow-outline">
                        Propuesta para el motivo de consulta:
                        <span className="text-indigo-200 uppercase"> {con.motivoconsulta.titulo}</span></h1>
                <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline" >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                        <path fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                            clipRule="evenodd"></path>
                        <path  fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"></path>
                    </svg>
                </button>
            </div>
       
        </div>

    <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">

            <div className="w-full md:w-3/12 md:mx-2">

                <div className="bg-white p-3 border-t-4 border-green-400">
                    <div className="image flex justify-center ">
                    {con.profesional.image?.public_id ?
                <Image cloudName="dde62spnz" publicId={con.profesional.image?.public_id}  width="150"></Image>
               :''}
              
                    </div>
                    <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{con.profesional.nombres} {con.profesional.apellidos}</h1>
                    <h3 className="text-gray-600 font-lg text-semibold leading-6">{consulta.profesional && consulta.profesional.emailtrabajo && consulta.profesional.correovisible === true && consulta.profesional.emailtrabajo.length ? <span> Email: { con.profesional.emailtrabajo}</span>  : ""}</h3>
                    <h3 className="text-gray-600 font-lg text-semibold leading-6">{consulta.profesional && consulta.profesional.celulartrabajo && consulta.profesional.celularvisible ===true && consulta.profesional.celulartrabajo.length ? <span> Celular: {con.profesional.celulartrabajo}</span>  : ""}</h3>
                    <h3 className="text-gray-600 font-lg text-semibold leading-6">{con.profesional.numeroregistrosalud ? <span> Nº registro de salud: { con.profesional.numeroregistrosalud}</span>  : ""}</h3>
                    <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">{con.profesional.presentacion} </p>
                    <ul
                        className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow  py-2 px-3 mt-3  rounded shadow-sm">
                        <div className="flex justify-start gap-2   py-3">
                            <span className="font-semibold">Especialidad</span>
                         
                        </div>
                            {especialidad.length > 0 && especialidad.map((espe) => (
                             <span key={espe._id} className=" ">{espe.nombre} </span>
                            ))}
                            <div className="divide-y">
                        <li className="flex  justify-start gap-2  py-3">
                            <span>Edad:</span>
                            <span className="">{calcularEdad(con.profesional.fechaNacimiento)}{' años'} </span>
                        </li>
                        <li className="flex justify-start gap-2  py-3">
                            <span>Genero:</span>
                            <span className="">{con.profesional.sexo} </span>
                        </li>
                        </div>
                    </ul>
                </div>

                <div className="my-4"></div>

                <div className="bg-white p-3 hover:shadow">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2">
                        <div>
                            <div className="flex items-center space-x-1 font-semibold text-gray-900 leading-8 mb-3">
                                <span clas="text-green-500">
                                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                <span className="tracking-wide">Experiencia</span>
                            </div>
                            {experiencia.length > 0 && experiencia.map((exp) => (
    <ul key={exp._id} className="list-inside space-y-2">
        <li >
            <div className="text-teal-600">{exp.nombre}</div>
            <div className="text-gray-500 text-xs">{exp.fechainicio} - {exp.fechafin}</div>
        </li>
    </ul>
))}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span clas="text-green-500">
                                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path fill="#fff"
                                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                </span>
                                <span className="tracking-wide">Educación</span>
                            </div>
                            {educacion.length > 0 && educacion.map((tar) => (
    <ul key={tar._id} className="list-inside space-y-2">
        <li >
            <div className="text-teal-600">{tar.nombre}</div>
            <div className="text-gray-500 text-xs">{tar.fechainicio} - {tar.fechafin}</div>
        </li>
    </ul>
))}
                        </div>
                    
                    </div>
                </div>

            </div>

            <div className="w-full md:w-9/12 mx-2 h-64">

                <div className="bg-white p-3 shadow-sm rounded-sm">
                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                        <span clas="text-green-500">
                            <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <span className=" text-lg tracking-wide">Propuesta de consulta</span>
                    </div>
                    <div className="text-gray-700">
                        <div className="grid md:grid-cols-2 text-sm">
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg font-semibold">Fecha:</div>
                                <div className="px-4 py-2 text-lg ">{formatearFecha(con.fecha)} </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg  font-semibold">Hora de inicio:</div>
                                <div className="px-4 text-lg  py-2">{con.horarioinicio}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg  font-semibold">Hora de termino:</div>
                                <div className="px-4 py-2 text-lg ">{con.horariofin}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg  font-semibold">Precio de la consulta:</div>
                                <div className="px-4 py-2 text-lg ">
                                {con.precio && !isNaN(parseFloat(con.precio))? `$${parseFloat(con.precio).toLocaleString('es-CL')}`: ''}
                                </div>
                            </div>
                          
                       
                        </div>
                        <div className="bg-white p-3 shadow-sm rounded-md flex-grow border px-10 ">
                           <p className="text-center text-lg font-bold  text-gray-600">Mensaje del profesional</p>
                            <p className="text-center text-lg bg-red-100 rounded-lg  italic "> {' "" '} {con.mensaje}{' "" '}</p>
                      </div>
                    </div>
                </div>
     

                <div className="my-4"></div>

    
                <div className="bg-white p-3 shadow-sm rounded-sm">
                           <p className="text-center text-lg font-bold text-gray-600">Tu Mótivo de consulta</p>
                    <div className="grid grid-cols-3">
                        <div>
                        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span className="text-green-500">
                                <svg className="h-10" id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path className="cls-1"fill="#231f20"  d="m136.72,197.98h.01c.92,0,1.83-.35,2.52-1l39.4-37.23c.74-.71,1.11-1.67,1.12-2.66.39-.65.63-1.4.63-2.22V16.93c0-8.6-6.98-15.6-15.56-15.6H33.67c-8.57,0-15.55,7-15.55,15.6v166.48c0,8.6,6.98,15.59,15.55,15.59h100.29c1.05,0,2.01-.39,2.76-1.02Zm3.69-12.22v-14.31c0-5.9,4.79-10.71,10.68-10.71h15.79l-26.46,25.02Zm-10.76,4.59H33.67c-3.82,0-6.92-3.12-6.92-6.94V16.93c0-3.83,3.1-6.94,6.92-6.94h131.18c3.81,0,6.92,3.11,6.92,6.94v133.61h-20.16c-12.11,0-21.97,9.88-21.97,22.02v17.8Z"/>
  <path className="cls-1" fill="#231f20" d="m51.72,58.86h95.08c2.39,0,4.32-1.94,4.32-4.33v-7.76c0-2.39-1.93-4.33-4.32-4.33H51.72c-2.39,0-4.32,1.94-4.32,4.33v7.76c0,2.39,1.93,4.33,4.32,4.33Zm.86-11.21h93.35v6.02H52.59v-6.02Z"/>
  <path className="cls-1" fill="#231f20" d="m51.72,85.99h95.08c2.39,0,4.32-1.94,4.32-4.33v-7.75c0-2.39-1.93-4.33-4.32-4.33H51.72c-2.39,0-4.32,1.94-4.32,4.33v7.75c0,2.39,1.93,4.33,4.32,4.33Zm.86-11.21h93.35v6.02H52.59v-6.02Z"/>
  <path className="cls-1" fill="#231f20" d="m151.12,108.79v-7.75c0-2.39-1.93-4.33-4.32-4.33H51.72c-2.39,0-4.32,1.94-4.32,4.33v7.75c0,2.39,1.93,4.33,4.32,4.33h95.08c2.39,0,4.32-1.94,4.32-4.33Zm-5.18-.86H52.59v-6.02h93.35v6.02Z"/>
</svg>
                                </span>
                                <span className="tracking-wide">Mótivo</span>
                            </div>
                            <ul className="list-inside space-y-2">
                                <li>
                                    <div className="text-gray-700">{con.motivoconsulta.titulo} </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span className="text-gray-500">
                                <svg className="h-10" id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                               <path className="cls-1" d="m171.83,21H28.55c-14.63,0-26.54,11.9-26.54,26.54v91.81c0,14.63,11.9,26.54,26.54,26.54h93.19l48.04,32.24c.86.58,1.85.87,2.85.87.83,0,1.65-.2,2.41-.6,1.67-.89,2.71-2.63,2.71-4.52v-30.53c9.34-3.95,20.61-12.52,20.61-23.99V47.54c0-14.64-11.9-26.54-26.54-26.54Zm16.29,118.35c0,6.01-8.97,13.01-17.02,15.54-2.13.68-3.59,2.65-3.59,4.89v24.49l-41.36-27.76c-.84-.56-1.84-.87-2.85-.87H28.55c-8.98,0-16.29-7.31-16.29-16.29V47.54c0-8.99,7.31-16.3,16.29-16.3h143.28c8.99,0,16.29,7.31,16.29,16.3v91.81Z"/>
                               <path className="cls-1" d="m160.46,55.15H39.61c-5.31,0-9.63,4.32-9.63,9.64s4.32,9.63,9.63,9.63h120.85c5.31,0,9.63-4.32,9.63-9.63s-4.32-9.64-9.63-9.64Zm0,13.12H39.61c-1.92,0-3.49-1.57-3.49-3.49s1.56-3.49,3.49-3.49h120.85c1.92,0,3.48,1.57,3.48,3.49s-1.57,3.49-3.48,3.49Z"/>
                               <path className="cls-1" d="m160.46,83.4H39.61c-5.31,0-9.63,4.32-9.63,9.64s4.32,9.63,9.63,9.63h120.85c5.31,0,9.63-4.32,9.63-9.63s-4.32-9.64-9.63-9.64Zm0,13.12H39.61c-1.92,0-3.49-1.56-3.49-3.48s1.56-3.49,3.49-3.49h120.85c1.92,0,3.48,1.57,3.48,3.49s-1.57,3.48-3.48,3.48Z"/>
                               <path className="cls-1" d="m160.46,110.67H39.61c-5.31,0-9.63,4.32-9.63,9.63s4.32,9.63,9.63,9.63h120.85c5.31,0,9.63-4.32,9.63-9.63s-4.32-9.63-9.63-9.63Zm0,13.12H39.61c-1.92,0-3.49-1.56-3.49-3.49s1.56-3.48,3.49-3.48h120.85c1.92,0,3.48,1.56,3.48,3.48s-1.57,3.49-3.48,3.49Z"/>
                             </svg>
                               
                                </span>
                                <span className="tracking-wide">Descripción del motivo de consulta</span>
                            </div>
                            <ul className="list-inside space-y-2">
                                <li>
                                    <div className="text-gray-700">{con.motivoconsulta.descripcion} </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span className="text-green-500">
                                <svg className="h-10" id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                                     <path  fill="#231f20"d="m164.05,35.44c-17.2-17.67-40-27.3-64.07-27.12C50.19,8.67,9.98,51.09,10.33,102.88c.18,25.03,9.72,48.51,26.86,66.14,17.04,17.51,39.52,27.12,63.38,27.12.23,0,.46,0,.69,0,49.79-.36,90.01-42.8,89.64-94.59-.16-25.01-9.7-48.48-26.86-66.1Zm-62.86,151.84c-21.62.2-42.15-8.51-57.65-24.44-15.54-15.98-24.2-37.29-24.36-60.02-.32-46.9,35.96-85.32,80.86-85.65h.58c21.47,0,41.72,8.67,57.07,24.45,15.55,15.98,24.2,37.28,24.35,59.99.33,46.91-35.94,85.34-80.86,85.67Z"/>
                                     <path   d="m152.41,104.61h-50.34v-54.18c0-3.48-2.83-6.3-6.3-6.3s-6.3,2.83-6.3,6.3v60.48c0,3.48,2.83,6.3,6.3,6.3h56.64c3.48,0,6.3-2.83,6.3-6.3s-2.83-6.3-6.3-6.3Z"/>
                                   </svg>
                               
                                </span>
                                <span className="tracking-wide">Fecha de publicación</span>
                            </div>
                            <ul className="list-inside space-y-2">
                                <li>
                                    <div className="text-gray-700"> {formatearFecha(con.motivoconsulta.fecha)} </div>
                                </li>

                            </ul>
                        </div>
                    </div>
    
                </div>
                <div className="my-4"></div>
                <div className="bg-white p-3 shadow-sm rounded-sm">
                    <h1 className="text-gray-700 text-center py-2 text-xl">¿Quieres tomar esta propuesta de consulta?</h1>
                    <div className="grid grid-cols-2">
                    <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 mb-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() =>  handleCambiarEstadoAceptado(con._id)}>
           Aceptar
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 mb-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => handleCambiarEstado(con._id)}>
            Rechazar
          </button>
          
                    </div>
                    </div>
  
            </div>
        </div>
    </div>
</div>


</div>
))}
</div>
    </>
  )
}
export default FormularioVerMasConsulta