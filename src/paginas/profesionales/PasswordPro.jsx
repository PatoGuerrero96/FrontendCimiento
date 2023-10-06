import { Link } from "react-router-dom"
import Alerta from '../../components/Alerta';
import clientAxios from '../../config/axios';
import { useState } from 'react';
const PasswordPro = () => {
    const [email, setEmail]= useState('')
    const [alerta, setAlerta]= useState({})
    const handleSubmit = async e=>{
        e.preventDefault();
        if(email === '' || email.length < 6 ){
          setAlerta({msg:'El Email es obligatorio',error:true})
          return
        }
    
        try {
          const { data } = await clientAxios.post('/profesional/olvide-password',{email})
          setAlerta({msg: data.msg})
        } catch (error) {
          setAlerta({msg: error.response.data.msg,
          error:true})
        }
      }
      const { msg } = alerta
  return (

        <>
    <div className="bg-blue-400 h-screen w-screen">
    <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-3/4 bg-white sm:mx-0" >
        <div className="flex flex-col w-full md:w-1/2 p-4">
                <div className="flex flex-col flex-1 justify-center mb-8">
                <h1 id="textologo" className="font-bold font-nunito text-center text-4xl ">Cimiento Clínico</h1>
    <h3 className="font-semibold font-nunito text-center text-lg mb-5">Portal Profesionales</h3>

                    <div className="w-full mt-4">

                        <form onSubmit={handleSubmit}  className="form-horizontal w-3/4 mx-auto"  action="#">
                        {msg && <Alerta
              alerta={alerta}
              />} 
                        <label className="font-semibold text-sm text-gray-600 pb-1 block" >Correo Electrónico</label>

                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input 
                id="email" 
                className=" font-normal font-nunito text-sm  pl-2 w-full outline-none border-none"
                 type="email"
                  placeholder="Ingresa tu correo electrónico" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
              
                  />
              </div>

                            <div className="flex flex-col mt-8">
                                <button type="submit" className=" font-nunito font-regular bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:-translate-y-1 transition-all duration-500">
                                    Enviar Instrucciones
                                </button>
                            </div>
                        </form>
                        <div className=" ml-20 flex  mt-4">
                <Link to="/ingresa-profesional" className="  text-gray-600 text-sm ml-2 hover:text-blue-700 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Volver al Login</Link>
              </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 rounded-r-lg " ><img className='' src="https://res.cloudinary.com/dde62spnz/image/upload/v1689081524/Imagenes%20sitio/pass-pro_rtzmlp.png" alt="" /></div>

        </div>
    </div>
</div>
    </>
  )
}

export default PasswordPro