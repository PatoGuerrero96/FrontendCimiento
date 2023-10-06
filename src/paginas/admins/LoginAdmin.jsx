import { Link, useNavigate} from 'react-router-dom';
import AdminAuth from '../../hooks/adminAuth';
import { useState } from 'react';
import Alerta from '../../components/Alerta'
import clientAxios from '../../config/axios';

const LoginAdmin = () => {
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [alerta, setAlerta]= useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setAuthadmin } = AdminAuth()
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
      const {data} = await clientAxios.post(`/admin/login`,{email,password})

      localStorage.setItem('tokenAdm', data.tokenAdm)
      setAuthadmin(data)
      const currentDate = new Date();
      localStorage.setItem("sessionStartDateAdmin", currentDate.toISOString()); 
      setLoading(false)
      navigate('/admin')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error:true
      })
      setLoading(false)
      setTimeout(()=> setAlerta({}),5000)
    }
  }

  const { msg}= alerta
    return(
        <>
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
  <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
    <h1 id="textologo" className="font-bold font-nunito text-center text-4xl ">Cimiento Clínico</h1>
    <h3 className="font-semibold font-nunito text-center text-lg mb-5">Portal administradores</h3>
    {loading?    <div className=" container text-center">
            <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>
</div>:''}
    { msg && 
            
            <Alerta
            alerta={alerta}/>}  
    <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
      <form  onSubmit={handleSubmit} className="px-5 py-7">
        <label className="font-semibold text-sm text-gray-600 pb-1 block" >Correo Electrónico</label>
        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                <input 
                id="email" 
                className=" font-normal font-nunito  pl-2 w-full outline-none border-none"
                 type="email"
                  placeholder="Ingresa tu correo electrónico" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}/>
              </div>
        <label className="font-semibold text-sm text-gray-600 pb-1 block">Contraseña</label>

        <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                
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
        
            <button id="primario" type="submit" className="block w-full font-nunito py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Login</button>

      </form>




      <div className="py-2">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-center sm:text-left whitespace-nowrap">

            <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <Link to="/reset-pass-admin" className="inline-block ml-1">Olvide la contraseña</Link>

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
    );
};

export default LoginAdmin;