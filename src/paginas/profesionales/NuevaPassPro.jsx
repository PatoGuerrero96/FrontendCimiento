import {  useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Alerta from '../../components/Alerta';
import clientAxios from '../../config/axios';
const NuevaPassPro = () => {
  
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
        await clientAxios(`/profesional/olvide-password/${token}`)
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
    const url =`/profesional/olvide-password/${token}`
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
  return (
    <>  
    <div className="bg-blue-400 h-screen w-screen">
    <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-3/4 bg-white sm:mx-0" >
        <div className="flex flex-col w-full md:w-1/2 p-4">
                <div className="flex flex-col flex-1 justify-center mb-8">
                <h1 id="textologo" className="font-bold font-nunito text-center text-4xl ">Cimiento Clínico</h1>
    <h3 className="font-semibold font-nunito text-center text-lg mb-5">Portal Profesionales</h3>

                    <div className="form-horizontal w-3/4 mx-auto">
                    {msg && <Alerta
              alerta={alerta}
              />} 
                    {tokenValido && 
                        <form onSubmit={handleSubmit} className="w-full mt-4"  action="#">
            
              
                        <label className="font-semibold text-sm text-gray-600 pb-1 block" >Nueva Contraseña</label>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input 
                id="email" 
                className=" font-normal font-nunito text-sm  pl-2 w-full outline-none border-none"
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

                            <div className="flex flex-col mt-8">
                                <button type="submit" className=" font-nunito font-regular bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:-translate-y-1 transition-all duration-500">
                                    Cambiar Contraseña
                                </button>
                            </div>
                        </form>
                      }
           {passwordModificado ? <Navigate to="/profesional-pass-ingreso"/> :' '
                }
                    </div>
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 rounded-r-lg " ><img className='' src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082200/Imagenes%20sitio/recuperar-pass-pro_um46g7.png" alt="" /></div>

        </div>
    </div>
</div>
    
    </>
  )
}

export default NuevaPassPro