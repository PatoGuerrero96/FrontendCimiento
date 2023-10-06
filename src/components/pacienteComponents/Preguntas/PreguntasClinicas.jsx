import { useState, useEffect } from 'react'
import usePreguntasCli from '../../../hooks/paciente/usePreguntasCli';
const PreguntasClinicas = () => {
  const [ocultarseccion, SetOcultarSeccion] = useState(false)
  const [ perfil, setPerfil ] = useState({});
  const [ perfil2, setPerfil2 ] = useState({});
  const {auth,actualizarEstadogeneral} =  usePreguntasCli()

  useEffect(() => {
    setPerfil(auth)
  
  }, [])
  useEffect(() => {
    setPerfil2(auth)
  
  }, [])

const handleSubmit = async e =>{
    e.preventDefault()
    await  actualizarEstadogeneral (perfil)
    SetOcultarSeccion(true)
    
   }
   const estadovacio= async e =>{
    e.preventDefault()
    await  actualizarEstadogeneral(perfil2)
    
   }

  return (
    <>
      { auth.historiaclinica?.estadogeneral==='Sin datos'
    ? 
    <div className="  ">
    <div className="title  text-sm font-regular font-nunito"> <span className='text-lila-300'>¿Salud general?</span> </div>
    <div className="w-full text-sm ">

      <form onSubmit={handleSubmit}>
      <div className="inline-block">
          <div className="font-nunito text-white  bg-red-800 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c0"
className=""
>0</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c0" className="" value='0' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>      
</div>          
</div>
    <div className="inline-block">
          <div className="font-nunito text-white  bg-red-700 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c1"
className=""
>1 </label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c1" className="" value='1' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>      
</div>          
</div>
<div className="inline-block">
          <div className="font-nunito text-white  bg-red-600 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c2"
className=""
>2</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c2" className="" value='2' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />

</div>
            
</div>          
</div>

<div className="inline-block">
          <div className="font-nunito text-white  bg-red-500 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c3"
className=""
>3</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c3" className="" value='3' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />

</div>
            
</div>          
</div>

<div className="inline-block">
          <div className="font-nunito text-white  bg-orange-500 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c4"
className=""
>4</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c4" className="" value='4' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>

<div className="inline-block">
          <div className="font-nunito text-white  bg-orange-400 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c5"
className=""
>5</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c5" className="" value='5' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>

<div className="inline-block">
          <div className="font-nunito text-white  bg-yellow-400 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c6"
className=""
>6</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c6" className="" value='6' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>
<div className="inline-block">
          <div className="font-nunito text-white  bg-yellow-300 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c7"
className=""
>7</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c7" className="" value='7' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>
<div className="inline-block">
          <div className="font-nunito text-white  bg-green-400 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c8"
className=""
>8</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c8" className="" value='8' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>
<div className="inline-block">
          <div className="font-nunito text-white  bg-green-500 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c9"
className=""
>9</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c9" className="" value='9' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>
<div className="inline-block">
          <div className="font-nunito text-white  bg-green-600 cursor-pointer select-none  px-1 text-center peer-checked:bg-indigo-500 peer-checked:animate-pulse  peer-checked:font-bold peer-checked:text-white">
          <div className=' '>
          <label
htmlFor="c10"
className=""
>10</label>
</div>
<div>
<input type="radio" name="estadogeneral" id="c10" className="" value='10' onChange={ e => setPerfil({
               ...perfil,
               [e.target.name] : e.target.value
             })} />
</div>          
</div>          
</div>
<div className='p-1'> 
   <button className="   bg-lila-200 px-2 py-2 text-xs text-white rounded-md text-center  font-nunito  hover:bg-indigo-400 ">Guardar</button>
</div>
  
  </form>


    </div>
    </div>
    : 
    <div>
         <div className='text-sm'>
      <div className='bg-white  border-gray-200 rounded-lg  text-center'>
      <div className='px-1 mt-1  font-nunito'>    { auth.historiaclinica?.estadogeneral==='0' ? 
      
      <div className=''>
      <h1 className='font-bold  '> Salud general: </h1>
      <span className=' font-bold text-coral-300'> Crítica</span>
      <div className='flex justify-center'>  <span className='text-2xl'> 😡</span></div>
      </div>
      :''} </div>
      <div className='px-1 mt-1  font-nunito'>    { auth.historiaclinica?.estadogeneral==='1' ? 
      
      <div className=''>
      <h1 className='font-bold  '> Salud general: </h1>
      <span className=' font-bold text-coral-300'> Crítica</span>
      <div className='flex justify-center'>  <span className='text-2xl'> 😡</span></div>
      </div>
      :''} </div>
       <div className='px-1    font-nunito'>    { auth.historiaclinica?.estadogeneral==='2' ? 
      
      <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-coral-200'> Muy negativa</span>
      <div className='flex justify-center'>  <span className='text-2xl'> 🤢</span></div>
      </div>
      :''} </div> 
       <div className='px-1 mt-1   font-nunito'>    { auth.historiaclinica?.estadogeneral==='3' ? 
      
      <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-coral-100'> Negativa</span>
      <div className='flex justify-center'>  <span className='text-2xl'>🤒</span></div>

      </div>
      :''} </div> 

       <div className='px-1 mt-1   font-nunito'>    { auth.historiaclinica?.estadogeneral==='4' ? 
             <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-orange-500'> Mala</span>
      <div className='flex justify-center'>  <span className='text-2xl'> 🤧</span></div>

      </div>
      :''} </div> 
       <div className='px-1 mt-1   font-nunito'>    { auth.historiaclinica?.estadogeneral==='5' ? 
      
      <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-orange-400'> Baja</span>
      <div className='flex justify-center'>  <span className='text-2xl'>😐</span></div>
      </div>
      :''} </div> 
       <div className='px-1 mt-1  font-nunito'>    { auth.historiaclinica?.estadogeneral==='6' ?    
      <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-yellow-400'>Regular</span>
      <div className='flex justify-center'>  <span className='text-2xl'>🤨</span></div>
      </div>
      :''} </div>
       <div className='px-1 mt-1   font-nunito'>    { auth.historiaclinica?.estadogeneral==='7' ? 
            <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-yellow-300'>Buena</span>
      <div className='flex justify-center'>  <span className='text-2xl'>🙂</span></div>
      </div>
      :''} </div>   
       <div className='px-1 mt-1  font-nunito'>    { auth.historiaclinica?.estadogeneral==='8' ? 
           <div className=''>
      <h1 className='font-bold '> Salud general: </h1>
      <span className=' font-bold text-green-400'>Positiva</span>
      <div className='flex justify-center'>  <span className='text-2xl'> 😉</span></div>
      </div>
      :''} </div>   
       <div className='px-1 mt-1   font-nunito'>    { auth.historiaclinica?.estadogeneral==='9' ? 
                 <div className=''>
                 <h1 className='font-bold '> Salud general: </h1>
                 <span className=' font-bold text-green-600'>Muy positiva</span>
                 <div className='flex justify-center'>  <span className='text-2xl'>😀</span></div>
                 </div>
      :''} </div>   
       <div className='px-1 mt-1 font-nunito'>    { auth.historiaclinica?.estadogeneral==='10' ? 
       <div className=''>
       <h1 className='font-bold '> Salud general: </h1>
       <span className=' font-bold text-green-700'>Extremadamente positiva</span>
       <div className='flex justify-center'>  <span className='text-2xl'>😄</span></div>
       </div>
      :''} </div>        

    <form className='' onSubmit={estadovacio}  >
<input type="radio" name="estadogeneral" className="peer hidden " value='Sin datos' checked
              onChange={ e => setPerfil2({
               ...perfil2,
               [e.target.name] : e.target.value
             })} />
     
     <div className='flex justify-end  '>
          <button   className=" ">
          <svg id="Capa_1" className='h-7 ' fill='#9ba4ea' data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path className="cls-1" d="m23.9,139.47c-1.23,1.23-1.91,2.9-1.91,4.65l-5.24,30.16c-.1.31-.19.64-.26,1l-.2,1.19c-.37,2.12.32,4.28,1.84,5.8,1.52,1.52,3.68,2.2,5.8,1.84l33.26-5.79c.42-.07.82-.17,1.07-.27.18-.06.36-.13.53-.22.2-.09.38-.19.53-.29.24-.13.47-.28.72-.45.29-.18.61-.43.83-.64l.75-.75,100.61-100.61c.59-.59,1.04-1.27,1.36-1.99.72-.33,1.39-.76,1.95-1.33l3.29-3.3c.86-.82,8.4-8.3,8.56-18.97.09-6.63-2.64-12.76-8.09-18.21-5.56-5.56-11.77-8.37-18.45-8.33-10.35.06-17.45,7.01-18.19,7.77l-4.08,4.08c-.59.59-1.03,1.26-1.35,1.97-.71.32-1.39.76-1.97,1.35L23.9,139.47Zm9.09,34.9l-6.49-6.49c-.13-.13-.28-.24-.43-.35l3.22-18.5,22.13,22.13-18.43,3.21ZM138.36,36.36c.05-.06,5.37-5.34,12.53-5.38,4.46-.03,8.74,1.98,12.73,5.98,3.87,3.87,5.81,8.05,5.74,12.44,0,.58-.06,1.16-.13,1.71-.15,1.13-.4,2.2-.74,3.21-.03.07-.05.14-.08.21-.62,1.77-1.47,3.34-2.3,4.61-.26.39-.51.75-.76,1.09-.17.23-.34.45-.5.66-.21.26-.4.5-.58.71-.44.52-.79.88-.94,1.03-.05.05-.08.08-.08.08l-2.09,2.1-12.41-12.41c-.15-.23-.32-.44-.52-.63l-12.63-12.63,2.76-2.76Zm-8.76,8.76l25.62,25.62-96.43,96.43-25.62-25.62,96.43-96.43Z"/>
</svg>
          </button>
          </div>

  </form>
    </div>
    </div>
    </div>
    }
  

    </>
  )
}

export default PreguntasClinicas