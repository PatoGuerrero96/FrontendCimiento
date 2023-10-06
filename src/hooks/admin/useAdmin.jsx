import { useContext } from "react";
import AdminsContext from "../../context/admin/AdminProvider";

const useAdmin =()=> {

return useContext(AdminsContext)

}

export default useAdmin