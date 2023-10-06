import { useState, useEffect } from "react"
import clientAxios from "../../config/axios"
import useAuth from "../../hooks/useAuth"
import Alerta from "../Alerta"
import { Link } from "react-router-dom"
import{AiFillEdit, AiFillDelete} from "react-icons/ai"
import{IoMdEyeOff,IoMdEye} from "react-icons/io"
import { Paginacion } from "../Paginacion"
import FormularioCalendario from "./FormularioCalendario"
import { IoMdCloseCircle} from "react-icons/io";
import { BsFillCalendarWeekFill} from "react-icons/bs";

const FormularioMotivoConsulta = () => {
    const [alerta, setAlerta ]= useState({})
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [consentimiento, setConsentimiento] = useState(false)
    const [visible, setVisible] = useState(false)
    const [id, setId] = useState(null)
    const { motivo,guardarMotivoConsulta,motivos, setMotivos, setEdicionMotivo,eliminarMotivoConsulta} =  useAuth()
    const [pagina, setPagina] = useState (1);
   const [porPagina, setPorPagina] = useState (3);
   const [isLoading, setIsLoading] = useState(true);
   const [especialidad, setEspecialidad] = useState('');
   const [profesionales, setProfesionales] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [horarios, setHorarios] = useState([]);
   const [mostrarModalHorarios, setMostrarModalHorarios] = useState(false);
   const [mostrarCalendario, setMostrarCalendario] = useState(false);

   const [loading, setLoading] = useState(true);
   const handleModalOpen = () => {
    setShowModal(true);
    setTimeout(handleModalClose, 10000); 
  };
  
  const handleModalClose = () => {
    setShowModal(false);
  };

    
    const maximo = Math.ceil(motivos.length / porPagina) 

    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

        useEffect(() => {
          if (motivo?.titulo) {
            setTitulo(motivo.titulo);
            setDescripcion(motivo.descripcion);
            setConsentimiento(motivo.consentimiento);
            setVisible(motivo.visible);
            setId(motivo._id);
        
            if (motivo.especialidades !== 'General') {
              setEspecialidad('especifico');
              setProfesionales(motivo.especialidades.split(', '));
            } else {
              setEspecialidad('general');
              setProfesionales([]);
            }
          }
        }, [motivo]);


     useEffect(() => {
      const obtenerMotivosConsulta = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
    
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await clientAxios.get('/pacientes/obtener-motivodeconsultas', config);
    
          // Filtrar motivos activos
          const motivosActivos = data.filter((motivo) => motivo.activo);
    
          setMotivos(motivosActivos);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
    
      obtenerMotivosConsulta();
    }, []);
    const obtenerHorarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await clientAxios.get('/pacientes/ver-MiHorario', config);
        setHorarios(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    
    useEffect(() => {
      obtenerHorarios();
    }, []);
    

    const AbrirModalCalendario = () => {
      setMostrarCalendario(true);  
      };


    const handleCerrarModal = () => {
      setMostrarModalHorarios(false);
    };
    const CerrarModalCalendario = () => {
      setMostrarCalendario(false);
    };

      const actualizarVisible = async (id, nuevoValorVisible) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
    
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
    
          // Mostrar SweetAlert para confirmar la acción
          const resultado = await Swal.fire({
            title: `¿Quieres ${
              nuevoValorVisible ? 'hacer VISIBLE' : 'OCULTAR'
            } este motivo de consulta?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          });
    
          if (resultado.isConfirmed) {
            await clientAxios.put(`/pacientes/actualizar-motivovisible/${id}`, { visible: nuevoValorVisible }, config);
            setMotivos((prevState) =>
              prevState.map((motivos) =>
                motivos._id === id ? { ...motivos, visible: nuevoValorVisible } : motivos
              )
            );
            Swal.fire('¡Listo!', 'El motivo de consulta ha sido actualizado.', 'success');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('¡Ups!', 'Hubo un error al actualizar el motivo de consulta.', 'error');
        }
      };
      const handleMotivoChange = (event) => {
        setEspecialidad(event.target.value);
        setProfesionales([]);
      };
    
      const handleProfesionalesChange = (event) => {
        const { value, checked } = event.target;
        const formattedValue = value.toLowerCase(); // Convertir el valor a minúsculas (o mayúsculas si lo prefieres)
        
        if (checked) {
          setProfesionales((prevProfesionales) => {
            const formattedProfesionales = prevProfesionales.map(profesional => profesional.toLowerCase()); // Convertir los valores existentes a minúsculas (o mayúsculas)
            
            if (formattedProfesionales.includes(formattedValue)) {
              return prevProfesionales; // Evitar agregar la especialidad si ya está en el array
            } else {
              return [...prevProfesionales, value]; // Agregar la nueva especialidad
            }
          });
        } else {
          setProfesionales((prevProfesionales) =>
            prevProfesionales.filter((profesional) => profesional.toLowerCase() !== formattedValue) // Convertir los valores existentes a minúsculas (o mayúsculas)
          );
        }
      };
      
      

            //AGREGANDO MOTIVO DE CONSULTA
            const handleSubmit = async e =>{
            e.preventDefault();
            if([titulo, descripcion].includes('')){
                setAlerta({msg: 'Hay campos vacíos', error: true})
                setTimeout(()=> setAlerta({}),5000)
                return;
            }
            if (!consentimiento) {
                setAlerta({msg: 'Acepte el consentimiento antes de publicar su caso', error: true})
                setTimeout(()=> setAlerta({}),5000)
                return;
              }
              if (!especialidad ) {
                setAlerta({msg: 'Agregue quien debe ver este motivo de consulta', error: true})
                setTimeout(()=> setAlerta({}),5000)
                return;
              }
            setAlerta({})
            let especialidades = '';
            if (especialidad === 'general') {
              especialidades = 'General';
            } else if (especialidad === 'especifico') {
              especialidades = profesionales.join(', ');
            }

           await guardarMotivoConsulta({titulo,descripcion,visible,consentimiento,id,especialidades})
           setTimeout(() => {
            if (!loading && horarios.length === 0 && visible===true) {
              setMostrarModalHorarios(true);
            
            }
          }, 2000);
            setTitulo('')
            setDescripcion('')
            setId('')
            setConsentimiento(false)
            setVisible(false)
            setProfesionales([]);


            }
            const { msg } = alerta
  return (
    <>
        <div className="flex flex-col lg:flex-row h-screen">
          
        <div className="lg:w-1/3 bg-gray-200 p-10 shadow-lg mr-20 lg:mr-0">
        {msg && <Alerta alerta={alerta} />}
        <div className=" bg-lila-300 rounded-t">
        <h1 className=" text-white py-5 text-xl text-center mt-8 ">Publica tu motivo de consulta</h1>
    
        </div>
  <form onSubmit={handleSubmit} className="bg-lila-100 px-7 py-7 rounded-b ">
    
    <label className=" text-white" htmlFor="campo1">¿Cúal es tu motivo de consulta? <span className="text-red-600 text-lg">*</span></label>
    <textarea
      type="text"
      id="campo1"
      name="titulo"
      placeholder="escribe aquí tu motivo de consulta en la forma que quieras. (ej. “me duele la cabeza”, “siento mucha ansiedad”)"
      className="w-full focus:outline-none focus:text-gray-900 mb-1 border border-gray-300 rounded-md placeholder-slate-400 p-2 placeholder:text-xs "
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
    />
  

    <label className="text-white" htmlFor="campo2 ">Describe tu consulta <span className="text-red-600 text-lg">*</span></label>
    <textarea
      type="text"
      id="campo2"
      name="descripcion"
      placeholder="escribe aquí los detalles que reconozcas sobre el motivo de tu consulta.
      En general, información sobre la localización (lugar donde ocurre o siente alguna molestia), la cronología (¿cuándo lo notó por primera vez? ¿qué tan frecuente? ¿cuánto dura?), la intensidad (¿qué tan fuerte es? ¿qué tan molesto es? ¿qué tanto le ha perjudicado en su día a día?) y manifestaciones asociadas es muy útil para el profesional de salud.
      Puedes editar o agregar información a esta sección cuando quieras, por si notas más detalles o algo distinto.
      "
      className="w-full focus:outline-none focus:text-gray-900 mb-1 border border-gray-300 rounded-md placeholder-slate-400 p-2 h-52 placeholder:text-xs "
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
    />
        <div className="py-2 flex gap-2"><label className=" text-white" htmlFor="campo1">Registra tus horarios disponibles:</label><button type="button" onClick={AbrirModalCalendario} > <BsFillCalendarWeekFill className=" text-2xl text-indigo-700 hover:text-indigo-100 focus:text-coral-300"/> </button> </div>
       
       
 <div>
  
 {showModal && (
  <div className="  pt-1 items-center justify-center 0 rounded-lg  ">
    <div className="bg-lila-300  rounded border  ">
      <div className=" flex justify-end">
      <button className=" px-2 py-1 rounded-full text-lg font-cursive text-white hover:text-gray-300 " onClick={handleModalClose}>X</button>
      </div>
      <div>
      <p className="px-2 mb-2 text-white  font-regular text-sm">
        Selecciona a qué profesionales deseas mostrar tu motivo de consulta. 
        Si eliges <span className="font-bold">'Profesionales en general'</span>, tu motivo será visible para profesionales generales de cimiento clínico.
         En cambio, si seleccionas <span className="font-bold">'Profesionales en específico'</span> 
      , podrás elegir los profesionales específicos que podrán ver tu caso.
       </p>
       </div>

    </div>
  </div>
)}
<label htmlFor="especialidad" className=" text-white font-medium mb-1">
        ¿Qué profesionales verán esto? <span className="text-red-600 text-lg">*</span>
      </label>
      <div className="relative">
  <div className="flex justify-between">
    <select
      id="especialidad"
      className="w-full border rounded p-2"
      onChange={handleMotivoChange}
      value={especialidad}
    >
      <option value="">Seleccione un motivo</option>
      <option value="general">Profesionales en general</option>
      <option value="especifico">Profesionales en específico</option>
    </select>
    <div>
      <button
        type="button"
        className="px-2 py-1 rounded-full text-3xl font-cursive text-cyan-200 font-semibold hover:text-cyan-400"
        onClick={handleModalOpen}
      >
        ?
      </button>
    </div>
  </div>
</div>

    </div>

{especialidad === 'especifico' && (
  <div className="mt-4 bg-lila-200 rounded-lg px-3 py-3 text-white ">
    <label className="block font-medium mb-1">Elige los Profesionales:</label>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          value="anestesista"
          checked={profesionales.includes('anestesista')}
          onChange={handleProfesionalesChange}
          className="mr-2"
        />
        Anestesista
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          value="cirujano"
          checked={profesionales.includes('cirujano')}
          onChange={handleProfesionalesChange}
          className="mr-2"
        />
        Cirujano
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          value="odontologo"
          checked={profesionales.includes('odontologo')}
          onChange={handleProfesionalesChange}
          className="mr-2"
        />
        Odontólogo
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          value="diabetologo"
          checked={profesionales.includes('diabetologo')}
          onChange={handleProfesionalesChange}
          className="mr-2"
        />
        Diabetólogo
      </label>
      <label className="flex items-center text-[14px] ">
        <input
          type="checkbox"
          value="medico"
          checked={profesionales.includes('medico')}
          onChange={handleProfesionalesChange}
          className="mr-2"
        />
        Médico general
      </label>


      {/* Otras opciones de profesionales */}
    </div>
  </div>
)}

    <div className="flex items-center pt-2">
      <input
        type="checkbox"
        id="campo3"
        name="consentimiento"
        className="w-4 h-4 mr-2"
        checked={consentimiento}
        onChange={(e) => {
          const checked = e.target.checked;
          setConsentimiento(checked);
        }}
      />
      <label htmlFor="campo3" className="text-sm text-white  ">
        Acepto publicar mi motivo de consulta el cual sera visto por profesionales de cimiento clínico <span className="text-red-600 text-lg">*</span>
      </label>
    </div>
    <div className="flex items-center pt-5">
      <input
        type="checkbox"
        id="campo3"
        name="visible"
        className="w-4 h-4 mr-2"
        checked={visible}
        onChange={(e) => {
          const checked = e.target.checked;
          setVisible(checked);
        }}
      />
      <label htmlFor="campo3" className="text-sm text-white  ">
        Publicar mi motivo de consulta de manera Visible{' (Esto hara que todos puedan verlo)'}
      </label>
    </div>

    <input type="submit" className="bg-lila-200 w-full p-3 text-white
        uppercase font-bold hover:bg-lila-300 cursor-pointer transition-colors rounded-md"
        value={id ? 'Actualizar tu caso': 'Subir tu caso'} />
  </form>
</div>

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

  <div className="lg:w-2/3 p-10 shadow-lg ">
  { motivos.length ?
  <div className="flex flex-col px-10 ">
  <h1 className="font-nunito py-2 text-xl">Tus Motivo de consulta publicados</h1>
   <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="">

       {motivos.slice(
                (pagina - 1)* porPagina,
                (pagina - 1 ) * porPagina + porPagina
                ).map((motivo) => (

<div key={motivo._id} className="bg-white rounded-lg shadow-lg  w-full mb-10  ">
  <div className="p-4">
    <h2 className="text-lg font-medium text-gray-800 text-center">{motivo.titulo}</h2>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">Publicado: {formatearFecha(motivo.fecha)}</span>
    <p className="mt-2 text-lg font-semibold   text-slate-800">{motivo.descripcion}</p>
    { motivo.visible===false ? <span className="inline-block bg-red-200  rounded-full px-1 py-1 text-xs font-regular text-gray-700 mt-1">Publicación: Oculta</span>
 :  <span className="inline-block bg-green-200  rounded-full px-1 py-1 text-xs font-regular text-gray-700 mt-1">Publicación: Visible</span> }

{motivo.especialidades==="General" ?
   <p className=" w-3/5 bg-gray-200  rounded-sm px-1 py-1 text-sm font-semibold text-gray-700 mt-1 lg:rounded-full"> Este motivo sera visto por profesionales en general de cimiento clínico </p>
:
<p className=" bg-gray-200  rounded-sm px-1 py-1 text-sm font-semibold text-gray-700 mt-1 lg:rounded-full"> Este motivo sera visto por los siguientes profesionales de cimiento clínico: <span className="font-bold uppercase">{motivo.especialidades}</span>  </p>
}


  </div>
  <div className=" flex bg-gray-100 px-4 py-3 gap-1">
   
  <button
  onClick={() => setEdicionMotivo(motivo)}
  className="flex bg-lila-200 hover:bg-lila-300 text-white text-sm font-nunito font-semibold py-1 px-2   rounded">
  <h3>Editar</h3>
<AiFillEdit className="mt-0.5 text-lg" />
 </button>
 <button
  onClick={() => eliminarMotivoConsulta(motivo._id)}
  className="flex bg-coral-200 hover:bg-coral-300 text-white text-sm font-nunito font-semibold py-1 px-2   rounded">
    <h3>Eliminar</h3>
  <AiFillDelete className="mt-0.5 text-lg" />
  </button>
  <Link
  to={`/paciente/vermas-motivo/${motivo._id}`}
  className=" flex rounded-md bg-blue-400 hover:bg-blue-700 text-white text-sm font-nunito font-semibold py-1 px-2"
>
  Ver detalle
</Link>
 
  <button className=" flex rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm font-nunito font-semibold py-1 px-2"  onClick={() => actualizarVisible(motivo._id, !motivo.visible)}>
            {motivo.visible ?<   IoMdEyeOff title="Ocultar" className="mt-0.5 text-lg"/>   :  <IoMdEye title="Hacer visible"  className="mt-0.5 text-lg"/>  }
          </button>
          <button className="flex rounded-md bg-lime-500 hover:bg-lime-300 text-white hover:text-gray-800 text-sm font-nunito font-semibold py-1 px-2" type="button" onClick={AbrirModalCalendario} > Tus horarios <BsFillCalendarWeekFill className=" text-2xl text-indigo-700  ml-1"/> </button> 

  </div>
</div>

))}
<Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
      </div>
      </div>
      </div>
      </div>:<h1 className="font-semibold text-xl">Aquí se publicaran tus motivos de consultas</h1> }
  </div>
    }
</div>
{mostrarModalHorarios && (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="bg-white rounded-lg p-5 max-w-xl">
      <div className="flex justify-end">
        <button
          className="mt-1 px-2 py-1 text-lila-300 hover:text-lila-100 rounded-full text-3xl"
          onClick={handleCerrarModal}
        >
          <IoMdCloseCircle />
        </button>
      </div>
      <h2 className="font-bold mb-4 text-lila-300 text-3xl text-center">¡Importante!</h2>
      <p className="bg-blue-200 px-2 py-2 text-sm mb-2 rounded-md">
        Asegúrate de mantener tus horarios disponibles al día para que los
        profesionales de cimiento clínico puedan tomar tus motivos de
        consulta. Recuerda que puedes seleccionar múltiples días en el
        calendario a continuación.
      </p>

      <FormularioCalendario onClose={handleCerrarModal} />
    </div>
  </div>
)}

{mostrarCalendario && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-5">
          <div className="flex justify-end">
          <button
              className="mt-1 px-2 py-1 text-lila-300  hover:text-lila-100 rounded-full text-3xl"
              onClick={CerrarModalCalendario}
            >
               <IoMdCloseCircle/>
            </button>
          </div>
            <div>
              <h1 className="font-bold mb-4 text-lila-300 text-xl text-center">Registra tus horarios disponibles</h1>
            </div>


            <FormularioCalendario onClose={CerrarModalCalendario} />
          </div>
        </div>
      )}
    </>
  )
}

export default FormularioMotivoConsulta