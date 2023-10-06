import { useState, useEffect } from "react"
import clientAxios from "../../config/axios"
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
import Alerta from "../Alerta"
import CustomTooltip from "./CustomTooltip"
const FormularioAlergia = () => {
  const [alerta, setAlerta ]= useState({})
  const [nombre, setNombre] = useState('')
  const [id, setId] = useState(null)
  const {alergia,guardarAlergia, alergias, auth,cuentaConAlergia, setAlergias} =  useHistoriaCli()
  const [ocultarseccion, SetOcultarSeccion] = useState(true)
  const [ perfilale, setPerfilale ] = useState({});
  const [ perfilale4, setPerfilale4 ] = useState({});
  useEffect(() => {
    if(alergia?.nombre){
     setNombre(alergia.nombre)
     setId(alergia._id)

    }
 }, [alergia])
 useEffect(() => {
  setPerfilale(auth)

}, [])
useEffect(() => {
  setPerfilale4(auth)

}, [])
useEffect(()=>{
  const obtenerAlergias = async() =>{
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      const { data } = await clientAxios.get('/pacientes/obtener-alergias',config)
      setAlergias(data)
    } catch (error) {
      console.log(error)
    }

  }
  obtenerAlergias()

},[])

      //AGREGANDO PACIENTE
      const handleSubmit = async e =>{
        e.preventDefault();
        if([nombre].includes('')){
          setAlerta({msg: 'Hay campos vacíos', error: true})
          setTimeout(()=> setAlerta({}),5000)
          return;
        }
        setAlerta({})
        guardarAlergia({nombre})
        setNombre('')
      
       }

       const { msg } = alerta
       const handleSubmit2 = async e =>{
        e.preventDefault()
        await  cuentaConAlergia(perfilale)
        SetOcultarSeccion(true)
        
       }
       const SiAlergia = async e =>{
        e.preventDefault()
        await  cuentaConAlergia(perfilale4)
        
       }
  return (
    <>
{ auth.historiaclinica?.alergia ==='Sin datos' ?

<div className="md:flex  lg:gap-24 xs:gap-0 ">
    <div className="sm:w-1/6 xl:w-3/6 ml-4 md:mb-0 ">
    <h1 className="text-gray-600 font-nunito font-semibold text-lg py-5 xl:ml-20 xs:ml-0 ">¿Tienes alguna Alergia?</h1>
    </div>
    <div className="py-3 md:w-6/6 ">
   <form onSubmit={handleSubmit2}>
   <div className=" rounded-lg flex  flex-col items-center lg:flex-row gap-8 mt-5 lg:mt-0 ">
 <div >
   <input type="radio" name="alergia" id="sialergia" className="peer  hidden border border-gray-200" value='Si'
              onChange={ e => setPerfilale({
               ...perfilale,
               [e.target.name] : e.target.value
             })} />
   <label
     htmlFor="sialergia"
     className=" flex font-nunito  bg-indigo-300 text-white  justify-center cursor-pointer select-none rounded-lg px-4 py-2  text-center peer-checked:bg-red-500 peer-checked:font-bold peer-checked:text-white">
       Si✔️</label>
 </div>

 <div className="">
   <input type="radio" name="alergia" id="noalergia" className="peer hidden border border-gray-200" value='No'
              onChange={ e => setPerfilale({
               ...perfilale,
               [e.target.name] : e.target.value
             })} />
   <label
     htmlFor="noalergia"
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

{auth.historiaclinica?.alergia ==='Si'
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
                   
                   🔽                    </div>
                  :
                  <div className="flex gap-2">
                   <h2 className="text-white font-nunito text-md" >Alergias</h2>
                   ▶️                    </div>
                  } </span>                     
            </button>
</div>

<form onSubmit={handleSubmit} className=  {`${ocultarseccion?'block':'hidden'} xs:block `}>

    <div className="md:flex  lg:gap-24 xs:gap-0 px-5 ">
      <div className="md:w-4/6 ml-4 md:mb-0   ">
      <div>
  <label className="text-gray-700 font-bold text-sm" data-tooltip-id="antecedentes-tooltip" data-tooltip-content="Ingresa cualquier tipo de alergia que tengas (alimentos,medicamentos,etc)">
  Alergias
    <CustomTooltip id="antecedentes-tooltip" message="Ingresa cualquier tipo de alergia que tengas(alimentos,medicamentos,etc)" />
  </label>
</div>
      <input
            type="text"
            className="w-11/12 focus:outline-none focus:text-gray-900  border border-gray-300 rounded-md placeholder-slate-400 p-2 "
            placeholder="Ingresa tu alergia"
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
    { alergias.length ?

<div className=" flex mt-2 flex-col lg:flex-row px-1	">
  <div className=" px-8 grid grid-cols-3 gap-1 ">{alergias.map(ale => (
    
    <div key={ale._id}>
       <h2 className="text-gray-500 font-nunito text-sm mt-1"> {ale.nombre},</h2>

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

           🔽       </div>
          :
          <div className="flex gap-2">
           <h2 className="text-white font-nunito text-md" >Alergias</h2>
            ▶️         </div>
          } </span>                     
    </button>
</div>

<div className={`${ocultarseccion?'block':'hidden'} xs:block `}>
  <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-2 text-gray-700 items-center">
    <div className="flex">
      <h1 className=" font-bold ml-7 mt-1">Alergias: Paciente sin alergias </h1>
    </div>
<div className="md:w-8/12 text-center md:pl-6">
<form onSubmit={SiAlergia}>
<input type="radio" name="alergia" className="peer hidden border border-gray-200 " value='Sin datos' checked
              onChange={ e => setPerfilale4({
               ...perfilale4,
               [e.target.name] : e.target.value
             })} />
<button className="text-white w-2/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-3 inline-flex items-center focus:outline-none md:float-right mr-4">
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

export default FormularioAlergia