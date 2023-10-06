import React from 'react'
import { Link, useLocation } from "react-router-dom"
import proAuth from "../../hooks/proAuth"
const HeaderPerfil = () => {
    const {authpro} =  proAuth()
  return (
    <>

<header className="pt-12 bg-lila-200 ">
     <div className="container mx-auto flex flex-col md:flex-row justify-center items-center font-nunito   ">
<nav className="flex flex-col items-start md:flex-row justify-content: flex-start xl:gap-1 sm:gap-1 xl:mt-2 lg:mt-0">

    
 <Link to="/profesional/perfil-profesional"  className={`text-white text-sm hover:text-gray-300 bg-green-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/profesional/perfil-profesional' && 'text-gray-300  '}`}>Mi Perfil
 </Link>

 <Link to="/profesional/mi-presentacion"  className={`text-white text-sm hover:text-gray-300 bg-yellow-600 px-3 py-1 xl:rounded-t-lg xs:rounded-md font-regular flex ${location.pathname === '/profesional/mi-presentacion' && 'text-gray-300  '}`}>Mi Presentación
 </Link>
  
         </nav>
     </div>
   </header>
 
    </>
  )
}

export default HeaderPerfil