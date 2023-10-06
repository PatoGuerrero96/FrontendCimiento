import { useEffect,useState } from "react";
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
import { FaTimes } from 'react-icons/fa';
import HeaderComunidad from "../../components/profesionalComponents/HeaderComunidad";
import { Paginacion } from "../../components/Paginacion";
const MedidasGenerales = () => {
    const {authpro} =  proAuth()
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tags, setTags] = useState([]);
    const [tagsEditar, setTagsEditar] = useState([]);
    const [tag, setTag] = useState("");
    const [fuente, setFuente] = useState('');
    const [anonimo, setAnonimo] = useState(false);
    const [tagCount, setTagCount] = useState(0);
    const [medidasGenerales, setMedidasGenerales] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [porPagina, setPorPagina] = useState(3);
    const [editarModalAbierto, setEditarModalAbierto] = useState(false);
    const [datosEditar, setDatosEditar] = useState({
      titulo: '',
      descripcion: '',
      tags: [],
      fuente: '',
      anonimo: false,
    });
    const maximo = Math.ceil(medidasGenerales.length / porPagina);

    const abrirModalEditar = (datos) => {
      setDatosEditar(datos);
      setEditarModalAbierto(true);
    };
    const cerrarModalEditar = () => {
      setEditarModalAbierto(false);
    };
    useEffect(() => {
      obtenerMedidasGenerales();
    }, []);
    const obtenerMedidasGenerales = async () => {
      try {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
        const { data } = await clientAxios.get(`/profesional/obtener-tus-medidas-generales/${authpro._id}`,config);
        setMedidasGenerales(data);
      } catch (error) {
        console.log(error);
      }
    };
    const eliminarMedidaGeneral = async (id) => {

      const confirmar = await Swal.fire({
        title: '¿Estás seguro de que quieres eliminar tu medida general?',
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
        await clientAxios.delete(`/profesional/eliminar-medida-general/${id}`,config);
        obtenerMedidasGenerales();
      } catch (error) {
        console.log(error);
      }
    }
    };
    
      const handleSubmit = async (e) => {

        e.preventDefault();
    
        const data = {
          profesionalId: authpro._id,
          tags: tags.join(", "), 
          titulo,
          descripcion,
          fuente,
          anonimo: Boolean(anonimo),
        };
        if (!titulo) {
          Swal.fire('¡Error!', 'Por favor, Agregue un nombre a su medida general', 'error');
          return;
        }
        if (!descripcion) {
          Swal.fire('¡Error!', 'Por favor, Agregue la información sobre medidas generales', 'error');
          return;
        }
        if (!fuente) {
          Swal.fire('¡Error!', 'Por favor, Agregue la fuente de la información', 'error');
          return;
        }
        const confirmar = await Swal.fire({
          title: '¿Estas seguro de publicar esta medida general?',
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
        await clientAxios.post(`/profesional/agregar-medidageneral`, data,config);
          // Mostrar la notificación de éxito
          Swal.fire('¡Perfecto!', 'Medida general guardada', 'success');
          obtenerMedidasGenerales();
        } catch (error) {
          console.log(error);
          // Mostrar la notificación de error
          Swal.fire('¡Error!', 'Ocurrió un error al guardar la medida general', 'error');
        }
      }
      setTitulo('')
      setDescripcion('')
      setTags([])
      setFuente('')
      setAnonimo(false)
      };
      const handleRemoveTag = (index) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
        setTagCount(tagCount - 1);
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
      
        const data = {
          profesionalId: authpro._id,
          tags: tagsEditar.join(", "),
          titulo: datosEditar.titulo,
          descripcion: datosEditar.descripcion,
          fuente: datosEditar.fuente,
          anonimo: Boolean(datosEditar.anonimo),
        };
      
        clientAxios
          .put(`/profesional/actualizar-medida-general/${datosEditar._id}`, data, config)
          .then((response) => {
            // Actualizar el estado con los datos editados
            const medidasActualizadas = medidasGenerales.map((me) => {
              if (me._id === datosEditar._id) {
                return { ...me, ...data }; // Utilizar 'data' en lugar de 'datosEditar'
              }
              return me;
            });
            Swal.fire('¡Perfecto!', 'Medida general actualizada', 'success');
            setMedidasGenerales(medidasActualizadas);
            setEditarModalAbierto(false);
          })
          .catch((error) => {
            Swal.fire('¡Error!', 'Medida general no pudo ser actualizada', 'error');
          });
      };
      
      
  return (
    <>
    <HeaderComunidad/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
  <div className="md:col-span-2 lg:col-span-1">
    {/* Contenido de la parte izquierda (40%) */}
    <div className="max-w-md mx-auto bg-slate-200 p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Guardar Medida General</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titulo" className="block mb-2">
            Nombre de la medida general:
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            placeholder="Ej: Medidas para diabetes"
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block mb-2">
            Medidas generales:
          </label>
          <textarea
            className="border border-gray-300 p-2 w-full"
            id="descripcion"
            placeholder="Escribe el cuerpo de las medidas generales. Ej:1.-Seguir un plan de alimentación saludable."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <p className="bg-gray-300 rounded-md px-2 text-sm">  Nota: Para agregar un tag, escribe el tag y presiona la tecla "," o "Enter". De esta manera se agregara</p>
          <label htmlFor="tag" className="block mb-2">
            Tags:
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
           type="text"
            placeholder=" Ej:Diabetes"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "," || e.key === "Enter") && tag.trim()) {
                e.preventDefault();
                if (tagCount < 5) {
                  setTags([...tags, tag.trim()]);
                  setTag("");
                  setTagCount(tagCount + 1);
                } else {
                  Swal.fire('¡Alerta!', 'No puedes agregar más tags', 'warning');
                }
              }
            }}
          />
          <div className="flex flex-wrap mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-coral-200 text-white rounded-full px-3 py-1 mr-2 mb-2"
              >
                <span>{tag}</span>
                <button
                  className="ml-2"
                  type="button" // Cambia el tipo de botón a "button"
                  onClick={() => handleRemoveTag(index)}>
                  <FaTimes className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="fuente" className="block mb-2">
            Fuente:
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="text"
            placeholder="Ingresa la fuente de la medida general"
            id="fuente"
            value={fuente}
            onChange={(e) => setFuente(e.target.value)}
          />
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
    <h1 className="font-bold">Tus Medidas Generales</h1>
    {medidasGenerales.length === 0 ? (
      <p>Aún no has subido medidas generales.</p>
    ) : (
<div className="divide-y divide-gray-300 ">
          {medidasGenerales.slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina).map((me) => (
            <div key={me._id} className="py-2 cursor-pointer bg-slate-300 px-4 rounded mt-2">
                      <p className=" text-center text-sm font-semibold ">{me.titulo || ''}</p>
                      <p className="text-xs bg-slate-200 px-2 p-1 rounded">{me.descripcion || ''}</p>
                      <div className=" flex py-1 "> <p className="text-xs font-bold  ">Fuente: </p>  <p className="text-xs text-gray-600 font-regular italic"> {' '}{me.fuente || 'Sin datos'}</p></div>
                      <div className="flex py-1">
                      <div className=" flex "> <p className="text-sm font-bold  ">Tags: </p>  <p className="font-regular text-sm text-gray-600 rounded ml-1"> {' '}{me.tags || ''}</p></div>
                      </div>
                      <div className=" flex "> <p className="text-sm font-bold  ">Anónimo? </p>  <p className="font-regular text-sm text-gray-600 rounded ml-1"> {' '}{me.anonimo===true?'Si':'No'}</p></div>
                      <div className="flex py-1 gap-1">
              <div className="px-2 py-2">
              <button className="bg-lila-300 text-white hover:bg-lila-100 mr-2 px-2 py-1 rounded-lg" onClick={() => abrirModalEditar(me)}>Editar</button>
              </div>
              <div className="px-2 py-2 ">
                <button
                  className="bg-coral-300 text-white hover:bg-coral-100 mr-2 px-2 py-1 rounded-lg"
                  onClick={() => eliminarMedidaGeneral(me._id)}
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
  <div className="bg-white rounded-lg p-6">
    <h2 className="text-lg font-bold mb-4">Editar Medida General</h2>
    {/* Campo de título */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Título</label>
      <input
        className="border border-gray-300 px-3 py-2 rounded-lg w-full"
        type="text"
        value={datosEditar.titulo}
        onChange={(e) => setDatosEditar({ ...datosEditar, titulo: e.target.value })}
      />
    </div>

    {/* Campo de descripción */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Descripción</label>
      <textarea
        className="border w-full border-gray-300 px-3 py-2 rounded-lg"
        type="text"
        value={datosEditar.descripcion}
        onChange={(e) => setDatosEditar({ ...datosEditar, descripcion: e.target.value })}
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

    {/* Campo de tags */}
    <div className="mb-4">
  <p className="bg-gray-300 rounded-md px-2 text-sm">
    Nota: Para agregar un tag, escribe el tag y presiona la tecla "," o "Enter". De esta manera se agregará.
  </p>
  <label htmlFor="tag" className="block mb-2">
    Tags:
  </label>
  <input
    className="border border-gray-300 px-3 py-2 rounded-lg w-full"
    type="text"
    placeholder="Ej: Diabetes"
    id="tag"
    value={datosEditar.tags}
    onChange={(e) => setDatosEditar({ ...datosEditar, tags: e.target.value })}
    onKeyDown={(e) => {
      if ((e.key === "," || e.key === "Enter") && e.target.value.trim()) {
        e.preventDefault();
        if (tagCount < 5) {
          setTagsEditar([...tagsEditar, e.target.value.trim()]);
          setDatosEditar({ ...datosEditar, tags: '' }); // Limpiar el campo de input de tags
          setTagCount(tagCount + 1);
        } else {
          Swal.fire('¡Alerta!', 'No puedes agregar más tags', 'warning');
        }
      }
    }}
  />
<div className="flex flex-wrap mt-2">
  {tagsEditar.map((tag, index) => (
    <div
      key={index}
      className="flex items-center bg-coral-200 text-white rounded-full px-3 py-1 mr-2 mb-2"
    >
      <span>{tag}</span>
      <button
        className="ml-2"
        type="button"
        onClick={() => handleRemoveTag(index)}
      >
        <FaTimes className="h-4 w-4 text-white" />
      </button>
    </div>
  ))}
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

export default MedidasGenerales