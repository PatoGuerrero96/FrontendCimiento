import { useContext } from "react";
import PreguntasCliContext from "../../context/paciente/PreguntasCliProvider";

const usePreguntasCli =()=> {

return useContext(PreguntasCliContext)

}

export default usePreguntasCli