import { useState, useEffect } from "react"
import Alerta from '../../components/AlertaModal';
import Modal from "../../components/Modal"
import useAdmins from "../../hooks/admin/useAdmin";
import { Paginacion } from "../Paginacion";
import AdminAuth from '../../hooks/adminAuth'
const FormularioAdmins = () => {

    const [email, setEmail] = useState('')
    const [rut, setRut] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [password, setPassword] = useState('')
    const [telefono, setTelefono] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    const [fecha, setFecha] = useState('')
    const [alerta, setAlerta ]= useState({})
    const [id, setId] = useState(null)
    const [showModalGuardar, setShowModalGuardar]= useState(false)
    const [showModalEditar, setShowModalEditar]= useState(false)
    const[busqueda, setBusqueda]= useState('')
    const { authadmin} = AdminAuth()

    const {guardarAdmin, admin} = useAdmins()
    const {setEdicion, eliminarAdmin, setAdmins, tablaUsuarios,pagina, setPagina, porPagina, maximo } = useAdmins()

    const {admins} = useAdmins()
    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
  
    useEffect(() => {
       if(admin?.nombre){
        setRut(admin.rut)
        setEmail(admin.email)
        setNombre(admin.nombre)
        setApellidos(admin.apellidos)
        setTelefono(admin.telefono)
        setFecha(new Date(admin.fecha).toISOString().split('T')[0]);
        setId(admin._id)

       }
    }, [admin])
    

    //AGREGANDO PROFESIONAL
    const handleSubmit = async e =>{
        e.preventDefault();
        if([email,rut,nombre,apellidos].includes('')){
          setAlerta({msg: 'Hay campos vacíos', error: true})
          setTimeout(()=> setAlerta({}),5000)
          return;
        }
    
        if(rut.length < 9 || rut.length > 10 ){
          setAlerta({msg: 'RUT no válido. Ejemplo:11111111-1', error: true})
          setTimeout(()=> setAlerta({}),5000)
          return;
        }
        const rutDigits = rut.split('-')[0]; // Obtiene los dígitos del RUT sin el guión
        const passwordrut = rutDigits.slice(-6); // Obtiene los últimos 6 dígitos del RUT
        setAlerta({})
        guardarAdmin({email,rut,nombre,apellidos,password:passwordrut, telefono})
        if(guardarAdmin){
            setAlerta({
                msg: 'Administrador registrado, Email de confirmación enviado',
                error: false
               })
               setTimeout(()=> setAlerta({}),5000)
        }
       setShowModalGuardar(false),
       setEmail('')
       setRut('')
 setNombre('')
 setApellidos('')
 setPassword('')
 setFechaNacimiento('')
 setSexo('')
 setRepetirPassword('')

       }
    //EDITANDO PROFESIONAL
    const Editar = async e =>{
      e.preventDefault();
      if([email,rut,nombre].includes('')){
        setAlerta({msg: 'Email, rut y nombres no pueden estar vacíos', error: true})
        setTimeout(()=> setAlerta({}),5000)
        return;
      }

      
      guardarAdmin({email,rut,nombre,apellidos,fecha,telefono,id})
      if(guardarAdmin){

      }
      setEmail('')
      setRut('')
      setNombre('')
      setApellidos('')
      setFecha('')
      setTelefono('')
      setId('')

     }


       const { msg } = alerta

       const handleChange=e=>{
        setBusqueda(e.target.value);
        filtrar(e.target.value);
      }

      const filtrar=(terminoBusqueda)=>{
        var resultadosBusqueda=tablaUsuarios.filter((elemento)=>{
          if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.rut.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.apellidos.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          ||elemento.email.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          ){
            return elemento;
          }
        });
        setAdmins(resultadosBusqueda);
      }
  return (
    <>
    
    <h1  className="font-bold font-nunito text-center text-2xl text-teal-600 dark:text-white ">Cimiento Clínico</h1>
<h3 className="font-semibold font-nunito text-center text-mb mb-2 dark:text-white">Mantenedor de administradores</h3>
<div className="flex w-full items-center justify-between border-b pb-3"> 
<button onClick={()=> setShowModalGuardar(true)} className=" bg-indigo-500 text-sm text-white hover:bg-indigo-700 font-regular  px-2 py-3 rounded-lg shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
Agregar Administrador
</button>	
<div className="flex items-center space-x-8">
      <div className="pt-2 relative mx-auto text-gray-600">
        <input className=" text-black px-2  font-semibold  text-sm py-3 rounded-md shadow-md hover:shadow-lg  focus:outline-none mr-1 mb-1  transition-all duration-150"
          value={busqueda}
          placeholder="Buscar Profesional"
          onChange={handleChange}/>

      </div>
      </div>
      </div>

<div className="p-1 xs:p-0 mx-auto md:w-full md:max-w-sm ">

<div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
 
   <Modal isVisible={showModalGuardar} onClose={()=> setShowModalGuardar(false)}  >
   <h3 className="font-semibold font-nunito text-center text-mb mb-2">Registro de profesionales</h3>
   {msg && <Alerta 
              alerta={alerta}
              />}
  <form  className="px-10 py-2 shadow-lg" onSubmit={handleSubmit} >
    <label htmlFor="email" className="font-semibold text-sm text-gray-700 pb-0 block" >Correo Electrónico</label>
    <input 
    id="email"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingresar Correo electrónico"
    type="email" 
    value={email}
    onChange={e => setEmail(e.target.value) }
    />

     <label htmlFor="nombres" className="font-semibold text-sm text-gray-600 pb-1 block" >Nombres</label>
    <input 
    id="nombres"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingresa ambos nombres"
    value={nombre}
    onChange={e => setNombre(e.target.value) } 

    />
     <label htmlFor="apellidos" className="font-semibold text-sm text-gray-600 pb-1 block" >Apellidos</label>
    <input 
    id="apellidos"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingresa ambos apellidos" 
    value={apellidos}
    onChange={e => setApellidos(e.target.value) }


    />
     <label htmlFor="rut" className="font-semibold text-sm text-gray-600 pb-1 block" >Rut</label>
    <input 
    id="rut"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="RUT.Ejemplo:11111111-1" 
    value={rut}
    onChange={e => {
      setRut(e.target.value);
      const rutDigits = e.target.value.split('-')[0];
      const passwordrut= rutDigits.slice(-6);
      setPassword(passwordrut);
      setRepetirPassword(passwordrut);
    }}


    />
      <label htmlFor="telefono" className="font-semibold text-sm text-gray-600 pb-1 block" >Telefono</label>
    <input 
    id="telefono"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingrese número telefónico" 
    value={telefono}
    onChange={e => setTelefono(e.target.value) }


    />

<label className="text-gray-600 text-sm">
  La contraseña de este usuario será: {password}
</label>
    <input  type="submit" className="bg-indigo-500 block w-full font-nunito py-1 rounded-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2" value='Registrar administrador'/>
  </form> 
  </Modal>
  <Modal isVisible={showModalEditar} onClose={()=> setShowModalEditar(false)}  >
  <h3 className="font-semibold font-nunito text-center text-mb mb-2">Actualización de administradores</h3>
  {msg && <Alerta 
              alerta={alerta}
              />}
  <form  className="px-10 py-2 shadow-lg" onSubmit={Editar}  >
    <label htmlFor="email2" className="font-semibold text-sm text-gray-700 pb-0 block" >Correo Electrónico</label>
    <input 
    id="email2"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingresar Correo electrónico"
    type="email" 
    value={email}
    onChange={e => setEmail(e.target.value) }
    />

     <label htmlFor="nombres2" className="font-semibold text-sm text-gray-600 pb-1 block" >Nombres</label>
    <input 
    id="nombres2"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingresa ambos nombres"
    value={nombre}
    onChange={e => setNombre(e.target.value) } 

    />
     <label htmlFor="apellidos2" className="font-semibold text-sm text-gray-600 pb-1 block" >Apellidos</label>
    <input 
    id="apellidos2"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Ingresa ambos apellidos" 
    value={apellidos}
    onChange={e => setApellidos(e.target.value) }


    />
     <label htmlFor="rut2" className="font-semibold text-sm text-gray-600 pb-1 block" >Rut</label>
    <input 
    id="rut2"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="RUT.Ejemplo:11111111-1" 
    value={rut}
    onChange={e => setRut(e.target.value) }


    />

        <label htmlFor="telefono2" className="font-semibold text-sm text-gray-600 pb-1 block" >Teléfono</label>
    <input
    id="telefono2"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full" 
    placeholder="Teléfono contacto" 
    value={telefono}
    onChange={e => setTelefono(e.target.value) }/> 

        <label htmlFor="fecha2" className="font-semibold text-sm text-gray-600 pb-1 block" >Fecha de Creación</label>
        
    <input 
     type="date"
    id="fecha2"
    className="border rounded-lg px-3 py-1 mt-1 mb-3 text-sm w-full " 
    placeholder="Fecha Nacimiento" 
    value={fecha}
    onChange={e => setFecha(e.target.value) }/> 

    
    <input  type="submit" className="bg-indigo-500 block w-full font-nunito py-1 rounded-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2" value='Actualizar Administrador'/>

     </form>
  </Modal>
</div>
</div>



<div className="container mx-auto shadow-lg">
  <div className="-mx-4 flex flex-wrap">
    <div className="w-full px-4">
      <div className="max-w-full overflow-x-auto overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="border-collapse w-full min-w-full divide-y divide-gray-300">
                <thead className="bg-indigo-500 ">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 font-nunito pr-3 text-center text-sm  font-semibold text-white sm:pl-6">RUT</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white">Nombres</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white">Apellidos</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito  text-center text-sm font-semibold text-white">Email</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white">Fecha Creación</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white">Telefono</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white">¿Confirmado?</th>
                        <th scope="col" className="font-bold font-nunito text-center text-white ">Acciones </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {admins.slice(
                (pagina - 1)* porPagina,
                (pagina - 1 ) * porPagina + porPagina
                ).map((administrador)=>(
                    <tr key={administrador._id}>
                        <td className="text-center py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">{administrador.rut ||''}</td>
                        <td className="text-center px-3 py-4 text-sm">{administrador.nombre ||''}</td>
                        <td className="text-center px-3 py-4 text-sm">{administrador.apellidos ||''} </td>
                        <td className="text-center px-3 py-4 text-sm">{administrador.email ||''} </td>
                        <td className="text-center px-3 py-4 text-sm">{formatearFecha(administrador.fecha) ||''}</td>
                        <td className="text-center px-3 py-4 text-sm">{administrador.telefono ||''}</td>
                        <td className="text-center px-3 py-4 text-sm">
                            <span className="flex justify-center">
                            {(administrador.confirmado== true ?<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>:<svg fill="#FA5252" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="20px" height="20px">    <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16.414,15 c0,0,3.139,3.139,3.293,3.293c0.391,0.391,0.391,1.024,0,1.414c-0.391,0.391-1.024,0.391-1.414,0C18.139,19.554,15,16.414,15,16.414 s-3.139,3.139-3.293,3.293c-0.391,0.391-1.024,0.391-1.414,0c-0.391-0.391-0.391-1.024,0-1.414C10.446,18.139,13.586,15,13.586,15 s-3.139-3.139-3.293-3.293c-0.391-0.391-0.391-1.024,0-1.414c0.391-0.391,1.024-0.391,1.414,0C11.861,10.446,15,13.586,15,13.586 s3.139-3.139,3.293-3.293c0.391-0.391,1.024-0.391,1.414,0c0.391,0.391,0.391,1.024,0,1.414C19.554,11.861,16.414,15,16.414,15z"/></svg> )}
                            </span>
                        </td>   
                        <td className="p-2  md:border md:border-grey-500 text-center block md:table-cell">
					              
					              <button
                                  onClick={()=>{setShowModalEditar(true); setEdicion(administrador)} }
                                   className="bg-indigo-500 hover:bg-indigo-700 text-white text-sm font-nunito font-semibold py-1 mr-1 mb-1 px-2 border border-indigo-500 rounded"
                                   >Editar</button>
                                   {/*
                                   {authadmin.email==='kixayar524@ngopy.com' ?  <button
                                   onClick={()=> eliminarAdmin(administrador._id)}
                                   className="bg-red-500 hover:bg-red-700 text-white text-sm font-nunito font-semibold py-1 px-2 border border-red-500 rounded">Eliminar</button> : ' '}
                                   */}
                                   
			             	</td>
                    </tr>
                    

                    ))}
                </tbody>
            </table>
            </div>
            </div>
            </div>
        </div>
        <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
 
    
    
    </>
  )
}

export default FormularioAdmins