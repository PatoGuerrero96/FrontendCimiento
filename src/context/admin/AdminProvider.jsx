import{createContext, useState, useEffect} from 'react'
import clientAxios from '../../config/axios'
import AdminAuth from '../../hooks/adminAuth'
const AdminsContext = createContext()

export const AdminProvider = ({children}) => {
    const [admins, setAdmins] = useState([])
    const [admin, setAdmin] = useState({})
    const [tablaUsuarios, setTablaUsuarios]= useState([]);
    const [pagina, setPagina] = useState (1);
    const [porPagina, setPorPagina] = useState (7);
    const { authadmin} = AdminAuth()
    const maximo = Math.ceil(admins.length / porPagina) 
    const toastMixin = Swal.mixin({
        toast: true,
        icon: 'success',
        title: 'Titulo',
        animation: false,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    useEffect(()=>{
        const obtenerAdmins = async ()=>{
   
           try {
               const tokenAdm = localStorage.getItem('tokenAdm')
               if(!tokenAdm) return
               const config = {
                 headers:{
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${tokenAdm}`
                 }
               }
               const { data } = await clientAxios("/admin/modulo-admin",config)
               setAdmins(data)
               setTablaUsuarios(data);
            
             } catch (error) {
               console.log(error)
             }
       
        }
        obtenerAdmins()
   
      },[authadmin])

      const guardarAdmin = async (admin)=>{
        const tokenAdm = localStorage.getItem('tokenAdm')
        const config = {
          headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenAdm}`
          }
        }
        if(admin.id){
          try {
            const{data}= await clientAxios.put(`/admin/modulo-admin/${admin.id}`,admin,config)
            const adminActualizado = admins.map(adminsState => adminsState._id ===
              data._id ? data : adminsState )
              setAdmins(adminActualizado)
              toastMixin.fire({
                title: 'Administrador guardado correctamente'
              });
          } catch (error) {
            console.log(error)
          }
  
        }else{
     
          try{
        
            const{ data }= await clientAxios.post('admin/modulo-admin',admin,config)
          
              const{ createdAt, updatedAt, __v, ...adminAlmacenado} = data
            setAdmins ([adminAlmacenado, ...admins])
            toastMixin.fire({
              animation: true,
              title: 'Registrado correctamente'
            });
            
           }
           catch(error){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Email o Rut ya registrado',
              })
       
           }
        }
  
  
  
      }
  
      const setEdicion = (administrador) =>{
       setAdmin(administrador)
      }
  
      const eliminarAdmin = async (id) => {
        const confirmar = await Swal.fire({
          title: '¿Estás seguro de eliminar el administrador?',
          text: "!No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#6864f4',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminarlo!'
          }).then((result) => {
          if (result.isConfirmed) {
              return true;
          } else {
              return false;
          }
      })
      if(confirmar) {
        try {
            const tokenAdm = localStorage.getItem("tokenAdm");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenAdm}`
                }
            }
            const {data} = await clientAxios.delete(`admin/modulo-admin/${id}`, config);
            const adminActualizado = admins.filter(adminsState => adminsState._id !== id);
            setAdmins(adminActualizado);
            toastMixin.fire({
                animation: true,
                title: 'Eliminado correctamente'
              });
        } catch (error) {
            console.log(error);
        }
    }
      
  
      }
    
return (
    <AdminsContext.Provider
    value={{
        admins,
        guardarAdmin,
        admin,
        setEdicion,
        eliminarAdmin,
        setTablaUsuarios,
        tablaUsuarios,
        setAdmins,
        pagina,
        setPagina,
        porPagina,
        setPorPagina,
        maximo
 
    }}
    >
     {children}
 
    </AdminsContext.Provider> 
   )

}

export default AdminsContext