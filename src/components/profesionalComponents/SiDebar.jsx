import React, { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdHome,  MdVideoChat, MdAccountCircle,MdFollowTheSigns,MdPaid, MdDarkMode,MdContentPaste } from "react-icons/md";
import{HiUserGroup} from "react-icons/hi";
import{BsFillDoorOpenFill,BsCalendar3} from "react-icons/bs";
import { Link } from "react-router-dom";
import proAuth from "../../hooks/proAuth"
import clientAxios from "../../config/axios";
const Sidebar = () => {
  const {cerrarSesion, handleThemeSwitch, authpro} =  proAuth()
  const [showNotifications, setShowNotifications] = useState(false);
  const [consultas, setConsultas] = useState([]);
  const handleNotificationClick = () => {
    setShowNotifications(true);
    setOpen(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };
  useEffect(()=>{
    const obtenerMotivosConsulta = async() =>{
      try {
        const tokenPro = localStorage.getItem('tokenPro')
        if(!tokenPro) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
        }
        }
        const { data } = await clientAxios.get('/profesional/obtener-lista-consultas',config)
         setConsultas(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerMotivosConsulta()      
  },[consultas])
  const consultaspro =  consultas.filter(con => con.profesional._id === authpro._id && con.leido===false) 
  const numNotificaciones= consultaspro.length
  const menus = [
    { name: "Inicio", link: "/profesional", icon: MdHome },
    { name: `Tus Consultas` , link: "/profesional/consultas", icon:MdVideoChat},
    { name: "Motivos de consulta", link: "/profesional/lista-motivos-consulta", icon: MdContentPaste },
    { name: "Perfil", link: "/profesional/perfil-profesional", icon: MdAccountCircle },
    { name: "Tarifas", link: "/profesional/tarifas", icon: MdPaid },
    { name: "Mis Horarios", link: "/profesional/agenda-profesional", icon: BsCalendar3 },
    { name: "Comunidad", link: "/profesional/comunidad", icon: HiUserGroup },
    { name: "Portal Paciente", link: "/paciente", icon: MdFollowTheSigns, margin:10 },
  ];


  const menus2 = [
    { name: "Cerrar Sesión", boton: "Cerrar sesión", icon: BsFillDoorOpenFill, },
    

  ];
  const menus3 = [
    { name: "DarkMode", boton: "DarkMode", icon: MdDarkMode },

  ];
  const [open, setOpen] = useState(true);

  return (
  
      <aside>
      <div
        className={`bg-coral-200 min-h-screen dark:bg-slate-800 ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          /> 
          
        </div>
        {open ?   <div className="flex gap-x-4 items-center">
           <Link to={"/profesional"} className={`cursor-pointer font-nunito font-extrabold duration-500 text-2xl `}> Cimiento Clínico</Link>
        
          
           </div>
            : <div className="flex gap-x-4 items-center">
           <h1 className={`cursor-pointer duration-500 `}> </h1>
         </div> }
         {open ?   <div className="flex gap-x-4 items-center">
           <h2 className={`cursor-pointer font-nunito duration-500 text-xl `}> Portal Profesionales</h2>
        
          
           </div>
            : <div className="flex gap-x-4 items-center">
           <h1 className={`cursor-pointer duration-500 `}> </h1>
         </div> }
     
        <div className="mt-4 flex flex-col gap-4 relative">


        {menus?.map((menu, i) => (
  <Link to={menu.link} key={i}>
    <button onClick={handleNotificationClick}
      className={` ${
        menu?.margin && "mt-5"
      } group flex items-center text-sm  gap-3.5 font-medium p-2 rounded-md ${open ? "hover:bg-coral-100" : "hover:bg-opacity-0"}`}
    >
      {menu?.link === "/profesional/consultas" ? (
        <div>{React.createElement(menu?.icon, { size: "20" })}
          {!open && numNotificaciones > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ml-2">
              {numNotificaciones}
            </div>
          )}
        </div>
      ) : (
        <div>{React.createElement(menu?.icon, { size: "20" })}</div>
      )}

      <h2
        style={{
          transitionDelay: `${i + 3}00ms`,
        }}
        className={`whitespace-pre duration-500 ${
          !open && "opacity-0 translate-x-28 overflow-hidden"
        }`}
      >
        {menu?.name}
      </h2>

      <h2
        className={`${
          open && "hidden"
        } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
      >
        {menu?.name}
      </h2>

      {open && menu?.name && menu?.name !== "Tus Consultas" && (
        <h2
          className={`${
            open && "hidden"
          } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
        >
          {menu?.name}
        </h2>
      )}

      {open && menu?.name === "Tus Consultas" && numNotificaciones > 0 && (
        <div className="bg-red-500 rounded-full px-2 py-0.5 ">
          {numNotificaciones}
        </div>
      )}
    </button>
  </Link>
))}





{menus3?.map((menu3, i) => (
  <button onClick={handleThemeSwitch}
    to={menu3.boton}
    key={i}
    className={` ${
      menu3?.margin && "mt-5"
    } group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-coral-100 rounded-md ${
      open ? "" : "hover:bg-opacity-0"
    }`}
  >
    <div>{React.createElement(menu3?.icon, { size: "20" })}</div>
    <h2
      style={{
        transitionDelay: `${i + 3}00ms`,
      }}
      className={`whitespace-pre duration-500 ${
        !open && "opacity-0 translate-x-28 overflow-hidden"
      }`}
    >
      {menu3?.name}
    </h2>
    <h2
      className={`${
        open ? "hidden" : "block"
      } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
    >
      {menu3?.name}
    </h2>
  </button>
))}

{menus2?.map((menu2, i) => (
  <button onClick={cerrarSesion}
    to={menu2.boton}
    key={i}
    className={` ${
      menu2?.margin && "mt-5"
    } group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md ${open ? "hover:bg-coral-100" : "hover:bg-opacity-0"}`}
  >
    <div>{React.createElement(menu2?.icon, { size: "20" })}</div>
    <h2
      style={{
        transitionDelay: `${i + 3}00ms`,
      }}
      className={`whitespace-pre duration-500 ${
        !open && "opacity-0 translate-x-28 overflow-hidden"
      }`}
    >
      {menu2?.name}
    </h2>
    <h2
      className={`${
        open && "hidden"
      } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
    >
      {menu2?.name}
    </h2>
  </button>
))}
          
          
        </div>
        
      </div>
      </aside>
      
      
  
    
  );
};

export default Sidebar;