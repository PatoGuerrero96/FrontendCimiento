import React from 'react'
import { useState, useEffect } from 'react'
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
const FormularioGinecoobstetrico = () => {

    const {auth, actualizarGinecoobstetricos} =   useHistoriaCli()
    const [ perfil, setPerfil ] = useState({});
    const [ocultarseccion, SetOcultarSeccion] = useState(false)
const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha)
  nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
  return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

  useEffect(() => {
    setPerfil(auth)
  
}, [])


const handleSubmit = async e =>{
    e.preventDefault()
    await actualizarGinecoobstetricos(perfil)
    return
    
   }

  return (
    <>
<div className="text-right mr-5">
        <button  className="p-1 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-[#6d7993]  hover:bg-indigo-500 "
            onClick={()=> SetOcultarSeccion(!ocultarseccion)}>
                  <span className="text-xs  font-regular  lg:block">{ocultarseccion ? 
                  <div className="flex gap-2">
                     🔽    
                  </div>
                  :
                  <div className="flex gap-2">
                   <h2 className="text-white  font-nunito text-md" >Antecedentes ginecoobstétricos</h2>
                   ▶️                     </div>
                  } </span>                     
            </button>   
</div>

<form onSubmit={handleSubmit} className={`${ocultarseccion ? 'block' : 'hidden'} xs:block flex flex-col`}>
<h1 className='px-8 text-gray-700 font-bold text-md'>Antecedentes ginecoobstétricos </h1>
  <div className="flex flex-row">
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700 text-md">Gestaciones</label>
      <div className="mt-1">
        <input
          name='gestaciones'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Gestaciones"
          value={perfil.gestaciones || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700 text-md">Perdidas</label>
      <div className="mt-1">
        <input
          name='perdidas'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Perdidas"
          value={perfil.perdidas || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
  </div>
  <div className="flex flex-row">
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700 text-md">Partos</label>
      <div className="mt-1">
        <input
          name='partos'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Partos"
          value={perfil.partos || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700 text-md">Cesáreas</label>
      <div className="mt-1">
        <input
          name='cesareas'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Cesáreas"
          value={perfil.cesareas || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
  </div>
  <div className="flex flex-row">
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700  text-md">Menarquia</label>
      <div className="mt-1">
        <input
          name='menarquia'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Menarquia"
          value={perfil.menarquia || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700 text-md">Última regla</label>
      <div className="mt-1">
        <input
          name='ultimaregla'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Última regla"
          value={perfil.ultimaregla || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
  </div>
  <div className="flex flex-row">
    <div className="flex flex-col w-1/2 mx-6">
      <label className="text-gray-700 text-md">Último PAP</label>
      <div className="mt-1">
        <input
          name='ultimopap'
          className="focus:outline-none focus:text-gray-900 mb-2 border border-gray-300 rounded-md placeholder-slate-400 px-4 py-2 resize-y w-full"
          placeholder="Último PAP"
          value={perfil.ultimopap || ''}
          onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
    <div className="flex flex-col w-1/2 mx-6">

    </div>
    
  </div>
  <div className="flex flex-row justify-center mt-1 mb-2">
    <button className="text-white  mx-auto max-w-sm rounded-md text-center bg-indigo-400 hover:bg-indigo-600 py-2 px-4 inline-flex items-center focus:outline-none">
      Actualizar🔄
    </button>
  </div>
</form>




    </>
  )
}

export default FormularioGinecoobstetrico