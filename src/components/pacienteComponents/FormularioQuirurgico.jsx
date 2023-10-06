import { useState, useEffect } from "react"
import Alerta from "../Alerta"
import clientAxios from "../../config/axios"
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
import CustomTooltip from "./CustomTooltip"
const FormularioQuirurgico = () => {
  const [alerta, setAlerta ]= useState({})
  const [nombre, setNombre] = useState('')
  const [id, setId] = useState(null)
  const {quirurgico,guardarQuirurgico, quirurgicos, auth,cuentaConQuirurgico, setQuirurgicos} =  useHistoriaCli()
  const [ocultarseccion, SetOcultarSeccion] = useState(true)
  const [ perfil, setPerfil ] = useState({});
  const [ perfil4, setPerfil4 ] = useState({});

  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
  useEffect(() => {
    if(quirurgico?.nombre){
     setNombre(quirurgico.nombre)
     setId(quirurgico._id)

    }
 }, [quirurgico])
 useEffect(() => {
  setPerfil(auth)

}, [])
useEffect(() => {
  setPerfil4(auth)

}, [])
//Obtener Quirurgicos
useEffect(()=>{
  const obtenerQuirurgicos = async() =>{
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      const { data } = await clientAxios.get('/pacientes/obtener-quirurgico',config)
      setQuirurgicos(data)
    } catch (error) {
      console.log(error)
    }

  }
  obtenerQuirurgicos()

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
        guardarQuirurgico({nombre})
        setNombre('')
      
       }

       const { msg } = alerta
       const handleSubmit2 = async e =>{
        e.preventDefault()
        await  cuentaConQuirurgico(perfil)
        SetOcultarSeccion(true)
        
       }
       const SiQuirurgico= async e =>{
        e.preventDefault()
        await  cuentaConQuirurgico(perfil4)
        
       }
  return (
    <>
{ auth.historiaclinica?.quirurgico ==='Sin datos' ?



   <div className="md:flex  lg:gap-24 xs:gap-0 ">
    <div className="sm:w-1/6 xl:w-3/6 ml-4 md:mb-0 ">
    <h1 className="text-gray-600 font-nunito font-semibold text-lg py-5 xl:ml-20 xs:ml-0 ">¿Tienes antedecentes Quirúrgicos?</h1>
    </div>
    <div className="py-3 md:w-6/6 ">
   <form onSubmit={handleSubmit2}>
   <div className=" rounded-lg flex  flex-col items-center lg:flex-row gap-8 mt-5 lg:mt-0 ">
 <div >
   <input type="radio" name="quirurgico" id="siquirurgico" className="peer  hidden border border-gray-200" value='Si'
              onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
   <label
     htmlFor="siquirurgico"
     className=" flex font-nunito  bg-indigo-300 text-white  justify-center cursor-pointer select-none rounded-lg px-4 py-2  text-center peer-checked:bg-red-500 peer-checked:font-bold peer-checked:text-white">
       Si✔️ </label>
 </div>

 <div className="">
   <input type="radio" name="quirurgico" id="noquirurgico" className="peer hidden border border-gray-200" value='No'
              onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
   <label
     htmlFor="noquirurgico"
     className=" flex font-nunito  bg-indigo-300 text-white    justify-center cursor-pointer select-none rounded-lg  px-3.5 py-2  text-center peer-checked:bg-green-500 peer-checked:font-bold peer-checked:text-white">
       No❌</label>
 </div>
 <button className="text-white w-1/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-4 inline-flex items-center focus:outline-none md:float-right">
   Guardar💾
  </button>
 </div>


   </form>
   </div>
 </div>

 
:

<div>

{auth.historiaclinica?.quirurgico ==='Si'
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
                   <h2 className="text-white font-nunito text-md" >Antecedentes Quirúrgicos</h2>
                   ▶️                     </div>
                  } </span>                     
            </button>
            
</div>

<form onSubmit={handleSubmit} className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>

<div className="md:flex  lg:gap-24 xs:gap-0 px-5 ">
      <div className="md:w-4/6 ml-4 md:mb-0   ">
      <div>
  <label className="text-gray-700 font-bold text-sm" data-tooltip-id="antecedentes-tooltip" data-tooltip-content="En este campo, registra todas las cirugías que hayas experimentado a lo largo de tu vida">
    Antecedentes Quirúrgicos
    <CustomTooltip id="antecedentes-tooltip" message="En este campo, registra todas las cirugías que hayas experimentado a lo largo de tu vida" />
  </label>
</div>

      <input
            type="text"
            className="w-11/12 focus:outline-none focus:text-gray-900 mb-1 border border-gray-300 rounded-md placeholder-slate-400 p-2 "
            placeholder="Ingresa tus antecedentes Quirúrgicos"
            value={nombre}
            onChange={e => setNombre(e.target.value) } 
          />
          </div>
     
      <div className="py-3 md:w-6/6  ">
        
      <button className="text-white w-2/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-4 inline-flex items-center focus:outline-none md:float-right">
         Agregar💾
        </button>
        

    </div>
    </div>
    
    
    </form>
     <div className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>
    { quirurgicos.length ?

<div className=" flex mt-2 flex-col lg:flex-row px-1">

  <div className=" px-8 grid grid-cols-3 gap-1    ">{quirurgicos.map(qui => (
    
    <div key={qui._id} className="flex  ">
       <h2 className="text-gray-500 font-nunito text-sm mt-1">  {qui.nombre},</h2>

    </div>
))}   </div>
</div>


: '' }
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
           <h2 className="text-white font-nunito text-md" >Antecedentes Quirúrgicos</h2>
           ▶️            </div>
          } </span>                     
    </button>
    
                   
    
</div>


<div className={`${ocultarseccion?'block':'hidden'} xs:block `}>
  
  <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-2 text-gray-700 items-center ">
<h2 className="md:w-4/12 ml-8 max-w-sm font-bold mx-auto">Antecedentes Quirúrgicos:</h2>

<div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5  pl-2">
  <div className="w-full inline-flex ">
  <h1 className="font-semibold text-xl">Paciente sin Antecedentes Quirúrgicos</h1>
  </div>
</div>


<div className="md:w-3/12 text-center md:pl-6">
<form onSubmit={SiQuirurgico}>
<input type="radio" name="quirurgico" className="peer hidden border border-gray-200" value='Sin datos' checked
              onChange={ e => setPerfil4({
               ...perfil4,
               [e.target.name] : e.target.value
             })} />
<button className="text-white w-2/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-3 inline-flex items-center focus:outline-none md:float-right">
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

export default FormularioQuirurgico