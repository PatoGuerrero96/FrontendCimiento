import { useContext } from "react";
import ProfesionalesContext from "../../context/admin/ProfesionalProvider";

const useProfesionales =()=> {

return useContext(ProfesionalesContext)

}

export default useProfesionales