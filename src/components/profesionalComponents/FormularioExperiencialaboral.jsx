import React from 'react'
import { useState, useEffect } from "react";
import clientAxios from "../../config/axios";
import { MdAdd,MdClose  } from "react-icons/md";
const FormularioExperiencialaboral = () => {
    const [nombre, setNombre] = useState("");
    const [fechainicio, setFechainicio] = useState('');
    const [fechafin, setFechafin] = useState('');
    const [experiencia, setExperiencia] = useState([]);
    const [formularioVisible, setFormularioVisible] = useState(false);
    const [formularioeditar, setFormularioeditar] = useState(false);
    const [idHover, setIdHover] = useState(null);
    const [formValues, setFormValues] = useState({});
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
            const { data } = await clientAxios.get('/profesional/traer-experiencia',config)
            setExperiencia(data)
          } catch (error) {
            console.log(error)
          }
      
        }
        obtenerMotivosConsulta()      
      },[experiencia])
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const experiencia = { nombre, fechainicio,fechafin };
    
        try {
            if (!nombre) {
                Swal.fire('¡Error!', 'Por favor, Agregue un trabajo como experiencia.', 'error');
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
          const response = await clientAxios.post("/profesional/crear-experiencia", experiencia, config);
          Swal.fire('¡Perfecto!', 'Tu experiencia laboral fue agregada', 'success');
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
            title: '¿Quieres eliminar esta experiencia laboral?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5d5ddb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          });
          if (resultado.isConfirmed) {
          const response = await clientAxios.delete(`/profesional/borrar-experiencia/${id}`, config);
          Swal.fire('¡Listo!', 'Tu experiencia laboral fue eliminada', 'success');
          if (response.status === 200) {
            const nuevaexperiencia = experiencia.filter((exp) => exp._id !== id);
            setExperiencia(nuevaexperiencia);
          }
        }
        } catch (error) {
          console.log(error);
        }
      };
      const handleEditClick = (exp) => {
        setFormularioeditar(true);
        setFormValues({
          id: exp._id,
          nombre: exp.nombre,
          fechainicio: exp.fechainicio,
          fechafin: exp.fechafin
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
      
          const { data } = await clientAxios.put(`/profesional/actualizar-experiencia/${formValues.id}`, formValues, config);
      
          // Actualizar la lista de tarifas con la nueva tarifa actualizada
          setExperiencia((prevExperiencia) => {
            return prevExperiencia.map((exp) => {
              if (exp._id === data._id) {
                return data;
              } else {
                return exp;
              }
            });
          });
      
          // Cerrar el modal
          setFormularioeditar(false);
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <>
       <div className="mt-6">
   
   <p className="text-xl font-semibold ">Experiencia Laboral</p>
   { experiencia.length?
   <div className="mt-4">
   {experiencia.map((exp) => (
     <div
       key={exp._id}
       onMouseEnter={() => setIdHover(exp._id)}
       onMouseLeave={() => setIdHover(null)}
     >
       
      
       <p className="text-gray-600 text-sm">{exp.fechainicio}-{exp.fechafin} </p>
       <div className="flex gap-2">
       <p className="text-gray-60 text-lg">{exp.nombre}</p>
       {idHover === exp._id && (
           <div>
                <button className="text-lg"onClick={() => handleEditClick(exp)}>
           <span role="img" aria-label="Editar">✏️</span>
         </button>
         <button className="text-lg" onClick={() => eliminarEducacion(exp._id)}>
           <span role="img" aria-label="Borrar">🗑️</span>
         </button>
                    
         </div>
       )}
       </div>
      
  
     </div>
   ))}
 </div>
     
     :<h1 className="font-regular text-center text-md">Agrega tu experiencia laboral aquí...</h1> }
        {formularioVisible && (
    <form onSubmit={handleSubmit} className="flex flex-row ">
    <div className="mt-4 w-2/5">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Menciona tu experiencia laboral"
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
        placeholder="Menciona tu experiencia laboral"
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
    
    </>
  )
}

export default FormularioExperiencialaboral