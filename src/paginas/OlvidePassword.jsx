import { useState } from 'react';
import Alerta from '../components/Alerta';
import clientAxios from '../config/axios';
import { Link } from 'react-router-dom';
const OlvidePassword = () => {
  const [email, setEmail]= useState('')
  const [alerta, setAlerta]= useState({})
  const handleSubmit = async e=>{
    e.preventDefault();
    if(email === '' || email.length < 6 ){
      setAlerta({msg:'El Email es obligatorio',error:true})
      return
    }

    try {
      const { data } = await clientAxios.post('/pacientes/olvide-password',{email})
      setAlerta({msg: data.msg})
    } catch (error) {
      setAlerta({msg: error.response.data.msg,
      error:true})
    }
  }
  const { msg } = alerta
    return(
        <>
      <div className="h-screen flex">
        
          <div  className="flex w-full  lg:w-1/2 justify-center items-center space-y-8">
          <div className="w-full px-8 md:px-48 lg:px-36">
          {msg && <Alerta
              alerta={alerta}
              />}
            <form className="bg-white rounded-md shadow-2xl p-5"
            onSubmit={handleSubmit}
            >
              <h1 id="textologo"className="font-extrabold font-nunito text-2xl mb-1 text-center">Cimiento Clínico</h1>
              <p className="text-md font-nunito text-gray-400 font-normal mb-8 text-center">Recupera tu contraseña ingresando tu correo electrónico, se enviaran las instrucciones para cambiar tu contraseña</p>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input

                 className=" font-normal font-nunito  pl-2 w-full outline-none border-none" 
                 type="email" 
                 placeholder="Tu correo electrónico"
                 value={email} 
                 onChange={e => setEmail(e.target.value)}
                 />
              </div>
              <button id="primario" type="submit" className="block w-full font-nunito py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Enviar instrucciones</button>
              <div className="flex justify-between mt-4">
                
                <Link  to="/" className="text-sm ml-2 hover:text-teal-700 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Volver al inicio</Link>

              </div>
              
            </form>
            </div>
          
          </div>

          <div id="primario" className=" hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center">
            <div className="bg-black  opacity-20 inset-0 z-0">

              </div>
              <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
              <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082241/Imagenes%20sitio/email_qhxdzt.png" alt="" />
              <h1 className="text-white text-3xl font-nunito font-bold">Ingresa tu correo para recuperar tu contraseña e ingresar a Cimiento Clínico</h1>
              </div>
           
            
          </div>
      </div>        
        </>
    );
};

export default OlvidePassword;

