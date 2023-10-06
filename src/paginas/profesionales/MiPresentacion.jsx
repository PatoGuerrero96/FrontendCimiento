import { useState, useEffect } from "react";
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
import HeaderPerfil from "../../components/profesionalComponents/HeaderPerfil";
import FormularioExperiencialaboral from "../../components/profesionalComponents/FormularioExperiencialaboral";
import FormularioEspecialidad from "../../components/profesionalComponents/FormularioEspecialidad";
import { MdAdd,MdClose  } from "react-icons/md";
import{IoMdEyeOff,IoMdEye} from "react-icons/io"
const MiPresentacion = () => {
    const [nombre, setNombre] = useState("");
    const [fechainicio, setFechainicio] = useState('');
    const [fechafin, setFechafin] = useState('');
    const [educacion, setEducacion] = useState([]);
    const [formularioVisible, setFormularioVisible] = useState(false);
    const [formularioeditar, setFormularioeditar] = useState(false);
    const [idHover, setIdHover] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [ perfil, setPerfil ] = useState({});
    const {authpro,actualizarPerfil } =  proAuth()

    const id = authpro._id
    useEffect(()=>{
        const obtenerMotivosConsulta = async() =>{
          try {
            const tokenPro = localStorage.getItem('tokenPro')
            if(!tokenPro) return
      
            const config={
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
            }
            }
            const { data } = await clientAxios.get('/profesional/traer-educacion',config)
            setEducacion(data)
          } catch (error) {
            console.log(error)
          }
      
        }
        obtenerMotivosConsulta()      
      },[educacion])
      useEffect(() => {
        setPerfil(authpro)
 
  }, [])
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const educacion = { nombre, fechainicio,fechafin };
    
        try {
            if (!nombre) {
                Swal.fire('¡Error!', 'Por favor, Agregue un nombre a su educación.', 'error');
                return;
              }
              if (!fechainicio) {
                Swal.fire('¡Error!', 'Por favor, Agregue una año de inicio', 'error');
                return;
              }
              if (!fechafin) {
                Swal.fire('¡Error!', 'Por favor, Agregue un año de termino', 'error');
                return;
              }
            const tokenPro = localStorage.getItem('tokenPro')
            if(!tokenPro) return
      
            const config={
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
            }
            }
          const response = await clientAxios.post("/profesional/crear-educacion", educacion, config);
          Swal.fire('¡Perfecto!', 'Tu educación fue agregada', 'success');
        } catch (error) {
          console.log(error);
        }
       setFormularioVisible(false)
       setNombre('')
       setFechainicio('')
       setFechafin('')
      };
      const eliminarEducacion = async (id) => {
        
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
      
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPro}`,
            },
          };
          const resultado = await Swal.fire({
            title: '¿Quieres eliminar esta educación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5d5ddb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          });
          if (resultado.isConfirmed) {
          const response = await clientAxios.delete(`/profesional/borrar-educacion/${id}`, config);
          Swal.fire('¡Listo!', 'Tu Educación fue eliminada', 'success');
          if (response.status === 200) {
            const nuevaeducacion = educacion.filter((edu) => edu._id !== id);
            setEducacion(nuevaeducacion);
          }
        }
        } catch (error) {
          console.log(error);
        }
      };
      const handleEditClick = (edu) => {
        setFormularioeditar(true);
        setFormValues({
          id: edu._id,
          nombre: edu.nombre,
          fechainicio: edu.fechainicio,
          fechafin: edu.fechafin
        });
      };
      const handleFormSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const tokenPro = localStorage.getItem('tokenPro')
          if(!tokenPro) return
      
          const config={
            headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`
            }
          }
      
          const { data } = await clientAxios.put(`/profesional/actualizar-educacion/${formValues.id}`, formValues, config);
      
          // Actualizar la lista de tarifas con la nueva tarifa actualizada
          setEducacion((prevEducacion) => {
            return prevEducacion.map((edu) => {
              if (edu._id === data._id) {
                return data;
              } else {
                return edu;
              }
            });
          });
      
          // Cerrar el modal
          setFormularioeditar(false);
        } catch (error) {
          console.log(error);
        }
      };
      const AgregarPresentacion = async e =>{
        e.preventDefault()
        const {presentacion}= perfil
        if (!presentacion) {
            Swal.fire('¡Error!', 'Por favor, Agregue texto para la presentación de su perfil.', 'error');
            return;
          }
        await actualizarPerfil(perfil)
        
       }
       const GuardarInformacionPersonal = async e =>{
        e.preventDefault()
        await actualizarPerfil(perfil)
        
       }
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
      const actualizarCelularVisible = async (id, nuevoValorVisible) => {
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
    
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPro}`,
            },
          };
            await clientAxios.put(`/profesional/actualizar-visibilidadcelular/${id}`, { celularvisible: nuevoValorVisible }, config);
            

        } catch (error) {
          console.error(error);
          Swal.fire('¡Ups!', 'Hubo un error al actualizar la visibilidad del correo', 'error');
        }
      };

      const actualizarCorreoVisible = async (id, nuevoValorVisible) => {
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
    
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPro}`,
            },
          };
            await clientAxios.put(`/profesional/actualizar-visibilidadcorreo/${id}`, { correovisible: nuevoValorVisible }, config);
            

        } catch (error) {
          console.error(error);
          Swal.fire('¡Ups!', 'Hubo un error al actualizar la visibilidad del correo', 'error');
        }
      };

  return (
    <>
    <HeaderPerfil/>
    <div className="flex flex-wrap">
  <div className="w-full lg:w-2/6">
    <div className="bg-white p-6 shadow-md rounded-lg">

      <div className="flex justify-center">
        {authpro.image=== undefined ? <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1684334055/Imagenes%20sitio/sinfoto_bm34kj.png" alt="Sin foto" className="h-32 w-32 rounded-full" />   :<img src={authpro.image?.secure_url} alt="User Photo" className="h-32 w-32 rounded-full" /> 
}

      </div>
      <div className="flex justify-center">
      <p className="text-xl font-medium">{authpro.especialidad}</p>
      </div>
      <div className="mt-6 text-center">
      <p className="text-gray-800 mt-4">{authpro.nombres} {authpro.apellidos} </p>
      <p className="text-gray-800 mt-4">{  calcularEdad(authpro.fechaNacimiento) } {'años'} </p>
        <form onSubmit={GuardarInformacionPersonal}>
        <div className="my-4 flex  flex-row px-20 ">
					<span className=  "z-highest rounded-l-lg w-10 h-10 flex justify-center items-center text-2xl text-gray-400 border border-r-0 " >
            📞
					</span>
					<input type="text"  name="celulartrabajo" className="h-10 border border-gray-200 rounded-r-lg outline-none focus:ring-1 ring-blue-300 w-full pl-1" placeholder="Nº Celular alternativo"    value={perfil.celulartrabajo || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })} />
                          <button className="  ml-2 flex  bg-lila-300 hover:bg-lila-200 text-white text-sm font-nunito rounded-full  font-semibold py-0.5 px-2"  onClick={() => actualizarCelularVisible(authpro._id, !authpro.celularvisible)}>
            {authpro.celularvisible ?<   IoMdEyeOff title="Ocultar" className="mt-2 text-lg"/>   :  <IoMdEye title="Hacer visible"  className="mt-2 text-lg"/>  }
          </button>

				</div>
        <div className="my-4 flex flex-row px-20 ">
        <span className=  "z-highest rounded-l-lg w-10 h-10 flex justify-center items-center text-2xl text-gray-400 border border-r-0 ">
          📧
					</span>
					<input type="email"  name="emailtrabajo" 
          className="h-10 border border-gray-200 rounded-r-lg outline-none focus:ring-1 ring-blue-300 w-full pl-1"
          placeholder="Correo alternativo"    value={perfil.emailtrabajo || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })} />

