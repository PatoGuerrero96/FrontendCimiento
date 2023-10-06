import proAuth from "../../hooks/proAuth"
import FormularioinicioMotivos from "../../components/profesionalComponents/FormularioinicioMotivos"

const ListaMotivosConsulta = () => {
  const {authpro} =  proAuth()
  return (
    <>
    
    <div className=" px-6 py-10 mx-auto bg-coral-100 ">
    <h1 className=" mb-5 text-center font-regular font-nunito text-3xl text-white dark:text-white">Busca mótivos de consulta  </h1>
    </div>
    <FormularioinicioMotivos/>

  
     
    </>
  )
}

export default ListaMotivosConsulta