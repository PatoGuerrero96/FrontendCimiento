import { useEffect,useState } from "react";
import { useParams,Link } from 'react-router-dom';
import clientAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth"
import moment from "moment";
import { IoMdCloseCircle} from "react-icons/io";
import { TfiNotepad} from "react-icons/tfi";
import { Image} from "cloudinary-react";
const FormularioConsultaAprobada = () => {
    const [consulta, setConsulta] = useState([]);
    const [educacion, setEducacion] = useState([]);
    const [especialidad, setEspecialidad] = useState([]);
    const [experiencia, setExperiencia] = useState([]);
    const [timeLeft, setTimeLeft] = useState({});
    const { id } = useParams();
    const {auth} =  useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preguntaspro, setPreguntaspro] = useState({});
    const [loading, setLoading] = useState(true); 
    const [originalPreguntaspro, setOriginalPreguntaspro] = useState({});
    const [datosGuardados, setDatosGuardados] = useState(false);
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
    const handleButtonClick = () => {
      setIsModalOpen(true);
    };
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
          const { data } = await clientAxios.get(`/pacientes/vermas-consulta-aprobada/${id}`, config);
          setConsulta(data);

    
          // Agregar condición para asegurarse de que la propiedad `profesional._id` esté definida
          if (data.profesional && data.profesional._id) {
            const { data: educacionData } = await clientAxios.get(`/pacientes/obtener-educacion-pro/${data.profesional._id}`, config);
            setEducacion(educacionData);
          }
    
          if (data.profesional && data.profesional._id) {
            const { data: experienciaData } = await clientAxios.get(`/pacientes/obtener-experiencia-pro/${data.profesional._id}`, config);
            setExperiencia(experienciaData);
          }
    
          if (data.profesional && data.profesional._id) {
            const { data: especialidadData } = await clientAxios.get(`/pacientes/obtener-especialidad-pro/${data.profesional._id}`, config);
            setEspecialidad(especialidadData);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, []);
      useEffect(() => {
        const intervalId = setInterval(() => {
          if (!consulta.fecha || !consulta.horarioinicio) return;
      
          const now = new Date().getTime();
          const fechaConsulta = moment(consulta.fecha).format("YYYY-MM-DD");
          const horaInicio = moment(consulta.horarioinicio, "HH:mm").format("HH:mm");
          const countDownDate = new Date(`${fechaConsulta} ${horaInicio}`).getTime();
          const distance = countDownDate - now;
      
          if (distance < 0) {
            clearInterval(intervalId);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
            setTimeLeft({ days, hours, minutes, seconds });
          }
        }, 1000);
      
        return () => clearInterval(intervalId);
      }, [consulta]);
      const actualizarPreguntasPaciente = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        try {
          await clientAxios.put(`/pacientes/actualizar-preguntas-paciente/${consulta._id}`, preguntaspro,config);
          Swal.fire('¡Perfecto!', 'Apuntes actualizados', 'success');  
          setOriginalPreguntaspro({}); // Restablecer los datos originales después de guardar  
          setDatosGuardados(true); // Establecer que los datos han sido guardados        
       
        } catch (error) {
          console.error(error.message);
          // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
        }
      };
      const hasChanges = () => {
        const originalDataJSON = JSON.stringify(originalPreguntaspro);
        const modifiedDataJSON = JSON.stringify(preguntaspro);
      
        return originalDataJSON !== modifiedDataJSON;
      };
      const closeModal = async () => {
        // Verificar si hay cambios en el modal
        const changed = hasChanges();
      
        if (changed && !datosGuardados) {
          // Mostrar cuadro de diálogo de confirmación
          const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Si cierras el modal, se perderán los cambios realizados. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
          });
      
          if (result.isConfirmed) {
            // Restablecer los datos a los originales
            setPreguntaspro(originalPreguntaspro);
            setIsModalOpen(false);
            window.location.reload();
          }
        } else {
          setIsModalOpen(false);
        }
      };
      const handleChangePreguntas = (e) => {
        const { name, value } = e.target;
        setPreguntaspro((prevState) => ({
          ...prevState,
          [name]: value
        }));
        setDatosGuardados(false); // Actualizar la bandera de datos guardados
      };

      useEffect(() => {
        if (consulta) {
          setPreguntaspro(consulta);
          setOriginalPreguntaspro(consulta);
          setLoading(false);
          setDatosGuardados(true); // Establecer inicialmente como datos guardados
        }
      }, [consulta]);

          if (!consulta || consulta.length === 0) {
            return <p>Cargando...</p>;
          }

          if (consulta && consulta.paciente._id !== auth._id) {
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

          if (consulta && consulta.estado !== 'pagado') {
            return (
              <div className=" bg-coral-100 w-full h-screen flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold  font-nunito md:text-6xl lg:text-9xl text-white  mt-12">Oops...</h1>
                  <h2 className="text-3xl font-semibold  font-nunito md:text-4xl lg:text-5xl text-white mt-12 mb-2">Aún no llega la hora de tu consulta o ya finalizó</h2>
                  <img  className="h-96"  src="https://res.cloudinary.com/dde62spnz/image/upload/v1686923841/Imagenes%20sitio/calendario_tzdciz.png" alt="" />
                  <Link className=" bg-lila-300 px-2 py-2 rounded-md text-2xl font-semibold  font-nunito md:text-2xl lg:text-2xl text-white mt-12" to="/paciente">Volver al inicio</Link>
              </div>
          </div>
              );
          }


  return (
    <>
<div>
{consulta.estado === "pagado" ? (
    <div>
 <div className="container mx-auto py-6">

<div className="bg-gray-200 p-4 rounded-lg shadow-lg">
  {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
    <p className="text-lg font-bold">Ya llegó la hora de tu consulta</p>
  ) : (
    <>
      <p className="text-lg font-bold mb-2">Tiempo restante para la próxima consulta:</p>
      <div className="flex items-center">
        <div className="text-4xl font-bold mr-2">{timeLeft.days}</div>
        <div className="text-gray-600 mr-4">días</div>
        <div className="text-4xl font-bold mr-2">{timeLeft.hours}</div>
        <div className="text-gray-600 mr-4">horas</div>
        <div className="text-4xl font-bold mr-2">{timeLeft.minutes}</div>
        <div className="text-gray-600 mr-4">minutos</div>
        <div className="text-4xl font-bold mr-2">{timeLeft.seconds}</div>
        <div className="text-gray-600">segundos</div>
      </div>
    </>
  )}
</div>

</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-20">
<div className="p-4 bg-gray-200">
  <div className=" mb-4">
  <div className="bg-white p-3 border-t-4 border-green-400">
    <h1 className="text-center text-2xl">Presentación del profesional</h1>
                    <div className="image flex justify-center ">
                    {consulta.profesional.image?.public_id ?
                <Image cloudName="dde62spnz" publicId={consulta.profesional.image?.public_id}  width="150"></Image>
               :''}
              
                    </div>
                    <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{consulta.profesional.nombres} {consulta.profesional.apellidos}</h1>
                    <h3 className="text-gray-600 font-lg text-semibold leading-6">{consulta.profesional && consulta.profesional.emailtrabajo && consulta.profesional.correovisible === true && consulta.profesional.emailtrabajo.length ? <span> Email: { consulta.profesional.emailtrabajo}</span>  : ""}</h3>
                    <h3 className="text-gray-600 font-lg text-semibold leading-6">{consulta.profesional && consulta.profesional.celulartrabajo && consulta.profesional.celularvisible ===true && consulta.profesional.celulartrabajo.length ? <span> Celular: {consulta.profesional.celulartrabajo}</span>  : ""}</h3>
                    <h3 className="text-gray-600 font-lg text-semibold leading-6">{consulta.profesional.numeroregistrosalud ? <span> Nº registro de salud: { consulta.profesional.numeroregistrosalud}</span>  : ""}</h3>
                    <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">{consulta.profesional.presentacion} </p>
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
                            <span className="">{calcularEdad(consulta.profesional.fechaNacimiento)}{' años'} </span>
                        </li>
                        <li className="flex justify-start gap-2  py-3">
                            <span>Genero:</span>
                            <span className="">{consulta.profesional.sexo} </span>
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

</div>
  <div className="p-4 bg-gray-200">

    {consulta.link?  
  <div className=" mt-4">
  <div className="  flex items-center justify-center">
<a href={consulta.link} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-neutral-200 px-10 py-3 text-2xl font-semibold  border-neutral-400 border-2 text-lila-300 hover:text-white hover:shadow-[inset_18rem_0_0_0] hover:shadow-blue-400 duration-[400ms,700ms] transition-[color,box-shadow]">
    Link de la consulta
</a>
</div>
<div className="flex justify-center py-2 hover:text-blue-400">
  <a href={consulta.link} target="_blank" rel="noopener noreferrer">Ó bien ingresa aquí</a>
</div>

  </div>
  :<p className="text-center text-lila-300 font-semibold" >Aún no hay link para tu teleconsulta</p>} 
  <div className=" mt-4">
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
                                <div className="px-4 py-2 text-lg ">{formatearFecha(consulta.fecha)} </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg  font-semibold">Hora de inicio:</div>
                                <div className="px-4 text-lg  py-2">{consulta.horarioinicio}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg  font-semibold">Hora de termino:</div>
                                <div className="px-4 py-2 text-lg ">{consulta.horariofin}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-2 text-lg  font-semibold">Precio de la consulta:</div>
                                <div className="px-4 py-2 text-lg ">
                                {consulta.precio && !isNaN(parseFloat(consulta.precio))? `$${parseFloat(consulta.precio).toLocaleString('es-CL')}`: ''}
                                </div>
                            </div>
                          
                       
                        </div>
                        <div className="bg-white p-3 shadow-sm rounded-md flex-grow border px-10 ">
                           <p className="text-center text-lg font-bold  text-gray-600">Mensaje del profesional</p>
                            <p className="text-center text-lg bg-red-100 rounded-lg  italic "> {' "" '} {consulta.mensaje}{' "" '}</p>
                      </div>
                    </div>
                </div>
  </div>
  </div>
</div>
</div>
) : ''}
<div className="fixed bottom-4 right-8">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="absolute inset-0 bg-black opacity-50"></div>

  <div className=" p-4rounded-lg z-10 w-[600px] relative ">
  <div className=" bg-stone-700 text-white rounded-t"> 
  <div className=" flex justify-end px-2">   <button onClick={closeModal}>  <IoMdCloseCircle className="text-3xl hover:text-stone-400 mt-1"/> </button></div>
<div ><h1 className="text-center  ">Preguntas/Recordatorios/Dudas</h1></div>

  </div>

    <div className="bg-amber-100 ">
    <div className="flex bg-blue-500 rounded-b p-4 mb-4 text-sm text-white" role="alert">
    <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>        <div>
            <span className="font-medium">Los apuntes que tomes son privados y solo estarán visibles para ti.</span>
        </div>
    </div>
    <textarea
      className="font-normal font-nunito w-full outline-none border-none text-black resize-none bg-transparent  p-2 lined-textarea"
      name="preguntaspaciente"
      value={preguntaspro.preguntaspaciente || ''}
      onChange={handleChangePreguntas}
      rows={20}
    ></textarea>
    <div className="flex justify-center"> 
    <button
      className="px-3  py-2 text-md  rounded-md text-center mb-2 text-white bg-stone-700 hover:bg-stone-800"
      onClick={actualizarPreguntasPaciente}
    >
      Actualizar 
    </button></div>

 
  </div>
  </div>

</div>

      )}
      <div className="flex justify-center ">
      <button
        className="  bg-stone-700 hover:bg-stone-500 text-white text-xs py-2 px-2 rounded-full"
        onClick={handleButtonClick}>
        <TfiNotepad className=" ml-3.5 text-xl text-amber-500"/>
        <h1 className=" flex justify-center text-xs">Preguntas</h1>
      </button>  
    </div>
    </div>
  </div>
    </>
  )
}

export default FormularioConsultaAprobada