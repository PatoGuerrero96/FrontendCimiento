import { useState, useEffect } from "react"
import clientAxios from "../../config/axios"
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
import Alerta from "../Alerta"
import CustomTooltip from "./CustomTooltip"
const FormularioEnfermedad = () => {
  const [alerta, setAlerta ]= useState({})
  const [nombre, setNombre] = useState('')
  const [fechadiagnostico, setFechadiagnostico] = useState('')
  const [id, setId] = useState(null)
  const {enfermedad,guardarEnfermedad, enfermedades, auth,cuentaConEnfermedad, setEnfermedades} =  useHistoriaCli()
  const [ocultarseccion, SetOcultarSeccion] = useState(true)
  const [ perfil, setPerfil ] = useState({});
  const [ perfil4, setPerfil4 ] = useState({});

  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
  useEffect(() => {
    if(enfermedad?.nombre){
     setNombre(enfermedad.nombre)
     setNombre(enfermedad.fechadiagnostico)
     setId(enfermedad._id)

    }
 }, [enfermedad])
 useEffect(() => {
  setPerfil(auth)

}, [])
useEffect(() => {
  setPerfil4(auth)

}, [])
useEffect(()=>{
  const obtenerEnfermedades = async() =>{
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      const { data } = await clientAxios.get('/pacientes/obtener-enfermedad',config)
      setEnfermedades(data)
    } catch (error) {
      console.log(error)
    }

  }
  obtenerEnfermedades()

},[])

      //AGREGANDO ENFERMEDAD
      const handleSubmit = async e =>{
        e.preventDefault();
        if([nombre].includes('')){
          setAlerta({msg: 'Hay campos vacíos', error: true})
          setTimeout(()=> setAlerta({}),5000)
          return;
        }
        setAlerta({})
        guardarEnfermedad({nombre,fechadiagnostico})
        setNombre('')
        setFechadiagnostico('')
      
       }

       const { msg } = alerta
       const handleSubmit2 = async e =>{
        e.preventDefault()
        await  cuentaConEnfermedad(perfil)
        SetOcultarSeccion(true)
        
       }
       const SiEnfermedad= async e =>{
        e.preventDefault()
        await  cuentaConEnfermedad(perfil4)
        
       }
  return (
    <>
{ auth.historiaclinica?.enfermedad ==='Sin datos' ?



   <div className="md:flex  lg:gap-24 xs:gap-0 ">
    <div className="sm:w-1/6 xl:w-3/6 ml-4 md:mb-0 ">
    <h1 className="text-gray-600 font-nunito font-semibold text-sm py-5 xl:ml-20 xs:ml-0 ">¿Tienes algún diagnóstico?</h1>
    </div>
    <div className="py-3 md:w-6/6 ">
   <form onSubmit={handleSubmit2}>
   <div className=" rounded-lg flex  flex-col items-center lg:flex-row gap-8 mt-5 lg:mt-0 ">
 <div >
   <input type="radio" name="enfermedad" id="sienfermedad" className="peer  hidden border border-gray-200" value='Si'
              onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
   <label
     htmlFor="sienfermedad"
     className=" flex font-nunito text-sm  bg-indigo-300 text-white  justify-center cursor-pointer select-none rounded-lg px-4 py-2  text-center peer-checked:bg-red-500 peer-checked:font-bold peer-checked:text-white">
       Si✔️ </label>
 </div>

 <div className="">
   <input type="radio" name="enfermedad" id="noenfermedad" className="peer hidden border border-gray-200" value='No'
              onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
   <label
     htmlFor="noenfermedad"
     className=" flex font-nunito  text-sm bg-indigo-300 text-white    justify-center cursor-pointer select-none rounded-lg  px-3.5 py-2  text-center peer-checked:bg-green-500 peer-checked:font-bold peer-checked:text-white">
       No❌</label>
 </div>
 <button className="text-white text-sm w-1/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-4 inline-flex items-center focus:outline-none md:float-right">
   Guardar💾
  </button>
 </div>


   </form>
   </div>
 </div>

 
:

<div>

{auth.historiaclinica?.enfermedad ==='Si'
?

<div>


<div>
{msg && <Alerta 
        alerta={alerta}
        />}
</div>
        <div className="text-right mr-5">
        <button  className="p-1 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-[#6d7993]  hover:bg-indigo-500 "
            onClick={()=> SetOcultarSeccion(!ocultarseccion)}>
                  <span className="text-xs  font-regular  lg:block">{ocultarseccion ? 
                  <div className="flex gap-2">
                     🔽    
                  </div>
                  :
                  <div className="flex gap-2">
                   <h2 className="text-white  font-nunito text-md" >Diagnósticos</h2>
                   ▶️                     </div>
                  } </span>                     
            </button>
            
</div>

<form onSubmit={handleSubmit} className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>

<div className="md:flex  lg:gap-24 xs:gap-0 px-5 ">
      <div className="md:w-4/6 ml-4 md:mb-0   ">
      <div>
      <label className="text-gray-700 font-bold text-sm" data-tooltip-id="my-tooltip" data-tooltip-content="Registra los diagnósticos que hayas tenido durante tu vida">
        Diagnósticos <CustomTooltip id="my-tooltip" message="Registra los diagnósticos que hayas tenido durante tu vida" />
      </label>
    </div>
      <input
            type="text"
            className="w-11/12 focus:outline-none focus:text-gray-900 mb-1 border border-gray-300 rounded-md placeholder-slate-400 px-2 py-1 text-sm "
            placeholder="Escribe aquí los diagnósticos que presentas"
            value={nombre}
            onChange={e => setNombre(e.target.value) } 
          />
          <div>
          <div>
      <label className="text-gray-700 font-bold text-sm" data-tooltip-id="my-tooltip" data-tooltip-content="Agrega una fecha estimada de tu diagnóstico">
      ¿Cuando fue tu diagnóstico? <CustomTooltip id="my-tooltip" message="Agrega una fecha estimada de tu diagnóstico" />
      </label>
    </div>
          <input
             id="fechadiagnostico"
            type="text"
            className="w-11/12 focus:outline-none focus:text-gray-900 mb-1 border border-gray-300 rounded-md placeholder-slate-400 px-2 py-1 text-sm  "
            placeholder="Escribe en que año o desde cuando recuerdas tener este diagnóstico"
            value={fechadiagnostico}
            onChange={e => setFechadiagnostico(e.target.value) } 
          />
          </div>
          </div>
     
      <div className="py-3 md:w-6/6  ">
        
      <button className="text-white w-2/2 mx-auto max-w-sm rounded-md text-sm text-center bg-lila-200 hover:bg-lila-100 py-2 px-3 inline-flex items-center focus:outline-none md:float-right">
         Agregar💾
        </button>
        

    </div>
    </div>
    
    
    </form>
    <div className={`${ocultarseccion ? 'block' : 'hidden'} xs:block`}>
  {enfermedades.length ? (
    <div className="flex flex-col lg:flex-row px-1">
      <div className="px-8 grid grid-cols-3 gap-1">
        {enfermedades
          .filter(enf => enf.guardadoporpaciente === true)
          .map(enf => (
            <div key={enf._id} className="flex">
              <h2 className="text-gray-500 font-nunito text-sm mt-1">{enf.nombre},</h2>
            </div>
          ))}
      </div>
    </div>
  ) : null}
</div>

<div className={`${ocultarseccion ? 'block' : 'hidden'} xs:block`}>
  {enfermedades.length ? (
    <div className="flex flex-col lg:flex-row px-1">
      <div className="px-8 grid grid-cols-3 gap-1">
        {enfermedades
          .filter(enf => enf.guardadoporpaciente === false)
          .map((enf, index) => (
            <div key={enf._id} className="flex">
              <h2 className=" font-bold text-gray-900 text-sm mt-1">{`${index + 1}.- ${enf.nombre}`}  {enf.fechadiagnostico ||''} </h2>
            </div>
          ))}
      </div>
    </div>
  ) : null}
</div>

</div>
   
    
 

:
<div >
<div className="text-right mr-5">
<button  className="p-1 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-[#6d7993]  hover:bg-indigo-500 "
    onClick={()=> SetOcultarSeccion(!ocultarseccion)}>
          <span className="text-xs  font-regular  lg:block">{ocultarseccion ? 
          <div className="flex gap-2">

           🔽            </div>
          :
          <div className="flex gap-2">
           <h2 className="text-white font-nunito text-md" >Diagnósticos</h2>
           ▶️            </div>
          } </span>                     
    </button>
    
                   
    
</div>


<div className={`${ocultarseccion ? 'block' : 'hidden'} xs:block`}>
  <div className="md:inline-flex w-full md:space-y-0 text-gray-700 items-center">
    <h2 className="text-sm md:w-4/12 ml-8 max-w-sm font-bold mx-auto">Diagnósticos: Paciente sin Diagnósticos</h2>
    <div className="md:w-3/12 text-center pr-6 flex items-center">
      <form onSubmit={SiEnfermedad}>
        <input
          type="radio"
          name="enfermedad"
          className="peer hidden border border-gray-200"
          value="Sin datos"
          checked
          onChange={e =>
            setPerfil4({
              ...perfil4,
              [e.target.name]: e.target.value
            })
          }
        />
        <button className="text-white ml-2 rounded-md text-sm text-center bg-lila-200 hover:bg-lila-100 py-2 px-4 focus:outline-none">
          Actualizar🔄
        </button>
      </form>
    </div>
  </div>
</div>
</div>

}
</div>
}
   
    </>
  )
}

export default FormularioEnfermedad