import { useContext } from "react";
import AuthProContext from "../context/AuthProProvider";

const proAuth =()=> {

return useContext(AuthProContext)

}

export default proAuth