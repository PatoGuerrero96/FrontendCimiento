import { useEffect,useState } from "react";
import { useParams, } from 'react-router-dom';
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
import moment from "moment";
import { Link } from "react-router-dom";
const VerMasConsultasPagadas= () => {
    const [consulta, setConsulta] = useState([]);
    const [timeLeft, setTimeLeft] = useState({});
    const { id } = useParams();
    const {authpro} =  proAuth()
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
    const handleFormSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const tokenPro = localStorage.getItem('tokenPro')
        if (!tokenPro) return;
    
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        }
    
        const requestBody = {
          link: consulta.link // Agregar el campo link al objeto de datos a enviar
        };
    
        const { data } = await clientAxios.put(`/profesional/actualizar-link-consulta/${id}`, requestBody, config);
        toastMixin.fire({
          animation: true,
          title: 'Link de consulta actualizada'
        });
      } catch (error) {
        console.log(error);
      }
    }

    const handleChangePreguntas = (e) => {
      const { name, value } = e.target;
      setConsulta((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
    };
    
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
              setConsulta(data);
            } catch (error) {
              console.log(error);
            }
          };
        
          fetchData();
        }, []);

        useEffect(() => {
          const intervalId = setInterval(() => {
            if (!consulta.fecha || !consulta.horarioinicio) return;
        
            const now = new Date().getTime();
            const fechaConsulta = moment(consulta.fecha).format("YYYY-MM-DD");
            const horaInicio = moment(consulta.horarioinicio, "HH:mm").format("HH:mm");
            const countDownDate = new Date(`${fechaConsulta} ${horaInicio}`).getTime();
            const distance = countDownDate - now;
        
            if (distance < 0) {
              clearInterval(intervalId);
              setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
              const days = Math.floor(distance / (1000 * 60 * 60 * 24));
              const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
              setTimeLeft({ days, hours, minutes, seconds });
            }
          }, 1000);
        
          return () => clearInterval(intervalId);
        }, [consulta]);

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
    {consulta.estado === "pagado" ? (
 <div className="container mx-auto py-6">
<div className="bg-gray-200 p-4 rounded-lg shadow-lg">
  {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
    <p className="text-lg font-bold">Ya llegó la hora de tu consulta</p>
  ) : (
    <>
      <p className="text-lg font-bold mb-2">Tiempo restante para la próxima consulta:</p>
      <div className="flex items-center">
        <div className="text-4xl font-bold mr-2">{timeLeft.days}</div>
        <div className="text-gray-600 mr-4">días</div>
        <div className="text-4xl font-bold mr-2">{timeLeft.hours}</div>
        <div className="text-gray-600 mr-4">horas</div>
        <div className="text-4xl font-bold mr-2">{timeLeft.minutes}</div>
        <div className="text-gray-600 mr-4">minutos</div>
        <div className="text-4xl font-bold mr-2">{timeLeft.seconds}</div>
        <div className="text-gray-600">segundos</div>
      </div>
    </>
  )}
</div>
<div className="py-5">
  <h3 className="text-lg font-semibold text-center">
    {consulta.link ? "Link subido para la consulta" : "Ingresa el link para desarrollar la consulta"}
  </h3>
  <form onSubmit={handleFormSubmit} className="flex flex-row mt-4 justify-center">
    <div className="w-2/5">
      <input
        type="text"
        name="link"
        value={consulta.link || ''}
        onChange={handleChangePreguntas}
        placeholder="Sube el link para la consulta Ej: https://meet.google.com/1234567890"
        className="block w-full border-gray-300 border rounded-md shadow-sm py-2 px-3 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-lila-300 focus:border-lila-300 sm:text-sm"
      />
    </div>
    <button className="bg-lila-300 hover:bg-lila-100 py-2 px-4 rounded-md text-white font-semibold ml-2">
      
      {consulta.link ? "Actualizar link de la consulta" : "Subir link de la consulta"}
    </button>
  </form>
</div>


    <div className="flex justify-center py-2">
<div className="text-center px-4 py-4  bg-green-200 max-w-xl rounded-full">
  <h1 className="text-xl font-semibold text-green-700 ">Consulta Pagada</h1>
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
        <div>
        {consulta.paciente.contacto === "Correo" ?
         <div>
          <p className="font-bold mb-1">Quiere ser contactado por <span className="underline">Correo</span>:</p>
          <div>
          <p>
             {consulta.paciente.email}
          </p>
          </div>
          </div>
          :'' }
            {consulta.paciente.contacto === "Celular" ?
         <div>
          <p className="font-bold mb-1">Quiere ser contactado por <span className="underline">Celular</span>:</p>
          <div>
             {consulta.paciente.telefono}
          </div>
          </div>
          :'' }
          {consulta.paciente.contacto === "Whatsapp" ?
         <div>
          <p className="font-bold mb-1">Quiere ser contactado por <span className="underline">Whatsapp</span>:</p>
          <div>
          <p>
             {consulta.paciente.telefono}
          </p>
          </div>
          </div>
          :'' }
        </div>
        
      </div>
      <div className=""> 
        <Link to={`/profesional/info-paciente-consulta/${consulta._id}`} className="bg-lila-200 px-3 py-2 text-white uppercase font-semibold rounded-xl shadow-md hover:bg-lila-100 ">Ficha del paciente</Link>
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
          <p>{consulta.estado? 'Pagada' : ''}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Fecha en donde se acepto la consulta:</p>
          <p>{consulta.fechaaceptada || ''}</p>
        </div>

      </div>
      <div className="py-2">
  <a href={consulta.link} target="_blank" rel="noopener noreferrer" className="bg-lila-200 px-3 py-2 text-white uppercase font-semibold rounded-xl shadow-md hover:bg-lila-100">
    Link de la consulta
  </a>
</div>
<div className="py-2">
  <a className="hover:text-blue-400" href={consulta.link} target="_blank" rel="noopener noreferrer">Ó bien ingresa aquí</a>
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