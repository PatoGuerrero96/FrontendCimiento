import { useState, useEffect } from 'react'
import useAuth from "../../hooks/useAuth"


const FormularioMiHorario = () => {
  const [perfil, setPerfil] = useState({});
  const { auth, actualizarHorario } = useAuth()

  useEffect(() => {
    setPerfil(auth)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    await actualizarHorario(perfil)
  }



  return (
    <>
    <h1 className='text-2xl text-gray-600 text-center mt-2'>REGISTRA TUS HORARIOS DE PACIENTE</h1>
    <form onSubmit={handleSubmit}>
      <div className="px-3 md:lg:xl:px-40   border-b py-20 bg-opacity-10" >
        <div >
        <h1 className='bg-blue-200 text-2xl text-gray-600 font-regular cursor-pointer text-center'>¿Que días estas disponible durante la semana?</h1>
        <div className=" bg-blue-200 grid grid-cols-3 gap-1">
  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-12 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Lunes?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="lunes"
        id="lunes"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.lunes || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="lunes"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.lunes ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>

  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-12 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Martes?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="martes"
        id="martes"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.martes || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="martes"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.martes ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>
  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-12 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Miercoles?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="miercoles"
        id="miercoles"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.miercoles || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="miercoles"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.miercoles ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>
  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-12 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Jueves?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="jueves"
        id="jueves"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.jueves || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="jueves"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.jueves ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>
  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-12 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Viernes?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="viernes"
        id="viernes"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.viernes || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="viernes"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.viernes ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>
  <div className='p-4  flex flex-col items-center text-center group  cursor-pointer'>
  <div className=" bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-500 cursor-pointer">
  <div className=" px-4 bg-white rounded-t-lg text-gray-500 font-semibold cursor-pointer">
  <h1 className='text-lg'>Tu Horario para la semana</h1>
  </div>
  <div className="grid grid-cols-2 gap-2 bg-white rounded-b-lg">
    <div className="flex items-center justify-center py-2 px-4 gap-1 text-gray-500 font-semibold cursor-pointer">
      <h1 className='text-sm'>Inicio: </h1>
      <input type="time" id="horasemanainicio" name="horasemanainicio"
      className='border rounded-md  border-blue-200' 
         value={perfil.horasemanainicio || ''}
         onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })}
         />
    </div>
    <div className="flex items-center justify-center py-2 px-2 gap-1 text-gray-500 font-semibold cursor-pointer">
    <h1 className='text-sm'>Fin: </h1>
    <input type="time" id="horasemanafin" name="horasemanafin" 
    className='border rounded-md  border-blue-200 '
         value={perfil.horasemanafin|| ''}
         onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })}
         />
    </div>
  </div>

</div>
</div>
</div>
    
<div>
  <h1 className='bg-red-200 text-2xl text-gray-600 font-regular cursor-pointer text-center'>¿Que días estas disponible los fines de semana?</h1>
<div className=" bg-red-200 grid grid-cols-3 gap-1">
  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-12 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Sábado?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="sabado"
        id="sabado"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.sabado || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="sabado"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.sabado ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>

  <div className="p-4 flex flex-col items-center text-center group  cursor-pointer">
    <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
      <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
        <span>Domingo?</span>
      </div>
      <div className="bg-yellow-400 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="domingo"
        id="domingo"
        className="form-switch absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={perfil.domingo || false}
        onChange={ e => setPerfil({
          ...perfil,
          [e.target.name] : e.target.checked
        })} />
      <label
        htmlFor="domingo"
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
        ${perfil.domingo ? 'bg-green-500' : 'bg-red-500 '} transition-all duration-200`}
      ></label>
    </div>
      </div>
    </div>
  </div>
  <div className='p-4  flex flex-col items-center text-center group  cursor-pointer'>
  <div className=" bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-500 cursor-pointer">
  <div className=" px-4 bg-white rounded-t-lg text-gray-500 font-semibold cursor-pointer">
  <h1 className='text-lg'>Tu Horario para el fin de semana </h1>
  </div>
  <div className="grid grid-cols-2 gap-2 bg-white rounded-b-lg">
    <div className="flex items-center justify-center py-2 px-4 gap-1 text-gray-500 font-semibold cursor-pointer">
      <h1 className='text-sm'>Inicio: </h1>
      <input type="time" id="horafindesemanainicio" name="horafindesemanainicio" 
         className='border rounded-md  border-red-200'
         value={perfil.horafindesemanainicio || ''}
         onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })}
         />
    </div>
    <div className="flex items-center justify-center py-2 px-2 gap-1 text-gray-500 font-semibold cursor-pointer">
    <h1 className='text-sm'>Fin: {''} </h1>
    <input type="time" id="horafindesemanafin" name="horafindesemanafin" 
    className='border rounded-md  border-red-200'
         value={perfil.horafindesemanafin || ''}
         onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })}
         />
    </div>
  </div>

</div>
</div>

</div>
</div>
  </div>
  <div className="w-full   bg-indigo-600 shadow-xl shadow-indigo-200 py-10 px-20 flex justify-between items-center">
  <p className=" text-white"> <span className="text-4xl font-medium">Tus horarios son importantes...</span>  <span className="text-lg">Con esto los profesionales veran tu disponibilidad! </span></p>
  <input type="submit" value="GUARDAR TUS HORARIOS"className="px-5 py-3  font-medium text-slate-700 shadow-xl  hover:bg-white duration-150  bg-yellow-400"/>
  </div>

    </div>
    </form>
    </>
  )
}

export default FormularioMiHorario;