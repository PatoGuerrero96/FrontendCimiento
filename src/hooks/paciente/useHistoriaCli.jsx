import { useContext } from "react";
import HistoriaCliContext from "../../context/paciente/HistoriaCliContext";

const useHistoriaCli =()=> {

return useContext(HistoriaCliContext)

}

export default useHistoriaCli