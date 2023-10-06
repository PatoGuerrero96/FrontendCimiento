import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import clientAxios from '../../config/axios';
import{ AiFillDelete} from "react-icons/ai"
import{IoMdEyeOff,IoMdEye} from "react-icons/io"
const SubirImagenMotivo = () => {
  const { id } = useParams(); // Obtener el ID del motivo de consulta de los parámetros de la URL
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toastMixin = Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'Titulo',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxSize = 3 * 1024 * 1024; // 3 MB
  if (selectedFile && selectedFile.size <= maxSize && allowedTypes.includes(selectedFile.type)) {
    setFile(selectedFile);
  } else {
    Swal.fire('¡Error!', 'Por favor, seleccione un archivo válido (png, jpeg o jpg de máximo 3 MB)', 'error');
  }
};
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    if (!nombre) {
        Swal.fire('¡Error!', 'Por favor, Agrege un nombre para su imagen', 'error');
        setLoading(false); 
        return;
      }
      if (!file) {
        Swal.fire('¡Error!', 'Por favor, No olvide agregar su imagen', 'error');
        setLoading(false); 
        return;
      }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('nombre', nombre); // Agregar el nombre al FormData
    formData.append('descripcion', descripcion); // Agregar la descripcion al FormData
    console.log(formData)
    try {
      const response = await clientAxios.post(`/pacientes/subirfoto-motivo/${id}`, formData, config);
      setImagenes(imagenes => [...imagenes, response.data]);
      toastMixin.fire({
        animation: true,
        title: 'Imagen subida'
      });
      setNombre('')
      setDescripcion('')
      setFile(null)

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const handleImageClick = (imagen) => {
    setSelectedImage(imagen);
    setShowModal(true);
    
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };
  const eliminarImagen = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const resultado = await Swal.fire({
        title: `¿Quieres eliminar esta imagen de tu motivo de consulta?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5d5ddb',
        cancelButtonColor: '#f2766b',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      });
      if (resultado.isConfirmed) {
        const response = await clientAxios.delete(`/pacientes/eliminar-imagen-motivo/${id}`, config);
        Swal.fire('¡Listo!', 'El motivo de consulta ha sido actualizado.', 'success');

      }
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };
  useEffect(() => {
    const getImagenes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await clientAxios.get(`/pacientes/obtener-imagen-motivo/${id}`,config);
        setImagenes(response.data);

      } catch (error) {
        console.error(error);
      }
    };
    getImagenes();
  }, []);

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
        } esta Imagen de tu motivo de consulta?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5d5ddb',
        cancelButtonColor: '#f2766b',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      });

      if (resultado.isConfirmed) {
        await clientAxios.put(`/pacientes/actualizar-imagenmotivovisible/${id}`, { visible: nuevoValorVisible }, config);
        setImagenes((prevState) =>
          prevState.map((imagenes) =>
            imagenes._id === id ? { ...imagenes, visible: nuevoValorVisible } : imagenes
          )
        );
        Swal.fire('¡Listo!', 'La imagen a cambiado su visibilidad', 'success');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('¡Ups!', 'Hubo un error al actualizar el estado de visibilidad de la imagen', 'error');
    }
  };
  return (
    <>
        {loading ? <div className=" container text-center">
            <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>
</div>: null}
    <div className='bg-lila-300 max-w-lg rounded-lg ml-4'>
<h1 className="text-sm font-regular px-2 text-white">*Las imagenes subidas podran ser vistas por el profesional que tome tu caso</h1>
</div>
<div className="grid grid-cols-12 gap-6 ">
  <div className="col-span-12 md:col-span-3 ml-4 ">
    <h1 className="text-3xl md:text-2xl font-bold">Sube Imagenes de tu mótivo de consulta</h1>
  </div>
  <div className="col-span-12 md:col-span-9 flex items-center justify-center">
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col md:flex-row">
    <div style={{ display: "flex", flexDirection: "column" }}>
  <label htmlFor="">Nombre</label>
  <input type="text" onChange={handleNombreChange} placeholder="Nombre de tu imagen" className="px-4 py-2 border rounded-lg"/>
</div>
<div style={{ display: "flex", flexDirection: "column" }}>
<label htmlFor="">Descripcion</label>
    <input type="text"  onChange={handleDescripcionChange} placeholder="Escribe una descripción" className="px-4 py-2 w-full md:w-96 border rounded-lg"/>
</div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="">Cargar imagen</label>
      <input  type="file" onChange={handleFileChange} placeholder="Escribe una descripción" className="px-4 py-2 border  rounded-lg"/>
      </div>
      <div className=' mt-7'>
      <button type='submit' className="px-4 py-2 bg-lila-200 text-white font-semibold rounded-lg hover:bg-lila-100">Subir fotos</button>
      </div>
    </form>
  </div>
  {imagenes.length ?
    <div className="col-span-12 mt-6 px-10 p-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {imagenes.map((imagen) => (
        <div
          key={imagen._id}
          className="bg-white rounded-lg overflow-hidden shadow">
          <img
            onClick={imagen.visible ? () => handleImageClick(imagen) : null}
            src={imagen.secure_url}
            alt={imagen.nombre}
            className={`h-80 object-cover w-full ${imagen.visible ? '' : 'pixelated-image'}`}
            />
          <div className="p-4">
           <h3 className="text-lg font-semibold">{imagen.nombre ||''}</h3>
            <h3 className="text-mdfont-regular"><span className='font-semibold'>Fecha: </span> { formatearFecha( imagen.fecha) ||''}</h3>
            <h3 className="text-md font-regular"> <span className='font-semibold'>Visibilidad: </span> {imagen.visible === false ? 'Oculta (Esta imagen está oculta para profesionales ) ' : 'Visible (Sera visto por el profesional que tome este mótivo)'}</h3>
            <p className="mt-2 text-gray-800">{imagen.descripcion ||''}</p>
          </div>
          <div className=" flex bg-gray-100 px-4 py-3 gap-1">

          <button className=" flex rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm font-nunito font-semibold py-1 px-2"  onClick={() => actualizarVisible(imagen._id, !imagen.visible)}>
        {imagen.visible ?<   IoMdEyeOff title="Ocultar" className="mt-0.5 text-lg"/>   :  <IoMdEye title="Hacer visible"  className="mt-0.5 text-lg"/>  }
      </button>
<button
onClick={() => eliminarImagen(imagen._id)}
className="flex bg-coral-200 hover:bg-coral-300 text-white text-sm font-nunito font-semibold py-1 px-2   rounded">
 <h3>Eliminar</h3>
<AiFillDelete className="mt-0.5 text-lg" />
</button>

</div>
        </div>
      ))}
    </div>
  </div>
  : <div className='col-span-12 mt-6 px-10 p-10'> <h1 className='text-center text-xl'>Aún no tienes imagenes subidas en este mótivo...</h1></div>}

</div>

<div>
    </div>
    {showModal && (
  <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="  bg-white rounded-lg overflow-hidden shadow-xl p-4" style={{ width: '50%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="flex justify-end w-full">
        <button className='text-white bg-coral-300 px-2 rounded-lg py-1' onClick={closeModal}>
         Cerrar X
        </button>
      </div>
      <img src={selectedImage.secure_url} alt={selectedImage.nombre} className="w-full py-1 h-auto max-h-full" style={{ maxHeight: '90%' }} />
    </div>
  </div>
)}
  </>
  );
}

export default SubirImagenMotivo;