import { Link, useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth'
import { useState } from 'react';
import Alerta from '../components/Alerta'
import clientAxios from '../config/axios';

const Login = () => {
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [alerta, setAlerta]= useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setAuth } = useAuth()
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
      const {data} = await clientAxios.post(`/pacientes/login`,{email,password})
      localStorage.setItem('token', data.token)
      const currentDate = new Date();
      localStorage.setItem("sessionStartDate", currentDate.toISOString()); 
      setAuth(data)
      setLoading(false)
      navigate('/paciente')
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
    return(
        <>
 
<div className="h-screen flex">
          <div className=" bg-lila-100 hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center">
            <div 
                  className=" 
                  bg-black 
                  opacity-20 
                  inset-0 
                  z-0"
                  >

                  </div>
            <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
               <Link to="/"><img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689081338/Imagenes%20sitio/login_igyg1d.png" alt="" /></Link>
               
              <h1 className="text-white text-3xl font-nunito font-bold ">Ingresa a Cimiento Clínico y agenda tus consultas de telemedicina</h1>
              <Link className='text-lila-300 font-nunito font-semibold text-3xl hover:text-indigo-500  ' to="/registrar"> <h1 className='animate-bounce'>¿No tienes cuenta? <span className='font-bold '>Registrate aquí</span></h1>  </Link>

            </div>
          </div>
          

          <div className="flex w-full  lg:w-1/2 justify-center items-center space-y-8">
           

            <div className="w-full px-8 md:px-48 lg:px-36">
            {loading?    <div className=" container text-center">
            <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>
</div>:''}
            { msg && 
            
            <Alerta
            alerta={alerta}/>}
            <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-2xl p-5">
              <h1 className="text-lila-200 font-extrabold font-nunito text-2xl mb-1 text-center">Cimiento Clínico</h1>
              <p className="text-md font-nunito text-gray-400 font-normal mb-8 text-center">Inicio de sesión</p>
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
                  onChange={e => setEmail(e.target.value)}/>
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


              
              <button  type="submit" className=" bg-lila-200 block w-full font-nunito py-2 rounded-2xl hover:bg-lila-300 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Login</button>
              <div className="flex justify-between mt-4">
                <Link to="/olvide-password" className="text-sm ml-2 hover:text-lila-300 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Olvidaste tu contraseña?</Link>

                <Link to="/registrar" className="text-sm ml-2 hover:text-lila-300 cursor-pointer hover:-translate-y-1 duration-500 transition-all">No tienes una cuenta?</Link>
              </div>
              
            </form>
            </div>
            
          </div>
      </div>
        
        </>
    );
};

export default Login;