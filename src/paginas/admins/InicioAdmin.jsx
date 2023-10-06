import AdminAuth from '../../hooks/adminAuth'
import DashboardGeneral from '../../components/adminComponents/DashboardGeneral'
import GraficoMotivoConsulta from '../../components/adminComponents/GraficoMotivoConsulta'
const InicioAdmin = () => {
  const { authadmin} = AdminAuth()

    return (
      <>
      <article className='bg-gray-100'>
        
   
    <h1 className='text-4xl  text-center font-bold text-lila-300'>Bienvenido administrador: {authadmin.nombre} {authadmin.apellidos}</h1>
<div className='sm:px-20 px-0 py-5'>
    < DashboardGeneral/>
    </div >
    <div className='  sm:px-20 px-0 py-5'>
    <GraficoMotivoConsulta/>
    </div>

    </article>
      </>
    )
  }
  
  export default InicioAdmin