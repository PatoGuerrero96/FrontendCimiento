import React from 'react'
import { useEffect,useState } from 'react'
import clientAxios from '../../config/axios'
import FormularioSeccionesTarifa from '../../components/profesionalComponents/FormularioSeccionesTarifa'
import { ChromePicker } from 'react-color';
const Tarifas = () => {
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [tarifas, setTarifas] = useState([]);
    const [tarifasglobales, setTarifasGlobales] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formValuesseccion, setformValuesseccion] = useState({});
    const [modalOpenseccion, setModalOpenseccion] = useState(false);
    const [tarifasPorSeccion, setTarifasPorSeccion] = useState({});
    const [seccionTarifaId, setSeccionTarifaId] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const handleChangeColor = (color) => {
      setformValuesseccion((prevValues) => ({
        ...prevValues,
        color: color.hex
      }));
    };
    const handleToggleColorPicker = () => {
      setShowColorPicker((prevShowColorPicker) => !prevShowColorPicker);
    };
    useEffect(() => {
      const obtenerSeccionesYTarifas = async () => {
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
    
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPro}`,
            },
          };
    
          // Obtener secciones
          const seccionesResponse = await clientAxios.get('/profesional/traer-seccion-tarifa', config);
          const seccionesData = seccionesResponse.data;
          setSecciones(seccionesData);
    
          // Obtener tarifas
          const tarifasResponse = await clientAxios.get('/profesional/traer-tarifas', config);
          const tarifasData = tarifasResponse.data;
          setTarifas(tarifasData);
    
          // Filtrar tarifas por sección
          const tarifasPorSeccion = {};
          tarifasPorSeccion[null] = []; // Agregar una entrada para las tarifas con sección null
          seccionesData.forEach((seccion) => {
            const seccionId = seccion._id ? seccion._id : null;
            const tarifasFiltradas = tarifasData.filter((tarifa) => tarifa.seccionTarifa === seccionId && tarifa.activo === true);
            tarifasPorSeccion[seccionId] = tarifasFiltradas;
          });
          setTarifasPorSeccion(tarifasPorSeccion);
    
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
    
      obtenerSeccionesYTarifas();
    }, [tarifasPorSeccion]);
    useEffect(() => {
      const obtenertarifasglobales = async () => {
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
    
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPro}`,
            },
          };
          // Obtener tarifas
          const tarifasglobalesResponse = await clientAxios.get('/profesional/traer-tarifaglobales', config);
          const tarifasData = tarifasglobalesResponse.data;
          setTarifasGlobales(tarifasData);

    
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
    
      obtenertarifasglobales();
    }, []);
      const eliminarTarifa = async (id) => {
        
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
            title: '¿Quieres eliminar esta tarifa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5d5ddb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          });
          if (resultado.isConfirmed) {
          const response = await clientAxios.delete(`/profesional/borrar-tarifa/${id}`, config);
          Swal.fire('¡Listo!', 'Tu Tarifa fue eliminada', 'success');
          if (response.status === 200) {
            const nuevasTarifas = tarifas.filter((tar) => tar._id !== id);
            setTarifas(nuevasTarifas);
          }
        }
        } catch (error) {
          console.log(error);
        }
      };
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const tarifa = { nombre, valor, tiempo, seccionTarifaId };
    
        try {
            if (!nombre) {
                Swal.fire('¡Error!', 'Por favor, Agregue un nombre a su tarifa.', 'error');
                return;
              }
              if (!valor) {
                Swal.fire('¡Error!', 'Por favor, Agregue un valor a su tarifa', 'error');
                return;
              }
              if (!tiempo) {
                Swal.fire('¡Error!', 'Por favor, Agregue el tiempo a su tarifa', 'error');
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
          const response = await clientAxios.post("/profesional/crear-tarifa", tarifa, config);
          Swal.fire('¡Perfecto!', 'Tu tarifa fue publicada', 'success');
        } catch (error) {
          console.log(error);
        }
       setNombre('')
       setTiempo('')
       setValor('')
       setSeccionTarifaId('')
      };
      const handleEditClick = (tar) => {
        setModalOpen(true);
        setFormValues({
          id: tar._id,
          nombre: tar.nombre,
          valor: tar.valor,
          tiempo: tar.tiempo,
          seccionTarifaId: tar.seccionTarifa,
        });
      };
      const handleEditClickSeccion = (seccion) => {
        setModalOpenseccion(true);
        setformValuesseccion({
          id: seccion._id,
          nombre: seccion.nombre,
          color: seccion.color,
        });
      };
      const handleFormSubmitSeccion = async (e) => {
        e.preventDefault();
      
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`
            }
          };
      
          const { data } = await clientAxios.put(`/profesional/actualizar-seccion/${formValuesseccion.id}`, {
            ...formValuesseccion,
          }, config);
      
          setSecciones((prevSecciones) => {
            return prevSecciones.map((seccion) => {
              if (seccion._id === data._id) {
                return data;
              } else {
                return seccion;
              }
            });
          });
      
          // Cerrar el modal
          setModalOpenseccion(false);
        } catch (error) {
          console.log(error);
        }
      };
      const handleFormSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`
            }
          };
      
          const { data } = await clientAxios.put(`/profesional/actualizar-tarifa/${formValues.id}`, {
            ...formValues,
          }, config);
      
          // Actualizar la lista de tarifas con la nueva tarifa actualizada
          setTarifas((prevTarifas) => {
            return prevTarifas.map((tar) => {
              if (tar._id === data._id) {
                return data;
              } else {
                return tar;
              }
            });
          });
      
          // Cerrar el modal
          setModalOpen(false);
        } catch (error) {
          console.log(error);
        }
      };
      const eliminarSeccion = async (id) => {
        
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
            title: '¿Quieres eliminar esta categoría?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5d5ddb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          });
          if (resultado.isConfirmed) {
          const response = await clientAxios.delete(`/profesional/borrar-seccion/${id}`, config);
          Swal.fire('¡Listo!', 'Tu Categoria fue eliminada', 'success');
          if (response.status === 200) {
            const nuevasSecciones = secciones.filter((sec) => sec._id !== id);
            setSecciones(nuevasSecciones);
          }
        }
        } catch (error) {
          console.log(error);
        }
      };
      
  return (
    <>


<div className="grid grid-cols-2 gap-1 md:grid-cols-5 bg-lila-300">
  {/* Primera columna */}
  <div className="col-span-2  ">
  <div className=' py-9'>
        <h1 className='text-center text-3xl font-bold text-white'> <span className='bg-coral-300 px-2 py-0.5 rounded-full'>1º</span> Crea categorías para tus tarifas</h1>
    </div>
    <div>
    <FormularioSeccionesTarifa/>
    </div>
  </div>

  {/* Segunda columna */}
  <div className="col-span-3 ">
  <div className="  py-10 px-2">
    <div className=' py-2 '>
    <h1 className='text-center text-3xl font-bold text-white mb-4'><span className='bg-coral-300 px-2 py-0.5 rounded-full'>2º</span> Registra tus tarifas</h1>
    </div>
  <div className="w-full ">
    <form onSubmit={handleSubmit}>
    <div className="w-max-2xl mx-auto  rounded-md p-4 bg-lila-200">
      <div className="flex gap-2 flex-col md:flex-row center">
        <div className="relative flex-1">
          <input  type="text"  className="peer h-10 w-full border border-1.5 rounded-md border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-red-600 focus:border-2 p-3" placeholder="quelquechose" 
            id="nombre"
            value={nombre || ''}
            onChange={(event) => setNombre(event.target.value)}
          />
          <label htmlFor="nombre" className="absolute left-2 px-1 -top-2.5 bg-white text-red-600 text-sm transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-white peer-focus:bg-lila-200 peer-focus:text-sm">Nombre de la tarifa</label>
          <div className="absolute right-0 top-0 mt-2 mr-2 text-xl">
          📄
          </div>
        </div>
        <div className="relative flex-1">
          <input  name="etd" type="number" className=" appearance-none peer h-10 w-full border border-1.5 rounded-md border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-red-600  focus:border-2 p-3" placeholder="quelquechose" 
          id="valor"
          value={valor}
          onChange={(event) => {
            const newValue = event.target.value.trim(); // Elimina los espacios en blanco al principio y al final
            if (newValue === "") {
              setValor(''); // Si el valor está vacío, establece el estado en null
            } else {
              setValor(Number(newValue)); // Si el valor no está vacío, convierte y establece el estado
            }
          }}/>
          <label htmlFor="valor" className="absolute left-2 px-1 -top-2.5 bg-white text-red-600 text-sm transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-white peer-focus:bg-lila-200 peer-focus:text-sm">$ Valor {'(Precio de la consulta)'}</label>
          <div className="absolute right-0 top-0 mt-2 mr-2 text-xl">
          💲
          </div>
        </div>
        <div className="relative flex-1">
          <input  name="etd" type="number" className=" appearance-none peer h-10 w-full border border-1.5 rounded-md border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-red-600 focus:border-2 p-3" placeholder="quelquechose" 
            id="tiempo"
            value={tiempo}
            onChange={(event) => {
                const newValue = event.target.value.trim(); 
                if (newValue === "") {
                  setTiempo(''); 
                } else {
                  setTiempo(Number(newValue)); 
                }
              }}
          />
          <label htmlFor="tiempo" className="absolute left-2 px-1 -top-2.5 bg-white text-red-600 text-sm transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-white peer-focus:bg-lila-200 peer-focus:text-sm">Tiempo{'(minutos de la consulta)'} </label>
          <div className="absolute right-0 top-0 mt-2 mr-2 text-xl">
          🕐
          </div>
        </div>
        <div className="relative flex-1">
        <select
  className='w-full border border-gray-300 text-gray-400 p-2 rounded-lg '
  value={seccionTarifaId}
  onChange={(e) => setSeccionTarifaId(e.target.value)}
>
  <option className='font-semibold text-gray-400' value="">Elige una categoría</option>
  {secciones.map((sec) => (
    <option  className='text-black' style={{ backgroundColor: sec.color }} key={sec._id} value={sec._id}>
      {sec.nombre}
    </option>
  ))}
</select>
</div>
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-coral-200 hover:bg-coral-100 text-white font-bold text-md  rounded-full px-6 py-3">Guardar Tarifa</button>
      </div>
    </div>
    </form>
  </div>
</div>
  </div>
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
    <div>
         <div className=" px-10 grid md:grid-cols-3 gap-4">
    { secciones.length ? (
      secciones.map((seccion) => (
        <section key={seccion._id} className="pt-20">
          <details style={{ backgroundColor: seccion.color }} className="w-full bg-white p-4 rounded-xl shadow-md group mx-auto max-h-[56px] open:!max-h-[1200px] transition-[max-height] duration-500 overflow-hidden">
            <summary className="outline-none cursor-pointer  text-white font-semibold marker:text-transparent group-open:before:rotate-90 before:origin-center relative before:w-[18px] before:h-[18px] before:transition-transform before:duration-200 before:-left-1 before:top-2/4 before:-translate-y-2/4 before:absolute before:bg-no-repeat before:bg-[length:18px_18px] before:bg-center before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22h-6%20w-6%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M9%205l7%207-7%207%22%20%2F%3E%0A%3C%2Fsvg%3E')]" >
              {seccion.nombre}
              <button
            className="text-white ml-2  hover:animate-bounce rounded-lg px-2 py-2 text-sm"
            onClick={() => handleEditClickSeccion(seccion)}
          >
            <span className='text-md'> ✏️</span>
          </button>
        
            <button
            onClick={() => eliminarSeccion(seccion._id)}
            className="text-white hover:animate-bounce rounded-lg px-2 py-2 text-sm"
          >
        
           <span className='text-md'>🗑️</span>
          </button>

          </summary>
            <div className="py-2"></div>
            <div className="text-sm -m-4 -mt-2 p-4 bg-gray-50">
  {tarifasPorSeccion[seccion._id]?.length ? (
    tarifasPorSeccion[seccion._id].map((tar) => (
      <div key={tar._id}>
      <div className='flex flex-wrap items-center mb-4 bg-gray-300 px-6 py-6 rounded-lg gap-4'>
        <div className='flex flex-col'>
          <h4 className="font-bold text-lg">Tarifa:</h4>
          <p className='font-semibold text-sm'>{tar.nombre}</p>
        </div>
        <div className='flex flex-col'>
          <h4 className="font-bold text-lg">Valor:</h4>
          <p className='font-semibold text-sm'>$ {tar.valor.toLocaleString("es-CL")}</p>
        </div>
        <div className='flex flex-col'>
          <h4 className="font-bold text-lg">Tiempo:</h4>
          <p className='font-semibold text-sm'>{tar.tiempo} Minutos</p>
        </div>
        <div className='flex gap-4'>
          <button
            className="text-white hover:animate-bounce rounded-lg px-2 py-2 text-sm"
            onClick={() => handleEditClick(tar)}
          >
            <span className='text-lg'> ✏️</span>
          </button>
          <button
            onClick={() => eliminarTarifa(tar._id)}
            className="text-white  hover:animate-bounce rounded-lg px-2 py-2 text-sm"
          >
          <span className='text-lg'>🗑️</span>
          </button>
        </div>
      </div>
    </div>
    ))
  ) : (
    <p>Aún sin tarifas.</p>
  )}
</div>
              </details>
            </section>
        ))
      ) : (
        <div className=' py-6 px-6 text-md font-semibold italic bg-lila-100 mt-5 rounded-xl'>
         <p>Aún no has creado secciones de tarifa...</p>

        </div>
      )}
    </div>



    <div>
      <div className=" px-10 grid md:grid-cols-2 gap-4">
      <section className="pt-20">
  <details style={{ backgroundColor: 'gray' }} className="w-full bg-white p-4 rounded-xl shadow-md group mx-auto max-h-[56px] open:!max-h-[1200px] transition-[max-height] duration-500 overflow-hidden">
    <summary className="outline-none cursor-pointer text-white font-semibold marker:text-transparent group-open:before:rotate-90 before:origin-center relative before:w-[18px] before:h-[18px] before:transition-transform before:duration-200 before:-left-1 before:top-2/4 before:-translate-y-2/4 before:absolute before:bg-no-repeat before:bg-[length:18px_18px] before:bg-center before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22h-6%20w-6%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M9%205l7%207-7%207%22%20%2F%3E%0A%3C%2Fsvg%3E')]" >
      Tus tarifas sin categoría
    </summary>
    <div className="py-2"></div>
    <div className="text-sm -m-4 -mt-2 p-4 bg-gray-50">
      {tarifas.filter((tar) => tar.seccionTarifa === null && tar.activo === true).length > 0 ? (
        tarifas
          .filter((tar) => tar.seccionTarifa === null && tar.activo === true)
          .map((tar) => (
      <div key={tar._id}>
<div className='flex flex-wrap items-center mb-4 bg-gray-300 px-6 py-6 rounded-lg gap-4'>
<div className='flex flex-col'>
<h4 className="font-bold text-lg">Tarifa:</h4>
<p className='font-semibold text-sm'>{tar.nombre}</p>
</div>
<div className='flex flex-col'>
<h4 className="font-bold text-lg">Valor:</h4>
<p className='font-semibold text-sm'>$ {tar.valor.toLocaleString("es-CL")}</p>
</div>
<div className='flex flex-col'>
<h4 className="font-bold text-lg">Tiempo:</h4>
<p className='font-semibold text-sm'>{tar.tiempo} Minutos</p>
</div>
<div className='flex gap-4'>
<button
className="text-white hover:animate-bounce rounded-lg px-2 py-2 "
onClick={() => handleEditClick(tar)}>
  <span className='text-lg'> ✏️</span>

</button>
<button
onClick={() => eliminarTarifa(tar._id)}
className="text-white hover:animate-bounce rounded-lg px-2 py-2 text-sm"
>
<span className='text-lg'>🗑️</span>
</button>
</div>
</div>
</div>
))
) : (
<p >Aún sin tarifas.</p>
)}
</div>
</details>
</section>
<section className="pt-20">
<details  style={{ backgroundColor: 'gray' }} className="w-full bg-white p-4 rounded-xl shadow-md group mx-auto max-h-[56px] open:!max-h-[1200px] transition-[max-height] duration-500 overflow-hidden">
<summary className="outline-none cursor-pointer text-white font-semibold marker:text-transparent group-open:before:rotate-90 before:origin-center relative before:w-[18px] before:h-[18px] before:transition-transform before:duration-200 before:-left-1 before:top-2/4 before:-translate-y-2/4 before:absolute before:bg-no-repeat before:bg-[length:18px_18px] before:bg-center before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22h-6%20w-6%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M9%205l7%207-7%207%22%20%2F%3E%0A%3C%2Fsvg%3E')]" >
Tarifas globales de cimiento clínico
</summary>
<div className="py-2"></div>
<div className="text-sm -m-4 -mt-2 p-4 bg-gray-50">
{tarifasglobales.length ? (
  tarifasglobales
    .map((tar) => (
      <div key={tar._id}>
<div className='flex flex-wrap items-center mb-4 bg-gray-300 px-6 py-6 rounded-lg gap-4'>
<div className='flex flex-col'>
<h4 className="font-bold text-lg">Tarifa global:</h4>
<p className='font-semibold text-sm'>{tar.nombre}</p>
</div>
<div className='flex flex-col'>
<h4 className="font-bold text-lg">Valor:</h4>
<p className='font-semibold text-sm'>$ {tar.valor.toLocaleString("es-CL")}</p>
</div>
<div className='flex flex-col'>
<h4 className="font-bold text-lg">Tiempo:</h4>
<p className='font-semibold text-sm'>{tar.tiempo} Minutos</p>
</div>

</div>
</div>
))
) : (
<p>Aún sin tarifas.</p>
)}
</div>
</details>
</section>

</div>
    </div>


    
 </div>
 
    }
    
    {modalOpen && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form onSubmit={handleFormSubmit}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                Nombre:
              </label>
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
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="valor">
                Valor:
              </label>
              <input
            placeholder='Precio o valor de la consulta'
            type="text"
            name="valor"
            value={formValues.valor || ''}
            onChange={(e) => {
                const re = /^[0-9\b]+$/; // Expresión regular que acepta solo números
                if (e.target.value === '' || re.test(e.target.value)) {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    valor: e.target.value
                }));
                }
            }}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
            />
            </div>
            <div className="mb-4">
  <label className="block text-gray-700 font-bold mb-2" htmlFor="valor">
    Sección:
  </label>
  <select
    className='w-full border border-gray-300 p-2 rounded-lg'
    value={formValues.seccionTarifaId || ''}
    onChange={(e) =>
      setFormValues((prevValues) => ({
        ...prevValues,
        seccionTarifaId: e.target.value
      }))
    }
  >
    <option className='font-semibold text-gray-400' value=''>Elige una categoría</option>
    {secciones.map((sec) => (
      <option style={{ backgroundColor: sec.color }} key={sec._id} value={sec._id}>
        {sec.nombre}
      </option>
    ))}
  </select>
