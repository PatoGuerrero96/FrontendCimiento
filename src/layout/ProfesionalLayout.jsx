import { Outlet, Navigate } from "react-router-dom"
import proAuth from "../hooks/proAuth"
import SiDebar from "../components/profesionalComponents/SiDebar"
const ProfesionalLayout = () => {
    const { authpro, cargando } = proAuth( )
    if(cargando) return

  return (
    <>
   <>
  
 
  { authpro?._id ?
  (
    <section  className="gap-6 contenedor dark:bg-slate-600">
       <aside className="sidebar"><SiDebar/></aside>
       <section className="contenido">
            <article className="main">
      
    <Outlet/>
    </article>


</section>


</section>

   ): <Navigate to="/ingresa-profesional"/> }




</>

    </>
  )
}

export default ProfesionalLayout