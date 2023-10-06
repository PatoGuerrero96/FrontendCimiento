import FormularioMotivoConsulta from "../../components/pacienteComponents/FormularioMotivoConsulta"
import HeaderMotivoConsulta from "../../components/pacienteComponents/HeaderMotivoConsulta"
const Consultas = () => {
  return (
    <>
     <HeaderMotivoConsulta/>
    <div className=' py-4 bg-lila-300 flex justify-center'>
          <h1 className='text-white font-bold text-4xl'>Motivos de consulta</h1>
    </div>
    <FormularioMotivoConsulta/>


    
    </>
  )
}

export default Consultas