</div>
<label className="block text-gray-700 font-bold mb-2" htmlFor="valor">
    Duración {'(Tiempo en minutos)'}:
  </label>
            <input
            placeholder='Tiempo(Minutos que durara la consulta)'
            type="text"
            name="tiempo"
            value={formValues.tiempo || ''}
            onChange={(e) => {
                const re = /^[0-9\b]+$/; // Expresión regular que acepta solo números
                if (e.target.value === '' || re.test(e.target.value)) {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    tiempo: e.target.value
                }));
                }
            }}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
            />

          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lila-200 text-base font-medium text-white hover:bg-lila-100  sm:ml-3 sm:w-auto sm:text-sm"
            >
              Guardar
            </button>
    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-coral-200 text-base font-medium text-white hover:bg-coral-100 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setModalOpen(false)}>
      Cancelar
    </button>
  </div>
</form>
                </div>
                </div>
                </div>
                )}

   





{modalOpenseccion && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
        <form onSubmit={handleFormSubmitSeccion}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                Nombre:
              </label>
              <input
                type="text"
                name="nombre"
                value={formValuesseccion.nombre || ''}
                onChange={(e) =>
                  setformValuesseccion((prevValues) => ({
                    ...prevValues,
                    nombre: e.target.value
                  }))
                }
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <div className="">
                <div className="flex justify-start">
                  <label className="p-2 ">Tu color:</label>

                  <button
                  type="button"
                    style={{ backgroundColor: formValuesseccion.color }}
                    onClick={handleToggleColorPicker}
                    className="w-10 h-10 ml-2 border border-gray-300 rounded-md"
                  ></button>
                </div>
                {showColorPicker && (
  <div className="fixed top-12 right-0 z-10 transform translate-x-[-5%]">
    <div className="bg-gray-300 p-2">
      <button
        type="button"
        className="ml-2 mb-1 mt-1 bg-red-500 text-white px-2 py-0.5 rounded-md"
        onClick={handleToggleColorPicker}
      >
        X
      </button>
      <ChromePicker color={formValuesseccion.color} onChange={handleChangeColor} />
    </div>
  </div>
)}
              </div>
            </div>
            <div className='py-14 px-10'></div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lila-200 text-base font-medium text-white hover:bg-lila-100  sm:ml-3 sm:w-auto sm:text-sm"
            >
              Guardar
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border  shadow-sm px-4 py-2 bg-coral-200 text-base font-medium text-white hover:bg-coral-100  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setModalOpenseccion(false)}
              >
              Cancelar
              </button>
              </div>
              </form>
              </div>
              </div>
              
                </div>
              )}

    </>
  )
}

export default Tarifas