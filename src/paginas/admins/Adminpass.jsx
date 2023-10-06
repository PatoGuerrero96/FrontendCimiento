import { Link } from "react-router-dom"
const Adminpass = () => {
  return (
    <>
    
    
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center ">
  <div className=" mx-auto md:w-90 ">
    <h1 id="textologo" className="font-bold font-nunito text-center text-4xl ">Cimiento Clínico</h1>
    <h1 className="font-semibold font-nunito text-center text-2xl tre">Nueva contraseña de Administrador registrada. Ya puedes iniciar sesión</h1>

  
    <div className="text-center mt-10  ">
    <button className=" bg-white transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <Link to="/ingresa-admin" className="inline-block ml-1">Volver al login</Link>

            </button>
    </div>

  </div>
</div>
        
        </>
  )
}

export default Adminpass