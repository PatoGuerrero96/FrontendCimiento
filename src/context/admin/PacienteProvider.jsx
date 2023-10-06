import{createContext, useState, useEffect} from 'react'
import clientAxios from '../../config/axios'
import AdminAuth from '../../hooks/adminAuth'
const PacienteContext = createContext()

export const PacienteProvider = ({children}) => {
    
    const [pacientes, setPacientes] = useState([])
    const [paciente, setPaciente] = useState({})
    const [tablaUsuarios, setTablaUsuarios]= useState([]);
    const [pagina, setPagina] = useState (1);
    const { authadmin} = AdminAuth()
    const [porPagina, setPorPagina] = useState (7);
    
    const maximo = Math.ceil(pacientes.length / porPagina) 



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
     const obtenerPacientes = async ()=>{

        try {
            const tokenAdm = localStorage.getItem('tokenAdm')
            if(!tokenAdm) return
            const config = {
              headers:{
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenAdm}`
              }
            }
            const { data } = await clientAxios("/admin/modulo-paciente",config)
            setPacientes(data)
            setTablaUsuarios(data);
         
          } catch (error) {
            console.log(error)
          }
    
     }
     obtenerPacientes()

   },[authadmin])

    const guardarPaciente = async (paciente)=>{
      const tokenAdm = localStorage.getItem('tokenAdm')
      const config = {
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenAdm}`
        }
      }
      if(paciente.id){
        try {
          const{data}= await clientAxios.put(`/admin/modulo-paciente/${paciente.id}`,paciente,config)
          const pacienteActualizado = pacientes.map(pacienteState => pacienteState._id ===
            data._id ? data : pacienteState )
            setPacientes(pacienteActualizado)
            toastMixin.fire({
              title: 'Paciente Actualizado correctamente'
            });
        } catch (error) {
          console.log(error)
        }

      }else{
   
        try{
      
          const{ data }= await clientAxios.post('admin/modulo-paciente',paciente,config)
        
            const{ createdAt, updatedAt, __v, ...pacienteAlmacenado} = data
          setPacientes ([pacienteAlmacenado, ...pacientes])
          toastMixin.fire({
            animation: true,
            title: 'Registrado correctamente. Email de confirmación enviado'
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

    const setEdicion = (pacien) =>{
     setPaciente(pacien)
    }


    const eliminarPaciente = async (id) => {
      const confirmar = await Swal.fire({
        title: '¿Estás seguro de eliminar el paciente?',
        text: "!No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#18bca4',
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
          const {data} = await clientAxios.delete(`admin/modulo-paciente/${id}`, config);
          const pacienteActualizado = pacientes.filter(pacientesState => pacientesState._id !== id);
          setPacientes(pacienteActualizado);
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
    <PacienteContext.Provider
    value={{
        pacientes,
        guardarPaciente,
        paciente,
        setEdicion,
        eliminarPaciente,
        setPacientes,
        tablaUsuarios,
        setTablaUsuarios,
        pagina,
        setPagina,
        porPagina,
        setPorPagina,
        maximo,

 
    }}
    >
     {children}
 
    </PacienteContext.Provider> 
  )
}

export default PacienteContext