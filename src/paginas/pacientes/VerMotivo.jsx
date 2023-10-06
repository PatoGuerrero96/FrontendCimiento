import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clientAxios from '../../config/axios';
import useAuth from "../../hooks/useAuth"
import SubirImagenMotivo from '../../components/pacienteComponents/SubirImagenMotivo';
import { Link } from 'react-router-dom';
const MotivoConsultaDetalle = () => {
    const { id } = useParams();
  const [motivoConsulta, setMotivoConsulta] = useState(null);
  const [informacion, setInformacion] = useState("");
  const {auth} =  useAuth()
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
        setInformacion(data.informacion);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerMotivoConsulta();
  }, []);
  const handleInformacionChange = (event) => {
    setInformacion(event.target.value);
  };
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      const response = await clientAxios.patch(`/pacientes/actualizar-informacion/${id}`, { informacion: informacion },config);
      setMotivoConsulta(response.data);
      setInformacion(response.data.informacion);
      toastMixin.fire({
        animation: true,
        title: 'Información actualizada para este mótivo'
      });
    } catch (error) {
      console.error(error);
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


      <div className='  flex justify-center mt-4'>
      <div
  className=" flex items-start justify-between rounded-xl border border-gray-100 p-4 shadow-xl sm:p-6 lg:p-8"
  href="#"
>
  <div className="pt-4 text-gray-500">
    <div className='flex justify-center'>
      <div className='text-3xl'>
      🩺
  </div>
  <div >
<h1 className='font-bold  text-xl'>Tu mótivo de consulta</h1>
  </div>

</div>
    <div className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
    <h1>{motivoConsulta.titulo}</h1>
    </div>

    <div className="mt-2 hidden text-sm sm:block">
    <p>{motivoConsulta.descripcion}</p>
    </div>
  </div>


    {motivoConsulta.visible ===true? 
      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600">
        Visible</span>
    
    :  <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600">
    Oculto</span>}


</div>

      </div>
      <div className='py-10 flex justify-center'>
  <div className=" grid  md:grid-cols-3 gap-4">
  <div className="bg-gray-100 p-4 rounded-lg shadow-md col-span-1">
      <h2 className="text-xl font-bold mb-4">Consultas relacionadas:</h2>
      {motivoConsulta.consulta.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-400 md:text-base">
          <thead>
            <tr>
              <th className="p-2 md:p-2 text-sm font-semibold uppercase bg-gray-200 text-gray-700 border-gray-400 border">Fecha de la consulta</th>
              <th className="p-2 md:p-2 text-sm font-semibold uppercase bg-gray-200 text-gray-700 border-gray-400 border">Profesional</th>
              <th className="p-2 md:p-2 text-sm font-semibold uppercase bg-gray-200 text-gray-700 border-gray-400 border">Estado</th>
            </tr>
          </thead>
          <tbody  className="text-xs sm:text-base">
            {motivoConsulta.consulta.map((consulta) => (
              <tr key={consulta._id}>
                <td className="p-2 md:p-2 font-semibold border-gray-400 border ">{formatearFecha(consulta.fecha)}</td>
                <td className="p-2 md:p-2 border-gray-400 border ">{consulta.profesional.nombres} {consulta.profesional.apellidos} </td>
                <td className="p-2 md:p-2 border-gray-400 border ">{consulta.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Este motivo de consulta aún no tiene consultas tomadas.</p>
      )}
    </div>
    <div className="bg-gray-100 p-4 rounded-lg shadow-md col-span-2">
  <h2 className="text-xl font-bold mb-4">Ingresa más información de tu motivo</h2>
  <div className="flex flex-col space-y-4">
    <textarea 
     placeholder='Agrega información relevante a tu motivo de consulta para que sea analizada por el profesional'
      className="border-gray-300 border rounded-md p-2 h-48" 
      value={informacion} 
      onChange={handleInformacionChange}
    />
    <button 
      className="bg-lila-200 hover:bg-lila-100 text-white font-bold py-2 px-4 rounded"
      onClick={handleSaveChanges}
    >
      Guardar cambios
    </button>
  </div>
</div>
  </div>
</div>

<hr  className='py-2'/>
<SubirImagenMotivo/>



    </>
  );
};

export default MotivoConsultaDetalle;