import { useContext } from "react";
import PacienteContext from "../../context/admin/PacienteProvider";

const usePacientes =()=> {

return useContext(PacienteContext)

}

export default usePacientes