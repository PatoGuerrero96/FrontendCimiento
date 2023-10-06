import clientAxios from "../../config/axios";
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Alerta from "../../components/Alerta"
const ConfirmarAdmin = () => {

const [cuentaConfirmada, setCuentConfirmada] = useState(false)
const [cargando, setCargando] = useState(true)
const [alerta,setAlerta]= useState({})
const params = useParams()
const {id} = params 

 useEffect (() =>{
 const confirmarCuentaAdmin = async () =>{
 try {
    const url = `/admin/confirmar/${id}`
    const { data } = await  clientAxios.get(url)
    setCuentConfirmada(true)
    setAlerta({
      msg:data.msg,
    })
 } catch (error) {
  setAlerta({
    msg:error.response.data.msg,
    error:true

  })
 }
 setCargando(false)
 }
 confirmarCuentaAdmin();
 }, [])
  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-100 via-teal-400 to-teal-600">
<div className="mx-auto w-full max-w-lg rounded-lg bg-white px-10 py-8 shadow-xl">

<div className="mx-auto space-y-6">
  <h1 id="textologo"className=" font-nunito font-bold text-2xl">Cimiento Clínico</h1>

  <div className="flex w-full justify-center ">
   {!cargando &&  <Alerta alerta={alerta}/>}
  </div>
  <div className="flex w-full justify-center ">
  {cuentaConfirmada&&( <Link className="block text-center my-5 text-gray-500"
to="/ingresa-admin">Ya puedes iniciar sesión</Link>)}
  </div>

</div>
</div>

</div>

 
    
    </>
  )
}

export default ConfirmarAdmin