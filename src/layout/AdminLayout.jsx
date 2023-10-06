import { Outlet, Navigate } from "react-router-dom"
import adminAuth from "../hooks/adminAuth"
import SideBar from "../components/adminComponents/SideBar"
const AdminLayout = () => {
    const { authadmin, cargando } = adminAuth( )
    if(cargando) return

  return (
    <>
   <>
  

  { authadmin?._id ?
  (
    <section  className="gap-6 contenedor dark:bg-slate-600 ">
    <aside className="sidebar"><SideBar/></aside>
    <section className="contenido">
             <article className="main">
    <Outlet/>
    </article>


</section>


</section>

   ): <Navigate to="/ingresa-admin"/> }




</>

    </>
  )
}

export default AdminLayout