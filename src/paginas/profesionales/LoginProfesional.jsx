import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Alerta from '../../components/Alerta'
import clientAxios from '../../config/axios';
import proAuth from '../../hooks/proAuth';
const LoginProfesional = () => {
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [alerta, setAlerta]= useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setAuthpro } = proAuth()
  const navigate = useNavigate()
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if([email,password].includes('')){
      setAlerta({
        msg:'todos los campos son obligatorios',
        error:true
      });
      setTimeout(()=> setAlerta({}),5000)
      return
    }
    setLoading(true)
    try {
      const {data} = await clientAxios.post(`/profesional/login`,{email,password})
      localStorage.setItem('tokenPro', data.tokenPro)
      const currentDate = new Date();
      localStorage.setItem("sessionStartDatePro", currentDate.toISOString()); 
      setAuthpro(data)
      setLoading(false)

      navigate('/profesional')
    } catch (error) {
     
      setAlerta({
        msg: error.response.data.msg,
        error:true
       
      })
      setTimeout(()=> setAlerta({}),5000)
      setLoading(false)
    }
   
  }

  const { msg}= alerta
  return (
    <>
    <div className="bg-coral-200 h-screen w-screen">
    <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-3/4 bg-white sm:mx-0" >
        <div className="flex flex-col w-full md:w-1/2 p-4">
                <div className="flex flex-col flex-1 justify-center mb-8">
                <h1  className="text-coral-200 font-bold font-nunito text-center text-4xl ">Cimiento Clínico</h1>
    <h3 className="font-semibold font-nunito text-center text-lg mb-5">Portal Profesionales</h3>
                    <div className="w-full mt-4">
                    {loading?    <div className=" container text-center">
            <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>
</div>:''}
                    { msg && 
            
            <Alerta
            alerta={alerta}/>}  
                        <form onSubmit={handleSubmit} className="form-horizontal w-3/4 mx-auto"  action="#">
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input 
                id="email" 
                className=" font-normal font-nunito  pl-2 w-full outline-none border-none"
                 type="email"
                  placeholder="Ingresa tu correo electrónico" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  />
              </div>
              <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                
                <input type={showPwd ? "text" : "password"} className="pl-2 w-full outline-none border-none"
                 id="password" 
                 placeholder="Ingresa tu contraseña"
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
                                <button type="submit" className=" font-nunito font-regular bg-coral-200 hover:bg-coral-300 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:-translate-y-1 transition-all duration-500">
                                      Iniciar Sesión
                                </button>
                            </div>
                        </form>
                        <div className=" ml-20 flex  mt-4">
                <Link to="/reset-pass-pro" className=" text-sm ml-2 hover:text-coral-300 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Olvidaste tu contraseña?</Link>
                <Link to="/" className=" text-sm ml-2 hover:text-coral-300 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Registra tu cuenta aquí</Link>

              </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 rounded-r-lg " ><img className='' src="https://res.cloudinary.com/dde62spnz/image/upload/v1689081455/Imagenes%20sitio/loginpro_bfnf64.png" alt="" />
              <Link className='text-coral-300 font-nunito font-semibold  text-2xl hover:text-coral-100  ' to="/registrar"> <h1 className='animate-bounce py-10 px-10'>¿Quieres trabajar con nosotros? <span className='font-bold '>Registrate aquí</span></h1>  </Link>
            </div>

        </div>
    </div>
</div>
    
    </>
  )
}

export default LoginProfesional