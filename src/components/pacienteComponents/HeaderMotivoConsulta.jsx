import React from 'react'
import { Link } from "react-router-dom"

const HeaderMotivoConsulta= () => {
  return (
    <>

<header className="pt-8 bg-lila-200 ">
     <div className="container mx-auto flex flex-col md:flex-row justify-center items-center font-nunito   ">
<nav className="flex flex-col items-start md:flex-row justify-content: flex-start xl:gap-1 sm:gap-1 xl:mt-2 lg:mt-0">

    
 <Link to="/paciente/consultas"  className={`text-white text-sm hover:text-gray-300 bg-green-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/consultas' && 'text-gray-300  '}`}>Motivos de consulta
 </Link>

 <Link to="/paciente/tus-consultas"  className={`text-white text-sm hover:text-gray-300 bg-yellow-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/paciente/tus-consultas' && 'text-gray-300  '}`}>Tus consultas
 </Link>
  
         </nav>
     </div>
   </header>
 
    </>
  )
}

export default HeaderMotivoConsulta