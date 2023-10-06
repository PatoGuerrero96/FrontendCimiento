import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clientAxios from '../../config/axios';
import useAuth from "../../hooks/useAuth"
import { Link } from 'react-router-dom';
const SeguimientoMotivo = () => {

const { id } = useParams();
const [motivoConsulta, setMotivoConsulta] = useState(null);
const [Seguimiento, setSeguimiento] = useState([])
const {auth} =  useAuth()
const [nombre, setNombre] = useState('');
const [descripcion, setDescripcion] = useState('');
const [loading, setLoading] = useState(false);
const [modalOpen, setModalOpen] = useState(false);
const [formValues, setFormValues] = useState({});


const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha)
  nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
  return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

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

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    if (!nombre) {
      Swal.fire('¡Error!', 'Por favor, Agrege un nombre para su seguimiento', 'error');
      setLoading(false);
      return;
    }
    if (!descripcion) {
      Swal.fire('¡Error!', 'Por favor, Agregue una descripción para su seguimiento', 'error');
      setLoading(false);
      return;
    }
  
    const datos = {
      nombre: nombre,
      descripcion: descripcion
    };
  
    try {
      const response = await clientAxios.post(`/pacientes/agregar-seguimientomotivo/${id}`, datos, config);
      setSeguimiento(seguimiento => [...seguimiento, response.data]);
      toastMixin.fire({
        animation: true,
        title: 'Seguimiento de tu motivo agregado'
      });
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  
useEffect(() => {
  const obtenerMotivoConsulta = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clientAxios.get(`/pacientes/ver-motivodeconsulta/${id}`, config);
      setMotivoConsulta(data);
    } catch (error) {
      console.log(error);
    }
  };

  obtenerMotivoConsulta();
}, []);
useEffect(() => {
    const getSeguimiento = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await clientAxios.get(`/pacientes/obtener-seguimientomotivo/${id}`,config);
        setSeguimiento(response.data);

      } catch (error) {
        console.error(error);
      }
    };
    getSeguimiento();
  }, []);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
  
      const { data } = await clientAxios.put(`/pacientes/actualizar-seguimientomotivo/${formValues.id}`, {
        ...formValues,
      }, config);
  
      setSeguimiento((prevSeguimiento) => {
        return prevSeguimiento.map((seg) => {
          if (seg._id === data._id) {
            return data;
          } else {
            return seg;
          }
        });
      });
  
      // Cerrar el modal
      setModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditClick = (seg) => {
    setModalOpen(true);
    setFormValues({
      id: seg._id,
      nombre: seg.nombre,
      descripcion: seg.descripcion,
    });
  };
  const eliminarSeguimiento = async (id) => {
        
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const resultado = await Swal.fire({
        title: '¿Quieres eliminar este seguimiento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5d5ddb',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      });
      if (resultado.isConfirmed) {
      const response = await clientAxios.delete(`/pacientes/eliminar-seguimientomotivo/${id}`, config);
      Swal.fire('¡Listo!', 'Su seguimiento fue eliminado', 'success');
      if (response.status === 200) {
        const nuevoSeguimiento = Seguimiento.filter((seg) => seg._id !== id);
        setSeguimiento(nuevoSeguimiento);
      }
    }
    } catch (error) {
      console.log(error);
    }
  };

if (!motivoConsulta) {
  return <p>Cargando...</p>;
}
if (motivoConsulta.paciente !== auth._id) {

  return (
      <div className=" bg-coral-100 w-full h-screen flex flex-col items-center justify-center ">

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
    <header className="pt-12 bg-lila-200 ">
     <div className="container mx-auto flex flex-col md:flex-row justify-center items-center font-nunito   ">
<nav className="flex flex-col items-start md:flex-row justify-content: flex-start xl:gap-1 sm:gap-1 xl:mt-2 lg:mt-0">
 <Link to= {`/paciente/vermas-motivo/${id}`} className={`text-white text-sm hover:text-gray-300 bg-green-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === `/paciente/vermas-motivo/${id}` && 'text-gray-300'}`}>Motivo de consulta
 </Link>

 <Link to= {`/paciente/seguimiento-motivo/${id}`} className={`text-white text-sm hover:text-gray-300 bg-yellow-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === `/paciente/seguimiento-motivo/${id}` && 'text-gray-300'}`}>Seguimiento del Motivo
 </Link>
    </nav>
     </div>
   </header>
   <div>
   {loading ? <div className=" container text-center">
            <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>
</div>: null}
 <div className='flex justify-center py-2'>
<h1 className='text-2xl font-bold text-lila-200'>Seguimiento de Motivo de consulta</h1>
 </div>
<div className="flex justify-center py-5 ">
  <div className="">
  <form onSubmit={handleSubmit} className="flex gap-2 flex-col md:flex-row">
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label htmlFor="">Nombre de tu seguimiento</label>
    <textarea type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de tu actualización de motivo" className="px-4 py-2 md:w-96  border rounded-lg" />

  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label htmlFor="">Descripción de tu seguimiento</label>
    <textarea type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe la actualización de tu motivo" className="px-4 py-2 w-full md:w-96 border rounded-lg" />

  </div>
  <div className="mt-7">
    <button
      type="submit"
      className="px-4 py-2 bg-lila-200 text-white font-semibold rounded-lg hover:bg-lila-100">
      Agregar seguimiento
    </button>
  </div>
</form>
  </div>
</div>

<div>
    </div>
   </div>
<hr />
   <div className="container mx-auto px-4 py-10 ">
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  <div className="relative">
    <div className="bg-gray-300 rounded-lg p-4">
      <div className="mb-2"><span className='text-2xl font-bold bg-lila-200 px-3 py-0.5 rounded-full text-white'>1</span> <span className='text-lg font-regular'>{motivoConsulta.titulo}</span></div>
      <div className="text-sm font-medium mb-2">Fecha de publicación: {formatearFecha(motivoConsulta.fecha) }</div>
      <div className="text-sm">Descripción: {motivoConsulta.descripcion} </div>
      <div className='py-5'></div>
    </div>
    <div className="connector"></div>
  </div>

  {Seguimiento.map((seg, index) => (
    <div className="relative" key={seg.id}>
      <div className="bg-gray-300 rounded-lg p-4">
        <div className="mb-2"><span className='text-2xl font-bold bg-lila-200 px-3 py-0.5 rounded-full text-white'>{index + 2}</span> <span className='text-lg font-regular'>{seg.titulo}</span></div>
        <div className="text-sm font-medium mb-2">Fecha de publicación: {formatearFecha(seg.fecha)}</div>
        <div className="text-sm">Nombre: {seg.nombre}</div>
        <div className="text-sm">Descripción: {seg.descripcion}</div>
        <button
        className="text-white hover:bg-lila-100 rounded-lg px-2 py-2 "
        onClick={() => handleEditClick(seg)}>
        <span className='text-lg'> ✏️</span>
        </button>
        <button
            onClick={() => eliminarSeguimiento(seg._id)}
            className="text-white hover:bg-lila-100 rounded-lg px-2 py-2 text-sm">
           <span className='text-md'>🗑️</span>
          </button>
      </div>
      {index !== Seguimiento.length - 1 && <div className="connector"></div>}
    </div>
  ))}
</div>
</div>


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
              <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                Descripcion:
              </label>
              <textarea
                type="text"
                name="descripcion"
                value={formValues.descripcion || ''}
                onChange={(e) =>
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    descripcion: e.target.value
                  }))
                }
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>

          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Guardar
            </button>
    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setModalOpen(false)}>
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

export default SeguimientoMotivo