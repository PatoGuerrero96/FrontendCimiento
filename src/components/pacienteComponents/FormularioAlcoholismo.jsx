import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import usePreguntasCli from '../../hooks/paciente/usePreguntasCli';
const FormularioAlcoholismo = () => {
    const [ perfilD, setPerfild ] = useState({});
    const [ perfild2, setPerfild2 ] = useState({});
    const {auth,actualizarAlcohol} =  usePreguntasCli()
    const [ocultarseccion, SetOcultarSeccion] = useState(true)


useEffect(() => {
        setPerfild(auth)
      
      }, [])
 useEffect(() => {
        setPerfild2(auth)
      
      }, [])

      const handleSubmit = async e =>{
        e.preventDefault()
        await  actualizarAlcohol(perfilD)
        SetOcultarSeccion(true)
        
       }
       const Sialcoholismo= async e =>{
        e.preventDefault()
        await actualizarAlcohol(perfild2)
        
       }
  return (
    <>
{ auth.historiaclinica?.alcohol ==='Sin datos' ?



   <div className="md:flex  lg:gap-14 xs:gap-0 ">
    <div className="sm:w-1/6 xl:w-3/6 ml-10 md:mb-0 ">
    <h1 className="text-gray-600 font-nunito font-semibold text-lg py-5 xl:ml-20 xs:ml-0 ">¿Consumes alcohol?</h1>
    </div>
    <div className="py-3 md:w-6/6 ">
   <form onSubmit={handleSubmit}>
   <div className=" rounded-lg flex  flex-col items-center lg:flex-row gap-8 mt-5 lg:mt-0 ">
 <div >
   <input type="radio" name="alcohol" id="sialcoholismo" className="peer  hidden border border-gray-200" value='Si'
                onChange={ e => setPerfild({
                    ...perfilD,
                    [e.target.name] : e.target.value
                  })}  />
   <label
     htmlFor="sialcoholismo"
     className=" flex font-nunito  bg-indigo-300 text-white  justify-center cursor-pointer select-none rounded-lg px-4 py-2  text-center peer-checked:bg-red-500 peer-checked:font-bold peer-checked:text-white">
       Si✔️ </label>
 </div>

 <div className="">
   <input type="radio" name="alcohol" id="noalcoholismo" className="peer hidden border border-gray-200" value='No'
             onChange={ e => setPerfild({
                ...perfilD,
                [e.target.name] : e.target.value
              })}  />
   <label
     htmlFor="noalcoholismo"
     className=" flex font-nunito  bg-indigo-300 text-white    justify-center cursor-pointer select-none rounded-lg  px-3.5 py-2  text-center peer-checked:bg-green-500 peer-checked:font-bold peer-checked:text-white">
       No❌</label>
 </div>
 <button className="text-white w-1/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-3 inline-flex items-center focus:outline-none md:float-right">
   Guardar💾
  </button>
 </div>


   </form>
   </div>
 </div>

 
:

<div>

{auth.historiaclinica?.alcohol ==='Si'
?
<div>
<div className="text-right mr-5">
<button  className="p-1 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-[#6d7993]  hover:bg-indigo-500 "
    onClick={()=> SetOcultarSeccion(!ocultarseccion)}>
          <span className="text-xs  font-regular  lg:block">{ocultarseccion ? 
          <div className="flex gap-2">
           
           🔽                    </div>
          :
          <div className="flex gap-2">
           <h2 className="text-white font-nunito text-md" >Alcoholismo</h2>
           ▶️                    </div>
          } </span>                     
    </button>
</div>
<div className={`${ocultarseccion?'block':'hidden'} xs:block `}>
  <div className="md:inline-flex w-full space-y-2 md:space-y-0 p-2 text-gray-700 items-center">
    <div className="flex  ">
      <h1 className=" font-bold ml-7 mt-1">Alcoholismo: Si </h1>
    </div>
<div className="md:w-8/12 text-center ml-20 md:pl-6">
<form onSubmit={ Sialcoholismo}>
<input type="radio" name="alcohol" className="peer hidden border border-gray-200 " value='Sin datos' checked
              onChange={ e => setPerfild2({
               ...perfild2,
               [e.target.name] : e.target.value
             })} />
<button className="text-white text-sm w-2/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-3 inline-flex items-center focus:outline-none md:float-right mr-1 ">
    Actualizar🔄
  </button>
  </form>

</div>

</div>
<Link to="/paciente/formulario-audit" className='font-regular text-sm text-blue-500 hover:text-blue-600 xl:ml-9 mt-1'>Responder formulario AUDIT</Link>

</div>

</div>
    


:
<div>
<div className="text-right mr-5">
<button  className="p-1 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-[#6d7993]  hover:bg-indigo-500 "
    onClick={()=> SetOcultarSeccion(!ocultarseccion)}>
          <span className="text-xs  font-regular  lg:block">{ocultarseccion ? 
          <div className="flex gap-2">
           
           🔽                    </div>
          :
          <div className="flex gap-2">
           <h2 className="text-white font-nunito text-md" >Alcoholismo</h2>
           ▶️                    </div>
          } </span>                     
    </button>
</div>
<div className={`${ocultarseccion?'block':'hidden'} xs:block `}>
  <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-2 text-gray-700 items-center">
    <div className="flex">
      <h1 className=" font-bold ml-5 mt-1">Alcoholismo: No </h1>
    </div>
<div className="md:w-8/12 text-center ml-20   md:pl-6">
<form onSubmit={ Sialcoholismo}>
<input type="radio" name="alcohol" className="peer hidden border border-gray-200 " value='Sin datos' checked
              onChange={ e => setPerfild2({
               ...perfild2,
               [e.target.name] : e.target.value
             })} />
<button className="text-white text-sm w-2/2 mx-auto max-w-sm rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-3 inline-flex items-center focus:outline-none md:float-right mr-1">
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

export default FormularioAlcoholismo