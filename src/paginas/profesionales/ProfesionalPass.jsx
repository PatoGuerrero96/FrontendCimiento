import { Link } from 'react-router-dom'
const ProfesionalPass = () => {
  return (
    <>
    
    <div className="bg-blue-400 h-screen w-screen">
    <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-3/4 bg-white sm:mx-0" >
        <div className="flex flex-col w-full md:w-1/2 p-4">
                <div className="flex flex-col flex-1 justify-center mb-8">
                <h1 id="textologo" className="font-bold font-nunito text-center text-4xl ">Cimiento Clínico</h1>
                <h1 id="textologo" className="mt-2 text-xl font-nunito font-semibold mb-8 text-center">Nueva contraseña de Profesional registrada. Ya puedes iniciar sesión</h1>
                    <div className="form-horizontal w-3/4 mx-auto"> 
                        <form  className="w-full mt-4"  action="#">                        

                            <div className="flex flex-col">
                                <Link to="/ingresa-profesional" className=" text-center font-nunito font-regular bg-blue-500 hover:bg-blue-700 text-white text-md font-semibold py-2 px-4 rounded-lg hover:-translate-y-1 transition-all duration-500">
                                    Iniciar sesión
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 rounded-r-lg " ><img className='' src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082008/Imagenes%20sitio/ingreso-pro_cpza95.png" alt="" /></div>

        </div>
    </div>
</div>
    
    </>
  )
}

export default ProfesionalPass