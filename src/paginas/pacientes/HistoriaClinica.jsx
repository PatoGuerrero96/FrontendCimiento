import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { useState } from "react"
import FormularioAlergia from "../../components/pacienteComponents/FormularioAlergia"
import FormularioEnfermedad from "../../components/pacienteComponents/FormularioEnfermedades"
import FormularioFarmaco from "../../components/pacienteComponents/FormularioFarmaco"
import FormularioQuirurgico from "../../components/pacienteComponents/FormularioQuirurgico"
import HeaderHistoria from "../../components/pacienteComponents/HeaderHistoria"
import FormularioAntecedentesfam from "../../components/pacienteComponents/FormularioAntecedentesfam"
import FormularioHospitalizaciones from "../../components/pacienteComponents/FormularioHospitalizaciones"
import FormularioIdentificacion from "../../components/pacienteComponents/FormularioIdentificacion"
import FormularioTabaquismo from "../../components/pacienteComponents/FormularioTabaquismo"
import FormularioAlcoholismo from "../../components/pacienteComponents/FormularioAlcoholismo"
import FormularioDrogas from "../../components/pacienteComponents/FormularioDrogas"
import FormularioGinecoobstetrico from "../../components/pacienteComponents/FormularioGinecoobstetrico"
import FormularioFarmacoPrevio from "../../components/pacienteComponents/FormularioFarmacoPrevio"
import Historiaclinicapdf from "../../components/pacienteComponents/Historiaclinicapdf"
const HistoriaClinica = () => {
const {auth} =  useAuth()
const [ocultarseccion, SetOcultarSeccion] = useState(true)

  return (
    <>
    

    <div className="bg-lila-300 margen  py-1 pb-5 shadow-md dark:bg-slate-700 ">
    <nav className="nav font-regular text-white">
        <ul className="flex items-center dark:text-white">
            <li className="p-4  cursor-pointer active hover:text-slate-300 hover:underline">
            <Link to="/paciente/perfil-paciente"> <h2 className=" text-md">Perfil de usuario   </h2></Link>
            </li>
            &gt;
            <li className="p-4 cursor-pointer  hover:text-slate-300 hover:underline">
            <Link to="/paciente/historia-clinica"> <h2 className="text-md ">Historia clinica</h2></Link>
            </li>
       
        </ul>
    </nav>

 

  <h1 className="text-left xl:px-64 font-regular mt-4 text-white text-4xl dark:text-white shado"><span className="font-semibold"> {auth.nombres} {auth.apellidos}  </span> </h1>
       </div>
      <HeaderHistoria/>
      <div className='flex justify-center p-4 bg-gray-50'>
  <div className=' bg-lila-300 hover:bg-lila-100  max-w-lg px-3 py-1 rounded-md text-white'>
  <Historiaclinicapdf/>
  </div>

</div>
       <div className="py-5 bg-gray-100  bg-opacity-50  " >
      <FormularioIdentificacion/>
       </div>




       <div className= "py-10 bg-gray-100  bg-opacity-50   ">
      <div className="mx-auto container max-w-5xl md:w-3/4 shadow-md bg-lila-200 ">
        <div className=" p-4    rounded-t ">
        <div className=" flex text-right mr-5">
        <h1 className="text-left text-white font-nunito">Antecedentes Clínicos</h1>
        <button  className="p-1  rounded-md inline-flex space-x-1 items-center text-white hover:text-white bg-indigo-400 ml-1  hover:bg-indigo-600 "
            onClick={()=> SetOcultarSeccion(!ocultarseccion)}>
                  <span className="text-xs  font-regular  lg:block">{ocultarseccion ? 
                  <div className="flex gap-2">
                     🔽    
                  </div>
                  :
                  <div className="flex gap-2">
                   ▶️                     </div>
                  } </span>                     
            </button>
             
          </div>

        </div>
        <div className={`${ocultarseccion?'block':'hidden'} xs:block bg-white space-y-1  `}>
        <FormularioEnfermedad/>
          <hr />
          <FormularioFarmaco/>
          <hr />
          <FormularioFarmacoPrevio/>
          <hr />
          <FormularioQuirurgico/>
          <hr />
          <FormularioAntecedentesfam/>
          <hr />
          <FormularioAlergia/>
          <hr />
          <FormularioTabaquismo/>
          <hr />
          <FormularioAlcoholismo/>
          <hr />
          <FormularioDrogas/>
          <hr />
          <FormularioHospitalizaciones/>
          <hr />
          {auth.sexo==='Mujer' ?<FormularioGinecoobstetrico/> :'' }
          

        </div>
      </div>
    </div>




   
   
    </>
    

  )
}

export default HistoriaClinica