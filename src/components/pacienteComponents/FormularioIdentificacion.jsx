import React from 'react'
import { useState, useEffect } from 'react'
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
const FormularioIdentificacion = () => {

    const {auth, actualizarIdentificacion} =   useHistoriaCli()
    const [ perfil, setPerfil ] = useState({});
const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha)
  nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
  return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

  useEffect(() => {
    setPerfil(auth)
}, [])


const handleSubmit = async e =>{
    e.preventDefault()
    await actualizarIdentificacion(perfil)
    return
    
   }

  return (
    <>
         <div className="mx-auto container max-w-5xl md:w-3/4 shadow-md bg-white rounded-md  ">
            
            <form onSubmit={handleSubmit}>

       <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto ">RUT:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5 md:inline-flex pl-2">
              <div className="w-1/2 inline-flex border-b text-gray-600">
              {auth.rut} 
              </div>
            </div>
          </div>
          <hr />

          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Fecha de nacimiento:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5 md:inline-flex pl-2">
              <div className="w-1/2 inline-flex border-b text-gray-600">
              {formatearFecha(auth.fechaNacimiento)}
              </div>
            </div>
          </div>
          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Localidad:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5  pl-2">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">

                <input 
                name="localidad"
                type="text"
                className=" font-normal font-nunito w-full outline-none border-none text-gray-600"
                  placeholder="Ingresa tu localidad"
                  value={perfil.localidad || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })}
                  /> 
       
             
              </div>
            </div>
          </div>
          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Ocupación:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5  pl-2">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <input 
                name="ocupacion"
                type="text"
                className=" font-normal w-full outline-none border-none text-gray-600"
                  placeholder="Ingresa tu ocupación" 
                  value={perfil.ocupacion || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })}
                  />
                
              </div>
            </div>
          </div>
          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Previsión de salud:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5  pl-2">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">

                    <input 
                    name="previsionsalud"
                    type="text" 
                    className=" font-normal  w-full outline-none border-none text-gray-600"
                      placeholder="Ingresa tu previsión de salud" 
                      value={perfil.previsionsalud || ''}
                      onChange={ e => setPerfil({
                        ...perfil,
                        [e.target.name] : e.target.value
                      })}/>



               
              </div>
            </div>
          </div>
          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Escolaridad:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5  pl-2">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <input  
                name="escolaridad"
                type="text"
                className=" font-normal  w-full outline-none border-none text-gray-600"
                  placeholder="Ingresa tu escolaridad"
                  value={perfil.escolaridad || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })}
                  />
              </div>
            </div>
            
          </div>
          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-4 text-gray-700 items-center">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Lugar donde te atiendes:</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5  pl-2">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <input  
                name="lugardeatencion"
                type="text"
                className=" font-normal  w-full outline-none border-none text-gray-600"
                  placeholder="(Ej: CESFAM Talcahuano)"
                  value={perfil.lugardeatencion || ''}
                  onChange={ e => setPerfil({
                    ...perfil,
                    [e.target.name] : e.target.value
                  })}
                  />
              </div>
            </div>
            
          </div>
          <hr />
          <div className='bg-white flex justify-center mt-2'>
          
            <button className='px-10 py-3 rounded-md text-center mb-2 text-white  bg-lila-200 hover:bg-lila-100  '>Guardar 💾</button>

  </div>

  </form>
        </div>
    </>
  )
}

export default FormularioIdentificacion