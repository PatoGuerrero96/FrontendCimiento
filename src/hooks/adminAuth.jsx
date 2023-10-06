import { useContext } from "react";
import AuthAdminContext from "../context/AuthAdminProvider";

const AdminAuth =()=> {

return useContext(AuthAdminContext)

}

export default AdminAuth