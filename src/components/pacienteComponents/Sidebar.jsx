import React, { useState,useEffect} from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdHome, MdListAlt, MdAccountCircle,MdDarkMode } from "react-icons/md";
import{BsFillDoorOpenFill, BsFillBellFill,BsCalendar3} from "react-icons/bs";
import {GiNotebook} from "react-icons/gi";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth"
import clientAxios from "../../config/axios";
import {FiArrowRight } from "react-icons/fi";
import {MdClose } from "react-icons/md";

const Sidebar = () => {
  const {cerrarSesion,handleThemeSwitch} =  useAuth()
  const [showNotifications, setShowNotifications] = useState(false);
  const [motivos, setMotivos] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [consultasProximas, setConsultasProximas] = useState([]);

  const { auth} =  useAuth()
// Datos de los mensajes a mostrar
const messagesData = [
  { name: "Mi historia clínica", mensaje: "Aquí podrás registrar todos los datos \nde tu historia clínica" },
  {
    name: "Motivos de consulta",
    mensaje: "Ingresa y sube tu caso clínico,\npara que sea revisado por profesionales \nde Cimiento Clínico",
  },
  { name: "Mi calendario", mensaje: "Recuerda mantener tus horarios \ndisponibles al día y revisar tu \ncalendario de consultas" },
];


  const [messages, setMessages] = useState(messagesData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [showDarkOverlay, setShowDarkOverlay] = useState(false);
  const [messageClosed, setMessageClosed] = useState(false);

  useEffect(() => {
    const alertShown = localStorage.getItem('alertShown');
    setShowMessages(!alertShown);
  }, []);
  useEffect(() => {
    const alertShown = localStorage.getItem('alertShown');
    setShowMessages(!alertShown);
    setShowDarkOverlay(alertShown !== 'true' && !messageClosed);
  }, [messageClosed]);
  const handleNextMessage = () => {
    if (currentIndex < messages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowMessages(false);
      setMessageClosed(true);
      localStorage.setItem('alertShown', true);
    }
  };

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
      const token = localStorage.getItem('token')
      if(!token) return

      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      const { data } = await clientAxios.get('/pacientes/obtener-motivodeconsultas',config)
      setMotivos(data)
    } catch (error) {
      console.log(error)
    }

  }
  obtenerMotivosConsulta()      
},[motivos])
useEffect(()=>{
  const obtenerMotivosConsulta = async() =>{
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      const { data } = await clientAxios.get('/pacientes/obtener-consultas',config)
      setConsultas(data)
    } catch (error) {
      console.log(error)
    }

  }
  obtenerMotivosConsulta()      
},[consultas])
useEffect(() => {
  const token = localStorage.getItem('token')
  if(!token) return

  const config={
    headers:{
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }

  const obtenerConsultasProximas = async () => {
    const respuesta = await clientAxios.get('/pacientes/proxima-consulta',config);
    setConsultasProximas(respuesta.data);
  };
  obtenerConsultasProximas();
}, []);
const consultasPendientes = consultas.filter(con => con.paciente === auth._id && con.estado === 'pendiente'  && con.leidopaciente===false );
const consultasProximasFiltradas = consultasProximas.filter(con => con.estado ==='pagado' && con.paciente._id === auth._id  );
const consultasCombinadas = consultasPendientes.concat(consultasProximasFiltradas);
const motivosfiltrados = motivos
  .filter(motivo => motivo.estado === "publicado" && 
    (consultas.some(con => con.motivoconsulta === motivo._id && con.paciente === auth._id && con.estado === 'pendiente') || 
    consultasProximasFiltradas.some(con => con.motivoconsulta === motivo._id && con.paciente === auth._id && con.estado === 'pendiente'))
  ) 
  const motivosInterconsulta = consultas.filter(
    (consulta) =>
      consulta.motivoconsulta.paciente === auth._id &&
      consulta.motivoconsulta.notificacioninterconsulta === true && consulta.motivoconsulta.leidopacienteinterconsulta ===false && consulta.estado==='finalizado'
  );
const numNotificaciones = consultasPendientes.length + consultasProximasFiltradas.length + motivosInterconsulta.length;
  const menus = [
    { name: "Inicio", link: "/paciente", icon: MdHome },
    { name: "Perfil", link: "/paciente/perfil-paciente", icon: MdAccountCircle },
    { name: "Mi historia clínica", link: "/paciente/historia-clinica", icon: MdListAlt },
    { name: "Motivos de consulta", link: "/paciente/consultas", icon: GiNotebook },
    { name: "Mi calendario", link: "/paciente/agenda", icon: BsCalendar3 },


    
  ];
  const menus3 = [
    { name: "DarkMode", boton: "DarkMode", icon: MdDarkMode},

  ];
  const menus2 = [
    { name: "Cerrar Sesión", boton: "Cerrar sesión", icon: BsFillDoorOpenFill, margin:"2px" },

  ];
  const menus4 = [
    {  name: "Notificaciones", boton: "Notificaciones", icon: BsFillBellFill },

  ];
  const [open, setOpen] = useState(true);

  return (
  
        <aside>


          {showDarkOverlay && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 ml-[288px] ">
          {/* Contenido oscuro aquí */} 
        </div>
      )}
      <div 
      id="lateral"
        className={`bg-lila-100 dark:bg-slate-800  mb-0   ${
          open ? "w-72" : "w-16"
        } duration-500 text-white  px-4  `}
      >
          {!showDarkOverlay && (
        <div className="py-3 flex justify-end ">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => {
              setOpen(!open);
              setShowNotifications(false);
            }}
          />
        </div>
      )}
        {open ?   <div className="flex gap-x-4 items-center">
           <Link to={"/paciente"} className={`cursor-pointer font-nunito font-extrabold duration-500 text-2xl `}> Cimiento Clínico</Link>
         
          
           </div>
            : <div className="flex gap-x-4 items-center">
           <h1 className={`cursor-pointer duration-500 `}> </h1>
         </div> }
         {open ?   <div className="flex gap-x-4 items-center">
           <h2 className={`cursor-pointer font-nunito duration-500 text-xl `}> Portal Pacientes</h2>

          
           </div>
            : <div className="flex gap-x-4 items-center">
           <h1 className={`cursor-pointer duration-500 `}> </h1>
         </div> }
     
        <div className="mt-4 flex flex-col gap-4 relative">
        {menus4?.map((menu4, i) => (
  <button onClick={handleNotificationClick}
    to={menu4.boton}
    key={i}
    className={` ${
      menu4?.margin && "mt-5"
    } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-lila-200 rounded-md`}
  >
    <div>{React.createElement(menu4?.icon, { size: "20" })}
      {!open && numNotificaciones > 0 && (
        <div className="bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ml-2">
          {numNotificaciones}
        </div>
      )}
    </div>

    <h2
      style={{
        transitionDelay: `${i + 3}00ms`,
      }}
      className={`whitespace-pre duration-500 ${
        !open && "opacity-0 translate-x-28 overflow-hidden"
      }`}
    >
      {menu4?.name}
    </h2>

    <h2
      className={`${
        open && "hidden"
      } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
    >
      {menu4?.name}
    </h2>

    {open && menu4.name === "Notificaciones" && numNotificaciones > 0 &&
      <div className="bg-red-500 rounded-full px-2 py-0.5 ">{numNotificaciones}</div>
    }
  </button>
))}

{numNotificaciones > 0 && showNotifications && (
  <div className="">
    <div className="bg-gray-800 rounded-lg shadow-lg max-w-xs overflow-y-auto">
      <div className="flex justify-end">
        <button className="text-sm font-semibold" onClick={handleCloseNotifications}>Cerrar❌</button>
      </div>
      <div className="">
      {consultasCombinadas.slice(0, 3).map((con) => (
  <div key={con._id} className="mb-4">
    {con.estado === 'pendiente'  ? (
      <>
        <h1 className="text-white text-sm px-0.5 font-regular font-semibold"> Nueva propuesta de Consulta</h1>
        <p className="text-white text-xs px-0.5 font-regular">Con el profesional <span className="font-semibold">{con.profesional.nombres} {con.profesional.apellidos}</span>  {`(${con.profesional.especialidad})`}  </p>
      </>
    ) : (
      <div className="bg-lila-300 rounded-md">
      < h1 className="text-white text-sm px-0.5 font-regular font-semibold"> RECORDATORIO DE CONSULTA</h1>
      <p className="text-white text-xs px-0.5 font-regular">{con.paciente.nombres} recuerda que tienes una consulta para {new Date(con.fecha).toLocaleDateString()} a las {con.horarioinicio} <span className="text-lg">📅</span> </p>
      </div>
    )}
    <div className="border mr-1 border-gray-700 rounded-md px-0.5"></div>
  </div>
))}
     {motivosInterconsulta.map((consulta) => (
          <div key={consulta._id} className="mb-4">
            <div className=" rounded-md">
              <h1 className="text-white text-sm px-0.5 font-regular font-semibold">
                Propuesta de interconsulta
              </h1>
              <p className="text-white text-xs px-0.5 font-regular">
               El profesional  <span className="font-semibold"> {consulta.profesional.nombres} {consulta.profesional.apellidos}</span> sugiere generar una interconsulta para tu motivo de consulta: {consulta.motivoconsulta.titulo}
              </p>
            </div>
            <div className="border mr-1 border-gray-700 rounded-md px-0.5"></div>
          </div>
        ))}
      </div>
     
      {numNotificaciones  > 0 && showNotifications &&(
        
           <Link to="/paciente/notificaciones" >  <h1 className="text-blue-400 hover:text-blue-700 text-center text-sm px-0.5 font-regular">Ver todas las notificaciones</h1></Link>
           
      )}
    </div>
  </div>
)}
   {numNotificaciones === 0 && showNotifications && (
          <div className="  px-2 p-1 bg-gray-800 rounded-lg shadow-lg max-w-xs overflow-y-auto">         
            <button className="close-btn text-sm " onClick={handleCloseNotifications}>
            Cerrar❌
            </button>
            <h1 className="text-white text-center text-sm mr-2">Sin notificaciones...</h1>
            <Link to="/paciente/notificaciones" >  <h1 className="text-blue-400 hover:text-blue-700 text-center text-sm px-0.5 font-regular">Ver notificaciones antiguas</h1></Link>

          </div>
        )}

{menus.map((menu, index) => (
  <div key={index} className={`group flex flex-col gap-1 p-2 hover:bg-lila-200 rounded-md`}>
    <Link to={menu.link} className="group flex items-center text-sm gap-3.5 font-medium">
      <div>{React.createElement(menu.icon, { size: "20" })}</div>
      <h2>{menu.name}</h2>
    </Link>

    {menu.name === messages[currentIndex].name && showMessages && (
        <div className="flex max-w-xs  ">
      <div className="bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-2 py-1 text-[14px]  ">
        {messages[currentIndex].mensaje}
        <br />
      
        <span className="text-lila-300 cursor-pointer" onClick={handleNextMessage}>
          {currentIndex === messages.length - 1 ?<p className="flex text-red-600">Cerrar<MdClose className="  text-red-600 text-xl"/> </p>  :<p className="flex">Siguiente<FiArrowRight className=" mt-0.5 text-lila-300 text-lg"/> </p> } 
        </span>
      </div>
      </div>
    )}
  </div>
))}


      {menus3?.map((menu3, i) => (
            <button onClick={handleThemeSwitch}
              to={menu3.boton}
              key={i}
              className={` ${
                menu3?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-lila-200 rounded-md  `}
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
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
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
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-lila-200 rounded-md`}
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