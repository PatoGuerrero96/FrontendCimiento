import {  useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Alerta from '../components/Alerta';
import clientAxios from '../config/axios';
const NuevaPassword = () => {

  const [password, setPassword]= useState('')
  const [alerta, setAlerta] = useState({})
  const [tokenValido, setTokenValido]=useState(false)
  const [passwordModificado, setPasswordModificado] =  useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const params = useParams()
  const { token } = params
 
  useEffect(()=>{
    const comprobarToken = async ()=>{
      try {
        await clientAxios(`/pacientes/olvide-password/${token}`)
        setAlerta({
          msg:'Ya puedes ingresar tu nueva contraseña'
        })
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: 'Hubo un error con el enlace',
          error: true
        })
      }

    }
    comprobarToken()
  },[])
  const handleSubmit = async (e) =>{
  e.preventDefault()
  if(password.length < 6 ){
    setAlerta({
      msg:'El password debe tener almenos 6 caracteres',
      error:true
    })
    return
  }
  try {
    const url =`/pacientes/olvide-password/${token}`
    const { data } = await clientAxios.post(url,{password})
    setAlerta({
      msg:data.msg
    })
    setPasswordModificado(true)
  } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error:true
      })

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
              {tokenValido && 
            <form onSubmit={handleSubmit}
            className="bg-white rounded-md shadow-2xl p-5">
              <h1 id="textologo"className="font-extrabold font-nunito text-2xl mb-1 text-center">Cimiento Clínico</h1>
              <p className="text-md font-nunito text-gray-400 font-normal mb-8 text-center">Cambiar tu contraseña</p>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input 
                className=" 
                font-normal font-nunito  pl-2 w-full outline-none border-none" 
                type={showPwd ? "text" : "password"}
                
                placeholder="Nueva contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                 />
                  <div className="position-absolute position-right pointer pwd-icon" onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? <svg  className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1.2rem"}>
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg> : <svg className="h-5 w-5 text-gray-400"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1.2rem"}>
              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
            </svg>}
          </div>
              </div>


              <button id="primario" type="submit" className="block w-full font-nunito py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Cambiar contraseña
              
              </button>
              <div className="flex justify-between mt-4">
              
                

              </div>
              
              {passwordModificado ? <Navigate to="/paciente-pass-ingreso"/> :' '
                }
              
            </form>
            }
              
            </div>
          
          </div>

          <div id="primario" className=" hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center">
            <div className="bg-black  opacity-20 inset-0 z-0">

              </div>
              <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
              <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082141/Imagenes%20sitio/recuperar_afzzuu.png" alt="" />
              <h1 className="text-white text-3xl font-nunito font-bold">Recupera tu contraseña e ingresa Cimiento Clínico y agenda tus consultas de telemedicina</h1>
              </div>
           
            
          </div>
      </div>        
        </>
    );
};

export default NuevaPassword;

