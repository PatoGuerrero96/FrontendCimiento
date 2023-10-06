
import { Link } from 'react-router-dom'
const PacientePass = () => {
  return (
    <div className="h-screen flex">
        
    <div  className="flex w-full  lg:w-1/2 justify-center items-center space-y-8">
    <div className="w-full px-8 md:px-48 lg:px-36">

    <h1 id="textologo"className="font-extrabold font-nunito text-3xl mb-1 text-center">Cimiento Clínico</h1>
              <h1 id="textologo" className="text-2xl font-nunito text-gray-400 font-normal mb-8 text-center">Nueva contraseña de Paciente registrada. Ya puedes iniciar sesión</h1>
              <Link id="primario" to="/ingresa" className=" text-center block w-full font-nunito py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Iniciar Sesión</Link>

      </div>
    
    </div>

    <div id="primario" className=" hidden lg:flex w-full lg:w-1/2 login_img_section
    justify-around items-center">
      <div className="bg-black  opacity-20 inset-0 z-0">

        </div>
        <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
        <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689081827/Imagenes%20sitio/ingreso-pass_pmu5rf.png" alt="" />
        <h1 className="text-white text-3xl font-nunito font-bold">Contraseña restablecida, Ya puedes iniciar sesión</h1>
        
        </div>
     
      
    </div>
</div>  
  )
}

export default PacientePass