<button className="  ml-2 flex  bg-lila-300 hover:bg-lila-200 text-white text-sm font-nunito rounded-full  font-semibold py-0.5 px-2"  onClick={() => actualizarCorreoVisible(authpro._id, !authpro.correovisible)}>
            {authpro.correovisible ?<   IoMdEyeOff title="Ocultar" className="mt-2 text-lg"/>   :  <IoMdEye title="Hacer visible"  className="mt-2 text-lg"/>  }
          </button>
				</div>
        <div className="my-4 flex flex-row px-20 ">
					<span className="z-highest rounded-l-lg w-10 h-10 flex justify-center items-center text-2xl text-gray-400 border border-r-0" >
          🆔
					</span>
					<input type="text"  name="numeroregistrosalud" className="h-10 border border-gray-200 rounded-r-lg outline-none focus:ring-1 ring-blue-300 w-full pl-1" placeholder="Nº registro de salud"    value={perfil.numeroregistrosalud  || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })} />
				</div>
        
        <div className="flex justify-center">
                <button className="bg-lila-200 hover:bg-lila-100 text-white text-md  px-2 py-2 rounded-lg ">Agregar información</button>
              </div>
        </form>

        <hr className="mt-6" />
      </div>
   
      <div className="mt-6">
   
        <p className="text-xl font-semibold ">Educación</p>
        { educacion.length?
        <div className="mt-4">
        {educacion.map((edu) => (
          <div
            key={edu._id}
            onMouseEnter={() => setIdHover(edu._id)}
            onMouseLeave={() => setIdHover(null)}
          >
            
           
            <p className="text-gray-600 text-sm">{edu.fechainicio}-{edu.fechafin} </p>
            <div className="flex gap-2">
            <p className="text-gray-60 text-lg">{edu.nombre}</p>
            {idHover === edu._id && (
                <div>
                     <button className="text-lg"onClick={() => handleEditClick(edu)}>
                <span role="img" aria-label="Editar">✏️</span>
              </button>
              <button className="text-lg" onClick={() => eliminarEducacion(edu._id)}>
                <span role="img" aria-label="Borrar">🗑️</span>
              </button>
                         
              </div>
            )}
            </div>
           
       
          </div>
        ))}
      </div>
          
          :<h1 className="font-regular text-center text-md">Agrega tu educación aquí...</h1> }
             {formularioVisible && (
         <form onSubmit={handleSubmit} className="flex flex-row ">
         <div className="mt-4 w-2/5">
           <input
             type="text"
             value={nombre}
             onChange={(e) => setNombre(e.target.value)}
             placeholder="Menciona tu educación"
             className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
           />
         </div>
         <div className="mt-4 w-1/5">
         <input
            type="text"
            value={fechainicio}
            onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  setFechainicio(e.target.value)
                }
              }}
            placeholder="año inicio"
            className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
            pattern="[0-9]*"
            maxLength="4"
            minLength="4"
            />
         </div>
         <div className="mt-4 w-1/5">
           <input
             type="text"
             value={fechafin}
             onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  setFechafin(e.target.value)
                }
              }}
             placeholder="año termino"
             className="block w-full border-gray-300 rounded-md  border shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
             maxLength="4"
             minLength="4"
           />
         </div>
         <div className="mt-4 w-1/5 flex justify-center">
           <button
             type="submit"
             className="bg-lila-200 hover:bg-lila-100 text-white font-bold py-1.5 px-3 rounded focus:outline-none focus:shadow-outline"
           >
             💾
           </button>
         </div>
       </form>        )}
       {formularioeditar&& (
         <form onSubmit={handleFormSubmit} className="flex flex-row ">
         <div className="mt-4 w-2/5">
           <input
             type="text"
             name="nombre"
             value={formValues.nombre || ''}
             onChange={(e) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  nombre: e.target.value
                }))
              }
             placeholder="Menciona tu educación"
             className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
           />
         </div>
         <div className="mt-4 w-1/5">
         <input
            type="text"
            name="fechainicio"
            value={formValues.fechainicio || ''}
            onChange={(e) => {
                const re = /^[0-9\b]+$/; // Expresión regular que acepta solo números
                if (e.target.value === '' || re.test(e.target.value)) {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    fechainicio: e.target.value
                }));
                }
            }}
            placeholder="año inicio"
            className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
            maxLength="4"
            minLength="4"
            />
         </div>
         <div className="mt-4 w-1/5">
           <input
             type="text"
             name="fechafin"
             value={formValues.fechafin || ''}
             onChange={(e) => {
                 const re = /^[0-9\b]+$/; // Expresión regular que acepta solo números
                 if (e.target.value === '' || re.test(e.target.value)) {
                 setFormValues((prevValues) => ({
                     ...prevValues,
                     fechafin: e.target.value
                 }));
                 }
             }}
             placeholder="año termino"
             className="block w-full border-gray-300 rounded-md  border shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
             maxLength="4"
             minLength="4"
           />
         </div>
         <div className="mt-4 w-1/5 flex justify-center">
           <button
             type="submit"
             className="bg-lila-200 hover:bg-lila-100 text-white font-bold py-1.5 px-3 rounded focus:outline-none focus:shadow-outline"
           >
             💾
           </button>
         </div>
       </form>        )}
       <div className="flex justify-center">
  {formularioVisible  ? (
    <button onClick={() => setFormularioVisible(false)} className="flex justify-center text-xl text-lila-300 hover:text-lila-100">
      Cerrar <MdClose/> 
    </button>
  ) : (
    <button onClick={() => setFormularioVisible(true)} className="flex justify-center text-xl text-lila-300 hover:text-lila-100">
      Agregar <MdAdd/> 
    </button>
  )}
</div>
    
      </div>
    </div>
  </div>
  <div className="w-full lg:w-4/6">
    <div className="bg-white p-6 shadow-md rounded-lg h-full">
      <p className="text-xl font-semibold mb-4">Presentación</p>
      <form onSubmit={AgregarPresentacion} className="text-left " >
            <div className=" flex items-center border-2 mb-10 py-2 px-3 rounded-2xl">
                <textarea
                name="presentacion"
                className=" dark:bg-slate-300 font-normal text-sm  font-nunito h-32 pl-2 w-full outline-none border-none"
                 type="text"
                  placeholder="Ingresa una presentación personal la cual ayudara a los pacientes a conocer un poco mas de ti"
                  value={perfil.presentacion || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })}
                  />
                                
              </div>
              <div className="flex justify-center">
                <button className="bg-lila-200 hover:bg-lila-100 text-white text-xl uppercase px-6 py-2 rounded-lg ">Agregar</button>
              </div>
            </form>
          <hr className="mt-6" />
          <FormularioExperiencialaboral/>

          <hr className="mt-6" />
          <FormularioEspecialidad/>
    </div>
  </div>
</div>

    </>
  )
}

export default MiPresentacion