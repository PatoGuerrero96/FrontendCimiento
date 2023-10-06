import { useEffect,useState } from "react";
import { useParams, } from 'react-router-dom';
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
const VerMasConsultasPagadas= () => {
    const [consulta, setConsulta] = useState([]);
    const { id } = useParams();
    const {authpro} =  proAuth()
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
      const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
    useEffect(() => {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };

        const fetchData = async () => {
          try {
            const { data } = await clientAxios.get(`/profesional/verconsulta/${id}`, config);
         setConsulta(data)
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();

      }, []);      
          if (!consulta || consulta.length === 0) {
            return <p>Cargando...</p>;
          }

          if (consulta && consulta.profesional._id !== authpro._id) {
            return (
                <div className=" bg-coral-100 w-full h-screen flex flex-col items-center justify-center">

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

    {consulta.estado === "finalizado" ? (
 <div className="container mx-auto py-6">
    <div className="flex justify-center py-2">
<div className="text-center px-4 py-4  bg-green-100 max-w-xl rounded-full">
  <h1 className="text-xl font-semibold text-green-600 ">Consulta Finalizada</h1>
</div>
</div>
  <div className="grid grid-cols-1 gap-4">
    <div className="border border-lila-400 rounded-lg shadow-md col-span-2 md:col-span-1">
        <div className="bg-lila-200 rounded-t-md text-center text-2xl text-white">
            <h1>Mótivo de consulta</h1>
        </div>
        <div className="p-4 text-center">
      <h3 className="text-lg font-medium mb-2">{consulta.motivoconsulta.titulo}</h3>
      <p className="text-gray-700 mb-4">{consulta.motivoconsulta.descripcion}</p>
      <h2 className="text-center text-3xl py-2 font-semibold underline">Información del paciente</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold mb-1">Publicación del mótivo de consulta:</p>
          <p>{ formatearFecha( consulta.motivoconsulta.fecha)}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Nombre del paciente:</p>
          <p>{consulta.paciente.nombres}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Apellido del paciente:</p>
          <p>{consulta.paciente.apellidos}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Edad:</p>
          <p>{  calcularEdad(consulta.paciente.fechaNacimiento)} Años</p>
        </div>
        <div>
          <p className="font-bold mb-1">Rut:</p>
          <p>{consulta.paciente.rut}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Genero:</p>
          <p>{consulta.paciente.sexo}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Correo electrónico:</p>
          <p>{consulta.paciente.email}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Numero de celular:</p>
          <p>{consulta.paciente.telefono}</p>
        </div>
        
      </div>


      </div>
    </div>
    <div className="border border-lila-400 rounded-lg shadow-md col-span-1 md:col-span-1">
        <div className="bg-lila-200 rounded-t-md text-center text-2xl text-white">
            <h1>Consulta</h1>
        </div>
        <div className="p-4 text-center ">
      <p className="text-gray-700 text-center mb-4 italic">{consulta.mensaje}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold mb-1">Fecha de la consulta:</p>
          <p>{ formatearFecha(consulta.fecha)}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Hora de inicio:</p>
          <p>{consulta.horarioinicio}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Hora de fin:</p>
          <p>{consulta.horariofin}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Tarifa:</p>
          <div>{consulta.precio && !isNaN(parseFloat(consulta.precio))? `$${parseFloat(consulta.precio).toLocaleString('es-CL')}`: ''}</div>
        </div>
        <div>
          <p className="font-bold mb-1">Estado:</p>
          <p>{consulta.estado? 'Finalizado' : ''}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Fecha en donde se acepto la consulta:</p>
          <p>{consulta.fechaaceptada || ''}</p>
        </div>

      </div>
      </div>
    </div>

    
  </div>
</div>
) : ''}

    </>
  )
}
export default VerMasConsultasPagadas