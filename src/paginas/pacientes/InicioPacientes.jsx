import { useState, useEffect } from "react"
import useAuth from "../../hooks/useAuth"
import { BsWhatsapp, BsFillTelephoneFill} from "react-icons/bs";
import{HiOutlineMail}from "react-icons/hi";
import PreguntasClinicas from "../../components/pacienteComponents/Preguntas/PreguntasClinicas"
import Sueño from "../../components/pacienteComponents/Preguntas/Sueño"
import SaludMental from "../../components/pacienteComponents/Preguntas/SaludMental"
import Alimentacion from "../../components/pacienteComponents/Preguntas/Alimentacion"
import Alcohol from "../../components/pacienteComponents/Preguntas/Alcohol"
import Drogas from "../../components/pacienteComponents/Preguntas/Drogas"
import ActividadFisica from "../../components/pacienteComponents/Preguntas/ActividadFisica"
import FormularioVida from "../../components/pacienteComponents/FormularioVida"
import HelpAlerts from "../../components/HelperAlert";
import Dolor from "../../components/pacienteComponents/Preguntas/Dolor";
import FormularioPreguntasInicio from "../../components/pacienteComponents/FormularioPreguntasInicio";
const InicioPacientes = () => {
  const [ perfil, setPerfil ] = useState({});
  const [ perfil2, setPerfil2 ] = useState({});
const {auth, actualizarContacto,  actualizarEstilodevida, cargando} =  useAuth()
const [mostrarFormulario, setMostrarFormulario] = useState(false);
const alerts = [
  {
    titulo: "¡Bienvenido a Cimiento Clínico!",
    message: "Descubre un lugar donde tu salud es nuestra prioridad. Permítenos ser parte de tu historia clínica, brindándote un servicio personalizado y seguro. Gestiona tus horarios y consulta motivos con facilidad, confiando en nuestros profesionales altamente capacitados para tu bienestar.",
    gif: "https://res.cloudinary.com/dde62spnz/image/upload/v1689624395/Imagenes%20sitio/motivoconsulta-home_shubum.gif",
  },
];




useEffect(() => {
  setPerfil(auth)

}, [])
useEffect(() => {
  setPerfil2(auth)

}, [])

const handleSubmit = async e =>{
  e.preventDefault()
  await actualizarContacto(perfil)
  setMostrarFormulario(false);
 }
 const handleSubmit2 = async e =>{
  e.preventDefault()
  await  actualizarEstilodevida(perfil2)

  
 }
 
  return (
    <>

      <div className="App">
      <header className="App-header">
      </header>
      <HelpAlerts alerts={alerts} />
    </div>




          <div className=" margen  py-8   dark:bg-slate-700 ">
          <h1 className="text-center font-regular text-black text-4xl dark:text-white shado">{auth.nombres} {auth.apellidos} </h1>
           <h1 className="text-center font-regular text-lila-200 text-4xl dark:text-white shado">Hola, Bienvenido a tu portal de paciente</h1>
       </div>




       <div className="mx-auto max-w-sm py-2">
  <h1 className="bg-coral-300 inline-block w-full  py-1 md:px-12 md:py-1 text-center text-white font-sans font-black text-md md:text-md uppercase rounded-full shadow ">MI SALUD RECIENTE</h1>
</div>

       <div className=" mt-1 mx-auto max-w-6xl   grid gap-2 grid-cols-2 md:grid-cols-4">
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1  text-center">
  <PreguntasClinicas/>
  </div>
  <div className="bg-white border-2  border-gray-200 rounded-lg p-1 text-center">
  <Sueño/>
  </div>
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1 text-center">
  <SaludMental/>
  </div>
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1 text-center">
  <Alimentacion/>
  </div>
</div>

<div className="mx-auto max-w-sm py-2">
  <h1 className="bg-coral-200 inline-block w-full py-1 md:px-12 md:py-1 text-center text-white font-sans font-black text-md md:text-md uppercase rounded-full shadow ">MI ESTILO DE VIDA</h1>
</div>
<div className=" mt-1 mx-auto max-w-6xl grid gap-2 grid-cols-2 md:grid-cols-5">
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1 text-center">
  <FormularioVida/>
  </div>
  <div className="bg-white border-2  border-gray-200 rounded-lg p-1 text-center">
  <Alcohol/>
  </div>
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1 text-center">
  <Drogas/>
  </div>
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1 text-center">
  <ActividadFisica/>
  </div>
  <div className="bg-white border-2 border-gray-200 rounded-lg p-1 text-center">
  <Dolor/>
  </div>

</div>
<div className="">
<FormularioPreguntasInicio/>
</div>


 <div className=" py-10 ">

<div className=" bg-musgo-100 py-7 ">

  <div className=" flex justify-center gap-10">
{auth.contacto=='Whatsapp' ?
<div className=" "> <h1 className="font-semibold text-2xl flex dark:text-white "> Actualmente te contactaremos por: <span className="font-bold text-lg  flex items-center ml-6">WHATSAPP </span> <BsWhatsapp className="ml-1 mt-1 "/>   </h1>  </div>  
 :' '}
 {auth.contacto=='Correo' ?
 <div className=" "> <h1 className="font-semibold text-2xl flex dark:text-white "> Actualmente te contactaremos por: <span className="font-bold text-lg  flex items-center ml-6">CORREO ElECTRÓNICO </span> <HiOutlineMail className="ml-1 mt-1"/>   </h1>  </div>  
 :' '}
 {auth.contacto=='Celular' ?
<div className=" "> <h1 className="font-semibold text-2xl flex  dark:text-white "> Actualmente te contactaremos por:    <span className="font-bold text-lg  flex items-center ml-6">CELULAR </span> <BsFillTelephoneFill className="ml-1 mt-1"/>   </h1>  </div>  
 :' '}
    <div className=''>
      <button onClick={() => setMostrarFormulario(true)}   className="">
         <svg id="Capa_1" className='h-8 '  data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path className="cls-1" d="m23.9,139.47c-1.23,1.23-1.91,2.9-1.91,4.65l-5.24,30.16c-.1.31-.19.64-.26,1l-.2,1.19c-.37,2.12.32,4.28,1.84,5.8,1.52,1.52,3.68,2.2,5.8,1.84l33.26-5.79c.42-.07.82-.17,1.07-.27.18-.06.36-.13.53-.22.2-.09.38-.19.53-.29.24-.13.47-.28.72-.45.29-.18.61-.43.83-.64l.75-.75,100.61-100.61c.59-.59,1.04-1.27,1.36-1.99.72-.33,1.39-.76,1.95-1.33l3.29-3.3c.86-.82,8.4-8.3,8.56-18.97.09-6.63-2.64-12.76-8.09-18.21-5.56-5.56-11.77-8.37-18.45-8.33-10.35.06-17.45,7.01-18.19,7.77l-4.08,4.08c-.59.59-1.03,1.26-1.35,1.97-.71.32-1.39.76-1.97,1.35L23.9,139.47Zm9.09,34.9l-6.49-6.49c-.13-.13-.28-.24-.43-.35l3.22-18.5,22.13,22.13-18.43,3.21ZM138.36,36.36c.05-.06,5.37-5.34,12.53-5.38,4.46-.03,8.74,1.98,12.73,5.98,3.87,3.87,5.81,8.05,5.74,12.44,0,.58-.06,1.16-.13,1.71-.15,1.13-.4,2.2-.74,3.21-.03.07-.05.14-.08.21-.62,1.77-1.47,3.34-2.3,4.61-.26.39-.51.75-.76,1.09-.17.23-.34.45-.5.66-.21.26-.4.5-.58.71-.44.52-.79.88-.94,1.03-.05.05-.08.08-.08.08l-2.09,2.1-12.41-12.41c-.15-.23-.32-.44-.52-.63l-12.63-12.63,2.76-2.76Zm-8.76,8.76l25.62,25.62-96.43,96.43-25.62-25.62,96.43-96.43Z"/>
        </svg>
      </button>
    </div>
</div>

{mostrarFormulario && (
        <div className="grid grid-cols-1 gap-4">
          <form onSubmit={handleSubmit}>
            <div className="container rounded-lg mx-auto md:grid grid-cols-4 gap-8 p-2">
              <div className="border-musgo-200 bg-lila-100 rounded-lg ">
                <input
                  type="radio"
                  name="contacto"
                  id="1"
                  className="peer hidden "
                  value="Whatsapp"
                  onChange={(e) =>
                    setPerfil({ ...perfil, [e.target.name]: e.target.value })
                  }
                />
                <label
                  htmlFor="1"
                  className="flex font-nunito text-white justify-center cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-green-500 peer-checked:font-bold peer-checked:text-white"
                >
                  Whatsapp <BsWhatsapp className="mt-1.5 ml-2 " />
                </label>
              </div>
              <div className="border-musgo-200 bg-lila-100 rounded-lg ">
                <input
                  type="radio"
                  name="contacto"
                  id="2"
                  className="peer hidden"
                  value="Correo"
                  onChange={(e) =>
                    setPerfil({ ...perfil, [e.target.name]: e.target.value })
                  }
                />
                <label
                  htmlFor="2"
                  className="flex font-nunito text-white justify-center cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-red-500 peer-checked:font-bold peer-checked:text-white"
                >
                  Correo <HiOutlineMail className="mt-1.5 ml-2  " />
                </label>
              </div>

              <div className="border-musgo-200 bg-lila-100 rounded-lg ">
                <input
                  type="radio"
                  name="contacto"
                  id="3"
                  className="peer hidden"
                  value="Celular"
                  onChange={(e) =>
                    setPerfil({ ...perfil, [e.target.name]: e.target.value })
                  }
                />
                <label
                  htmlFor="3"
                  className=" flex font-nunito text-white justify-center cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
                >
                  Celular <BsFillTelephoneFill className="mt-1.5 ml-2 " />
                </label>
              </div>
               <div  className="">
               <button className="   bg-lila-200 px-6 py-2 text-white rounded-md text-center  font-nunito  hover:bg-indigo-400 ">Guardar💾</button>
              </div>
  </div>

  </form>
  </div>
  )}
  </div>
</div>


<div className="flex flex-wrap  ">
<img className="  mx-auto max-w-sm " src="https://res.cloudinary.com/dde62spnz/image/upload/v1683057620/Imagenes%20sitio/main_inicio_paciente_x6yioz.png" alt="Home cimiento Clínico"/>

<div className="w-full md:w-1/2  md:p-4 flex flex-col mr-2">
 <p className="italic px-10 py-20 "> "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen."</p>
</div>
</div>

  


   
   
    </>
  )
}

export default InicioPacientes