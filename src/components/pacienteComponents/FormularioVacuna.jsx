import { useState, useEffect } from "react"
import clientAxios from "../../config/axios"
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
import Alerta from "../Alerta"
const FormularioVacuna = () => {
  const [alerta, setAlerta ]= useState({})
  const [nombre, setNombre] = useState('')
  const [id, setId] = useState(null)
  const {vacuna,guardarVacuna, vacunas, auth,cuentaConVacuna,setVacunas} = useHistoriaCli()

  const [ perfil3, setPerfil3 ] = useState({});
  const [ perfil4, setPerfil4 ] = useState({});
  useEffect(() => {
    if(vacuna?.nombre){
     setNombre(vacuna.nombre)
     setId(vacuna._id)

    }
 }, [vacuna])
 
 useEffect(() => {
  setPerfil3(auth)

}, [])
useEffect(() => {
  setPerfil4(auth)

}, [])
useEffect(()=>{
  const obtenerVacunas = async() =>{
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config={
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
      }
      const { data } = await clientAxios.get('/pacientes/obtener-vacuna',config)
      setVacunas(data)
    } catch (error) {
      console.log(error)
    }

  }
  obtenerVacunas()

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
        guardarVacuna({nombre})
        setNombre('')
      
       }

       const { msg } = alerta
       const handleSubmit2 = async e =>{
        e.preventDefault()
        await  cuentaConVacuna(perfil3)
      
        
       }
       const SiVacuna = async e =>{
        e.preventDefault()
        await  cuentaConVacuna(perfil4)
        
       }
  return (
    <>
{ auth.historiaclinica?.vacuna ==='Sin datos' ?


 <div className="card   rounded-xl flex flex-col ml-10 bg-[#d5d5d5] ">
 <div className="title text-md font-regular font-nunito">Tienes alguna vacuna?</div>
 <div className="w-full ">

   <form onSubmit={handleSubmit2} >
 <div className="inline-block mr-2 mt-2">
       <div className="flex">
       <div>
         <input type="radio" name="vacuna" id="sivacuna" className="peer hidden border border-gray-200" value='Si'
               onChange={ e => setPerfil3({
                ...perfil3,
                [e.target.name] : e.target.value
              })} />
 <label
 htmlFor="sivacuna"
 className="flex font-nunito text-white justify-center bg-red-500 cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white"
 >
 💉
 Si tengo vacunas</label>
 </div>
         
 </div>          
 </div>
 <div className="inline-block mr-2 mt-2">
 <div className="flex">
 <div>
 <input type="radio" name="vacuna" id="novacuna" className="peer  hidden border border-gray-200" value='No'
               onChange={ e => setPerfil3({
                ...perfil3,
                [e.target.name] : e.target.value
              })} />
 <label
 htmlFor="novacuna"
 className="flex font-nunito bg-green-500 text-white justify-center cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse peer-checked:font-bold peer-checked:text-white">
 🚫
 No tengo vacunas </label>
 </div>
         
 </div>
       
 </div>
 
 <button className="  bg-[#96858f] hover:bg-indigo-400 px-2 py-2 text-white rounded-md text-rigth ml-10 font-nunito ">Guardar💾</button>
 </form>
 
 
 </div>
 </div>
 
:
<div>

{auth.historiaclinica?.vacuna ==='Si'
?

<div>
<div>
{msg && <Alerta 
        alerta={alerta}
        />}
</div>

<form onSubmit={handleSubmit}>

    <div className="md:flex  lg:gap-2 xs:gap-0 ">
      <div className="md:w-5/6 ml-4 md:mb-0  ">
      <input
            type="text"
            className="w-11/12 focus:outline-none focus:text-gray-900 bg-[#d5d5d5] border rounded-md placeholder-slate-600 p-2 "
            placeholder="Ingresa información de tus vacunas"
            value={nombre}
            onChange={e => setNombre(e.target.value) } 
          />
          </div>
     
      <div className="md:w-2/6 ">
        
      <button className="text-white w-2/2 mx-auto max-w-sm rounded-md text-center bg-[#96858f] hover:bg-indigo-400 py-2 px-3 inline-flex items-center focus:outline-none mr-2 float-right">
         Agregar💾
        </button>
        

    </div>
    </div>
    </form>

    { vacunas.length ?

<div className=" flex">
<h1 className=" text-gray-700 px-4 font-nunito text-sm"> Tus registros:</h1>
  <div className="  grid grid-cols-2 gap-1  ">{vacunas.map(va => (
    
    <div key={va._id}>
       <h2 className="text-gray-500 font-nunito text-sm"> {va.nombre},</h2>
       

    </div>
))}   </div>
</div>


: '' }
</div>

    


:
<div >


<div>     
    <div className='  md:flex  lg:gap-2 xs:gap-0 '>
      <div className='md:w-4/6 ml-4 md:mb-0 border  border-gray-200 rounded-md'>
      <h1 className='px-1 mt-1  font-nunito'> { auth.historiaclinica?.vacuna==='No' ? 'El paciente no tiene vacunas 💉':' '} </h1>    
      </div>
    <form onSubmit={SiVacuna}  >
<input type="radio" name="vacuna" className="peer hidden " value='Sin datos' checked
              onChange={ e => setPerfil3({
               ...perfil3,
               [e.target.name] : e.target.value
             })} />
     
     <div className='md:w-6/6 '>
          <button  title="Actualizar" className="  bg-[#96858f] px-2 py-2 text-white rounded-md text-rigth  font-nunito  hover:bg-indigo-400 ">Cambiar🔄</button>
          </div>

  </form>
    </div>

          </div>
</div>

}
</div>
}
   
    </>
  )
}

export default FormularioVacuna