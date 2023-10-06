import { useEffect,useState } from "react";
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
import { FaTimes } from 'react-icons/fa';
import HeaderComunidad from "../../components/profesionalComponents/HeaderComunidad";
import { Paginacion } from "../../components/Paginacion";

const DatosRecetaMagistral = () => {
    const {authpro} =  proAuth()
    const [nombre, setNombre] = useState('');
    const [fuente, setFuente] = useState('');
    const [contenido, setContenido] = useState([]);
    const [anonimo, setAnonimo] = useState(false);
    const [recetasmagistrales, setRecetasmagistrales] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [porPagina, setPorPagina] = useState(3);
    const [editarModalAbierto, setEditarModalAbierto] = useState(false);
    const [datosEditar, setDatosEditar] = useState({
        nombre: '',
        contenido: [],
        anonimo: false,
      });
    const maximo = Math.ceil(recetasmagistrales.length / porPagina);
    const handleInputChange = (index, event) => {
        const newInputs = [...contenido];
        const inputValue = event.target.value;
        const formattedValue = `${inputValue}`;
      
        if (inputValue.startsWith(`${index + 1}.-`)) {
          newInputs[index] = inputValue;
        } else {
          newInputs[index] = formattedValue;
        }
      
        setContenido(newInputs);
      };
      
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          addInput();
        }
      };
      
      const addInput = () => {
        setContenido([...contenido, '']);
      };
      
      const removeInput = (index) => {
        const newInputs = contenido.filter((_, i) => i !== index);
        setContenido(newInputs);
      };
      const abrirModalEditar = (datos) => {
        const datosConId = { ...datos, _id: datos._id }; // Asegurarse de que `_id` esté presente
        setDatosEditar(datosConId);
        setEditarModalAbierto(true);
      };
      
    const cerrarModalEditar = () => {
      setEditarModalAbierto(false);
    };
    useEffect(() => {
      obtenerRecetasMagistral();
    }, []);
    const obtenerRecetasMagistral = async () => {
      try {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
        const { data } = await clientAxios.get(`/profesional/obtener-tus-recetas-magistrales/${authpro._id}`,config);
        setRecetasmagistrales(data);
      } catch (error) {
        console.log(error);
      }
    };
    const eliminarRecetaMagistral = async (id) => {

      const confirmar = await Swal.fire({
        title: '¿Estás seguro de que quieres eliminar tus datos para receta magistral?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#5d5ddb',
        confirmButtonText: 'Si, Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          return true;
        } else {
          return false;
        }
      });
      if (confirmar) {  
      try {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
        await clientAxios.delete(`/profesional/eliminar-receta-magistral/${id}`,config);
        obtenerRecetasMagistral();
      } catch (error) {
        console.log(error);
      }
    }
    };
    
    const handleSubmit = async (e) => {

        e.preventDefault();
    
        const data = {
          profesionalId: authpro._id,
          contenido: contenido, 
          nombre,
          fuente,
          anonimo: Boolean(anonimo),
        };
        if (!nombre) {
          Swal.fire('¡Error!', 'Por favor, Agregue un nombre a los datos para la receta magistral', 'error');
          return;
        }
        if (!fuente) {
          Swal.fire('¡Error!', 'Por favor, Agregue una fuente para los datos de la receta magistral', 'error');
          return;
        }
        if (!contenido) {
          Swal.fire('¡Error!', 'Por favor, Agregue el contenido para la receta', 'error');
          return;
        }
        const confirmar = await Swal.fire({
          title: '¿Estas seguro de publicar estos datos para receta magistral?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#5d5ddb',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar'
        }).then((result) => {
          if (result.isConfirmed) {
            return true;
          } else {
            return false;
          }
        });
        if (confirmar) { 
        try {

            const tokenPro = localStorage.getItem('tokenPro');
            if (!tokenPro) return;
          
            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
              }
            };
        await clientAxios.post(`/profesional/guardar-datos-recetas-magistral`, data,config);
          // Mostrar la notificación de éxito
          Swal.fire('¡Perfecto!', 'Datos de receta magistral guardados', 'success');
          obtenerRecetasMagistral();
        } catch (error) {
          console.log(error);
          // Mostrar la notificación de error
          Swal.fire('¡Error!', 'Ocurrió un error al guardar los datos de receta magistral', 'error');
        }
      }
      setNombre('')
      setFuente('')
      setContenido([''])
      setAnonimo(false)
      };

      
      const guardarEdicion = () => {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenPro}`,
          },
        };
      
        if (!datosEditar.nombre) {
          // Si el ID no está definido, muestra un mensaje de error
          Swal.fire('¡Error!', 'Guarde un nombre para los datos de la receta magistral', 'error');
          return;
        }
        if (!datosEditar.fuente) {
          // Si el ID no está definido, muestra un mensaje de error
          Swal.fire('¡Error!', 'Guarde un nombre para los datos de la receta magistral', 'error');
          return;
        }
        if (!datosEditar.contenido || datosEditar.contenido.length === 0) {
            // Si el campo contenido no tiene ningún valor, muestra un mensaje de error
            Swal.fire('¡Error!', 'Ingrese contenido para los datos de la receta magistral', 'error');
            return;
          }
      
        const data = {
          profesionalId: authpro._id,
          nombre: datosEditar.nombre,
          fuente: datosEditar.fuente,
          contenido: datosEditar.contenido,
          anonimo: Boolean(datosEditar.anonimo),
        };
      
        clientAxios
          .put(`/profesional/actualizar-receta-magistral/${datosEditar._id}`, data, config)
          .then((response) => {
            // Actualizar el estado con los datos editados
            const recetasActualizadas = recetasmagistrales.map((me) => {
              if (me._id === datosEditar._id) {
                return { ...me, ...data };
              }
              return me;
            });
            Swal.fire('¡Perfecto!', 'Recetas magistrales actualizadas', 'success');
            setRecetasmagistrales(recetasActualizadas);
            setEditarModalAbierto(false);
          })
          .catch((error) => {
            Swal.fire('¡Error!', 'Receta magistral no pudo ser actualizada', 'error');
          });
      };
      
      const handleEditarInputChange = (e) => {
        const index = e.target.dataset.index;
        const value = e.target.value;
      
        setDatosEditar((prevState) => {
          const newData = [...prevState.contenido];
          newData[index] = value;
          return { ...prevState, contenido: newData };
        });
      };
      
      
      
      const handleEditarAddInput = () => {
        const newInputs = [...datosEditar.contenido, ''];
        setDatosEditar({ ...datosEditar, contenido: newInputs });
      };
      
      const handleEditarRemoveInput = (index) => {
        const newInputs = datosEditar.contenido.filter((_, i) => i !== index);
        setDatosEditar({ ...datosEditar, contenido: newInputs });
      };
  return (
    <>
    
    <HeaderComunidad/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
  <div className="md:col-span-2 lg:col-span-1">
    {/* Contenido de la parte izquierda (40%) */}
    <div className="max-w-md mx-auto bg-slate-200 p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Guardar Datos para receta magistral</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-2">
            Nombre de la sección:
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            placeholder="Ej: Acné"
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-2">
            Fuente:
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            placeholder="Ej: Google.cl"
            type="text"
            id="fuente"
            value={fuente}
            onChange={(e) => setFuente(e.target.value)}
          />
        </div>
        <div className="mb-4">

  <label htmlFor="magistral" className="block mb-2">
    Contenido
  </label>

  {contenido.map((value, index) => (
  <div key={index} className="mb-4 flex">
    <label htmlFor={`input-${index}`} className="text-md mb-2 mr-1">
      {index + 1}.-
    </label>
    <input
      id={`input-${index}`}
      type="text"
      value={value}
      onChange={(event) => handleInputChange(index, event)}
      className="border border-gray-300 p-2 w-full"
      onKeyDown={handleKeyDown}
    />
    {index > 0 && (
      <button
        type="button"
        className="px-3 py-1 ml-1 text-md rounded-md text-white bg-lila-200 hover:bg-lila-100 mt-2"
        onClick={() => removeInput(index)}
      >
        X
      </button>
    )}
  </div>
))}

{contenido.length === 0 && ( // Agrega esta condición para mostrar el primer input por defecto
  <div className="mb-4 flex">
    <label htmlFor={`input-0`} className="text-md mb-2 mr-1">
      1.-
    </label>
    <input
      id={`input-0`}
      type="text"
      value={contenido[0]}
      onChange={(event) => handleInputChange(0, event)}
      className="border border-gray-300 p-2 w-full"
      onKeyDown={handleKeyDown}
    />
  </div>
)}

<div className="flex justify-center">
  <button
    type="button"
    className="px-4 py-2 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100"
    onClick={addInput}
  >
    Agregar nuevo indice
  </button>
</div>


        </div>
        <div className="mb-4">
          <label htmlFor="anonimo" className="block mb-2">
            ¿Publicar de manera anónima?
          </label>
          <div className="flex gap-2">
          <input
            className="border border-gray-300 p-2"
            type="checkbox"
            id="anonimo-checkbox"
            checked={anonimo}
            onChange={(e) => setAnonimo(e.target.checked)}
          />
          <p>Si</p>
          </div>
        </div>

        <button
          type="submit"
          className="bg-lila-300 hover:bg-lila-200 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  </div>
  <div className="md:col-span-2 lg:col-span-1 mr-10">
  {/* Contenido de la parte derecha (60%) */}
  <div>
    <h1 className="font-bold">Tus Datos para recetas magistrales</h1>
    {recetasmagistrales.length === 0 ? (
      <p>Aún no has subido datos para recetas magistrales.</p>
    ) : (
<div className="divide-y divide-gray-300">
  {recetasmagistrales.slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina).map((me) => (
    <div key={me._id} className="py-2 cursor-pointer bg-slate-300 px-4 rounded mt-2">
      <p className="text-center text-sm font-semibold">{me.nombre || ''}</p>
      {Array.isArray(me.contenido) ? (
        me.contenido.map((linea, index) => (
<p key={index} className="text-xs bg-slate-200 px-2 p-1 ">{`${index + 1}.- ${linea}`}</p>
        ))
      ) : (
        <p className="text-xs bg-slate-200 px-2 p-1 ">{me.contenido}</p>
      )}
      <div className="flex ">
      <p className="text-sm font-bold">Fuente</p>
      <p className="text-sm  px-2 ">{me.fuente || ''}</p>
      </div>
      <div className="flex">
        <p className="text-sm font-bold">Anónimo? </p>
        <p className="font-regular text-sm text-gray-600 rounded ml-1">{' '}{me.anonimo === true ? 'Si' : 'No'}</p>
      </div>
      <div className="flex py-1 gap-1">
        <div className="px-2 py-2">
          <button className="bg-lila-300 text-white hover:bg-lila-100 mr-2 px-2 py-1 rounded-lg" onClick={() => abrirModalEditar(me)}>Editar</button>
        </div>
        <div className="px-2 py-2 ">
          <button
            className="bg-coral-300 text-white hover:bg-coral-100 mr-2 px-2 py-1 rounded-lg"
            onClick={() => eliminarRecetaMagistral(me._id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  ))}
  <Paginacion
    maximo={maximo}
    pagina={pagina}
    setPagina={setPagina}
  />
</div>



  
    )}
  </div>
</div>

</div>
{editarModalAbierto && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
  <div className="bg-white rounded-lg p-6 ">
    <h2 className="text-lg font-bold mb-4">Editar Medida General</h2>
    {/* Campo de título */}
    <div className="mb-4 w-96">
      <label className="block text-sm font-medium mb-1">Título</label>
      <input
        className="border border-gray-300 px-3 py-2 rounded-lg w-full"
        type="text"
        value={datosEditar.nombre}
        onChange={(e) => setDatosEditar({ ...datosEditar, nombre: e.target.value })}
      />
    </div>
    {/* Campo de fuente */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Fuente</label>
      <input
        className="border border-gray-300 px-3 py-2 rounded-lg w-full"
        type="text"
        value={datosEditar.fuente}
        onChange={(e) => setDatosEditar({ ...datosEditar, fuente: e.target.value })}
      />
    </div>

   {/* Campo de contenido */}
   <div className="mb-4">
  <label className="block text-sm font-medium mb-1">Contenido</label>
  {datosEditar.contenido.map((value, index) => (
    <div key={index} className="flex items-center mb-2">
      <label htmlFor={`input-${index}`} className="text-md mb-2 mr-1">
        {index + 1}.-
      </label>
      <input
        id={`input-${index}`}
        type="text"
        value={value}
        data-index={index} // Atributo adicional para almacenar el número de índice
        onChange={handleEditarInputChange}
        className="border border-gray-300 px-3 py-2 rounded-lg w-full"
      />
      {index > 0 && (
        <button
          className="bg-red-500 text-white hover:bg-red-400 px-2 py-1 ml-2 rounded-lg"
          onClick={() => handleEditarRemoveInput(index)}
        >
          X
        </button>
      )}
    </div>
  ))}
      <div className="flex justify-center">
      <button
    className="bg-lila-300 text-white hover:bg-lila-200 px-4 py-2 rounded-lg"
    onClick={handleEditarAddInput}
  >
    Agregar nuevo input
  </button>
      </div>

</div>


        {/* Checkbox de anonimo */}
        <div className="mb-4">
      <label className="flex items-center">
        <input
          className="form-checkbox border-gray-300 rounded"
          type="checkbox"
          checked={datosEditar.anonimo}
          onChange={(e) => setDatosEditar({ ...datosEditar, anonimo: e.target.checked })}
        />
        <span className="ml-2 text-sm">Anónimo</span>
      </label>
    </div>



    {/* Botón de guardar */}

    <button
      className="bg-indigo-500 text-white hover:bg-indigo-400 px-4 py-2 rounded-lg mr-2"
      onClick={guardarEdicion}
    >
      Guardar
    </button>

    {/* Botón de cerrar */}
    <button
      className="bg-red-500 text-white hover:bg-red-400 px-4 py-2 rounded-lg"
      onClick={cerrarModalEditar}
    >
      Cerrar
    </button>
  </div>
</div>
      )}
    
    </>
  )
}

export default DatosRecetaMagistral