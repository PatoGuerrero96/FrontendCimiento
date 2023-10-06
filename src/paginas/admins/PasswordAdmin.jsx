import { useState } from 'react';
import Alerta from '../../components/Alerta';
import clientAxios from '../../config/axios';
import { Link } from 'react-router-dom';
const PasswordAdmin = () => {
  const [email, setEmail]= useState('')
  const [alerta, setAlerta]= useState({})
  const handleSubmit = async e=>{
    e.preventDefault();
    if(email === '' || email.length < 6 ){
      setAlerta({msg:'El Email es obligatorio',error:true})
      setTimeout(()=> setAlerta({}),5000)
      return
    }

    try {
      const { data } = await clientAxios.post('/admin/olvide-password',{email})
      setAlerta({msg: data.msg})
    } catch (error) {
      setAlerta({msg: error.response.data.msg,
      error:true})
      setTimeout(()=> setAlerta({}),5000)
    }
  }
  const { msg } = alerta
  return (
    <>
 
 <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
  <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
    <h1 id="textologo" className="font-bold font-nunito text-center text-4xl ">Recuperar contraseña</h1>
    <h3 className="font-semibold font-nunito text-center text-mb mb-5">Portal administradores</h3>
    {msg && <Alerta
              alerta={alerta}
              />} 
    <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
      <form  onSubmit={handleSubmit} className="px-5 py-7">
        <label className="font-semibold text-sm text-gray-600 pb-1 block" >Correo Electrónico</label>
        <input 
        id="email"
        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" 
        type="email"
        placeholder="Ingresa tu correo electrónico" 
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
            <button id="primario" type="submit" className="block w-full font-nunito py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold ">Enviar instrucciones</button>

      </form>


      <div className="py-2">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-center sm:text-left whitespace-nowrap">

            <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <Link to="/ingresa-admin" className="inline-block ml-1">Volver al login</Link>

            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="py-5">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-center sm:text-left whitespace-nowrap">
            <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <Link to="/" className="inline-block ml-1">Volver al inicio</Link>
            </button>
          </div>
        </div>
      </div>
  </div>
</div>
    </>
  )
}

export default PasswordAdmin