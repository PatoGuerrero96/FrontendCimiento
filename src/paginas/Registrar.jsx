import { Link } from 'react-router-dom';
import { useState } from 'react';
import Alerta from '../components/Alerta';
import clientAxios from "../config/axios";
const Registrar = () => {
     const [email, setEmail] = useState('')
     const [rut, setRut] = useState('');
     const [rutValid, setRutValid] = useState(true);
     const [nombres, setNombres] = useState('')
     const [apellidos, setApellidos] = useState('')
     const [sexo, setSexo] = useState('')
     const [fechaNacimiento, setFecha] = useState('')
     const [password, setPassword] = useState('')
     const [repetirPassword, setRepetirPassword] = useState('')
     const [alerta, setAlerta ]= useState({})
     const [showPwd, setShowPwd] = useState(false)
     const [showRPwd, setShowRPwd] = useState(false)
     const handleSubmit = async e =>{
      
      e.preventDefault();
      
     
  if ([email, rut, nombres, apellidos, password, repetirPassword, fechaNacimiento].includes('')) {
    setAlerta({ msg: 'Hay campos vacíos', error: true });
    return;
  }

  if (password !== repetirPassword) {
    setAlerta({ msg: 'Las contraseñas deben ser iguales', error: true });
    return;
  }

  if (rut.length < 9 || rut.length > 10 || !/^(\d{7,8}-[k|K|\d])$/.test(rut)) {
    setAlerta({ msg: 'RUT no válido. Ejemplo: 11111111-1', error: true });
    setRutValid(false);
    return;
  }

  if (password.length < 6) {
    setAlerta({ msg: 'La contraseña debe tener al menos 6 caracteres', error: true });
    return;
  }

  if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
    setAlerta({ msg: 'La contraseña debe contener al menos una letra mayúscula y un número', error: true });
    return;
  }

      


      setAlerta({})

      //Peticion al backend para crear usuario
      try{
         await clientAxios.post('/pacientes',{email,rut,nombres,apellidos,sexo,password,fechaNacimiento})
         setAlerta({
          msg: 'Registrado con éxito. Revisa tu Correo electrónico',
          error: false
         })

      }
      catch(error){
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
          <div  className="bg-lila-100 hidden lg:flex w-full lg:w-1/2 login_img_section
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
               <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689081665/Imagenes%20sitio/registrar_ldq2qd.png" alt="" />
              <h1 className="text-white text-3xl font-nunito font-bold">Registrate en Cimiento Clínico y agenda tus consultas de telemedicina</h1>
            </div>
          </div>

          <div className="flex w-full  lg:w-1/2 justify-center items-center space-y-8">
            <div className="w-full px-8 md:px-48 lg:px-36">
              {msg && <Alerta
              alerta={alerta}
              />}
            
            
            <form className="bg-white rounded-md shadow-2xl p-5" 
            onSubmit={handleSubmit}
            >
              <h1 className=" text-lila-200 font-extrabold font-nunito text-2xl mb-1 text-center">Cimiento Clínico</h1>
              <p className="text-md font-nunito text-gray-400 font-normal mb-8 text-center">Registro en el sistema</p>
              <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl">
                <input id="email" className=" font-normal font-nunito  pl-2 w-full outline-none border-none" 
                type="email" 
                name="email"
                 placeholder="Ingresa tu correo electrónico"
                 value={email}
                 onChange={e => setEmail(e.target.value) }
                  />
              </div>
              <div className="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">
  <input
    id="rut"
    className={`font-normal font-nunito pl-2 w-full outline-none border-none ${rutValid ? '' : 'input-error'}`}
    type="text"
    name="Rut"
    placeholder="RUT con guion identificador. Ejemplo: 11111111-1"
    value={rut}
    onChange={e => setRut(e.target.value)}
  />
</div>

              <div className="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">

                <input id="nombres" className=" font-normal font-nunito  pl-2 w-full outline-none border-none" 
                type="text" 
                name="nombres"
                 placeholder="Nombres" 
                 value={nombres}
                 onChange={e => setNombres(e.target.value) }
                 />
              </div>
              <div className="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">

                <input id="apellidos" className=" font-normal font-nunito  pl-2 w-full outline-none border-none" 
                type="text" 
                name="apellidos" 
                placeholder="Apellidos" 
                value={apellidos}
                 onChange={e => setApellidos(e.target.value) }
                />
              </div>
              <div className="items-center border-2 mb-6  px-3 rounded-2xl">
                <div>  <label htmlFor="fechaNacimiento" className=" text-gray-400 text-sm ml-2">
    Fecha de nacimiento
  </label></div>
  <input
    id="fechaNacimiento"
    className="font-normal font-nunito pl-2 w-full outline-none border-none"
    type="date"
    name="fechaNacimiento"
    value={fechaNacimiento}
    onChange={e => setFecha(e.target.value)}
  />
</div>

               <div className="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">

                <select id="Genero" className=" font-normal font-nunito  pl-2 w-full outline-none border-none" 
                type="text" 
                name="Genero" 
                placeholder="Genero" 
                value={sexo}
                 onChange={e => setSexo(e.target.value) }> 
                <option value="Sin datos">Género</option>
                <option value="No específica" >No específica</option>
                 <option value="Hombre">Masculino</option>
                 <option value="Mujer" >Femenino</option>
                 </select>
              </div>
              <div className='bg-lila-300 text-gray-300 rounded-lg px-2 py-2 mb-2 text-sm'>
                <h1>Contraseñas válidas</h1>
                <ul className="list-disc ml-6 text-sm">
                  <li>Debe tener al menos 6 caracteres</li>
                  <li>Debe contener al menos una letra mayúscula</li>
                  <li>Debe contener al menos un número</li>
                </ul>
              </div>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl ">
                <input type={showPwd ? "text" : "password"} className="pl-2 w-full outline-none border-none"
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
              <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                <input type={showRPwd ? "text" : "password"} className="pl-2 w-full outline-none border-none"
                 placeholder="Confirma tu contraseña" 
                 value={repetirPassword}
                 onChange={e => setRepetirPassword(e.target.value)}
                 />
                 <div className="position-absolute position-right pointer pwd-icon" onClick={() => setShowRPwd(!showRPwd)}>
            {showRPwd ? <svg  className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1.2rem"}>
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg> : <svg className="h-5 w-5 text-gray-400"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1.2rem"}>
              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
            </svg>}
          </div>
                
              </div>




              
              <button  type="submit" className=" bg-lila-200  block w-full font-nunito py-2 rounded-2xl hover:bg-lila-300 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Registrate</button>
              <div className="flex justify-between mt-4">
                <Link  to="/ingresa" className="text-sm ml-2 hover:text-lila-300 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Ya tienes una cuenta? Ingresa aquí</Link>

              </div>
              
            </form>
            </div>
            
          </div>
      </div>
        
        </>
    );
};

export default Registrar;