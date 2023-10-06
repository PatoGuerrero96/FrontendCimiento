import React from 'react'
import { useState, useEffect } from "react";
import clientAxios from "../../config/axios";
import { MdAdd,MdClose  } from "react-icons/md";
const FormularioEspecialidad = () => {
    const [nombre, setNombre] = useState("");
    const [especialidad, setEspecialidad] = useState([]);
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
            const { data } = await clientAxios.get('/profesional/traer-especialidad',config)
            setEspecialidad(data)
          } catch (error) {
            console.log(error)
          }
      
        }
        obtenerMotivosConsulta()      
      },[especialidad])
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const especialidad = { nombre};
    
        try {
            if (!nombre) {
                Swal.fire('¡Error!', 'Por favor, Agregue una especialidad.', 'error');
                return;
              }
        const  tokenPro = localStorage.getItem('tokenPro')
            if(!tokenPro) return
      
            const config={
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
            }
            }
          const response = await clientAxios.post("/profesional/crear-especialidad", especialidad, config);
          Swal.fire('¡Perfecto!', 'Tu especialidad fue agregada', 'success');
        } catch (error) {
          console.log(error);
        }
       setFormularioVisible(false)
       setNombre('')

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
            title: '¿Quieres eliminar esta especialidad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5d5ddb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          });
          if (resultado.isConfirmed) {
          const response = await clientAxios.delete(`/profesional/borrar-especialidad/${id}`, config);
          Swal.fire('¡Listo!', 'Tu especialidad fue eliminada', 'success');
          if (response.status === 200) {
            const nuevaespecialidad = especialidad.filter((espe) => espe._id !== id);
            setEspecialidad(nuevaespecialidad);
          }
        }
        } catch (error) {
          console.log(error);
        }
      };
      const handleEditClick = (espe) => {
        setFormularioeditar(true);
        setFormValues({
          id: espe._id,
          nombre: espe.nombre,

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
      
          const { data } = await clientAxios.put(`/profesional/actualizar-especialidad/${formValues.id}`, formValues, config);
      
          // Actualizar la lista de tarifas con la nueva tarifa actualizada
          setEspecialidad((prevEspecialidad) => {
            return prevEspecialidad.map((espe) => {
              if (espe._id === data._id) {
                return data;
              } else {
                return espe;
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
   
   <p className="text-xl font-semibold ">Especialidad</p>
   { especialidad.length?
   <div className="mt-4">
   {especialidad.map((espe) => (
     <div
       key={espe._id}
       onMouseEnter={() => setIdHover(espe._id)}
       onMouseLeave={() => setIdHover(null)}
     >
       
       <div className="flex gap-2">
       <p className="text-gray-60 text-lg">{espe.nombre}</p>
       {idHover === espe._id && (
           <div>
                <button className="text-lg"onClick={() => handleEditClick(espe)}>
           <span role="img" aria-label="Editar">✏️</span>
         </button>
         <button className="text-lg" onClick={() => eliminarEducacion(espe._id)}>
           <span role="img" aria-label="Borrar">🗑️</span>
         </button>
                    
         </div>
       )}
       </div>
      
  
     </div>
   ))}
 </div>
     
     :<h1 className="font-regular text-center text-md">Agrega tu especialidad aquí...</h1> }
        {formularioVisible && (
    <form onSubmit={handleSubmit} className="flex flex-row ">
        <div className="mt-4  w-1/5"></div>
    <div className="mt-4  w-2/5">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Menciona tu especialidad"
        className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
      />
    </div>

    <div className="mt-4 w-2/5 flex justify-center">
      <button
        type="submit"
        className="bg-lila-200 hover:bg-lila-100 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
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
        placeholder="Menciona tu especialidad"
        className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
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

export default FormularioEspecialidad