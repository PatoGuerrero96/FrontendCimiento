import{createContext, useState, useEffect} from 'react'
import clientAxios from '../../config/axios'
import AdminAuth from '../../hooks/adminAuth'
const ProfesionalesContext = createContext()

export const ProfesionalProvider = ({children}) => {
  const { authadmin} = AdminAuth()

    const [profesionales, setProfesionales] = useState([])
    const [profesional, setProfesional] = useState({})
    const [tablaUsuarios, setTablaUsuarios]= useState([]);

  



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
     const obtenerProfesionales = async ()=>{

        try {
            const tokenAdm = localStorage.getItem('tokenAdm')
            if(!tokenAdm) return
            const config = {
              headers:{
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenAdm}`
              }
            }
            const { data } = await clientAxios("/admin/modulo-profesional",config)
            setProfesionales(data)
            setTablaUsuarios(data);
         
          } catch (error) {
            console.log(error)
          }
    
     }
     obtenerProfesionales()

   },[authadmin])

   const guardarProfesional = async (profesional) => {
    const tokenAdm = localStorage.getItem('tokenAdm');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${tokenAdm}`
      }
    };
  
    const formData = new FormData();
    formData.append('email', profesional.email);
    formData.append('nombres', profesional.nombres);
    formData.append('apellidos', profesional.apellidos);
    formData.append('rut', profesional.rut);
    formData.append('especialidad', profesional.especialidad);
    formData.append('sexo', profesional.sexo);
    formData.append('fechaNacimiento', profesional.fechaNacimiento);
    formData.append('telefono', profesional.telefono);
  
    // Agregar firma al FormData si existe una nueva
    if (profesional.firma && profesional.firma.file) {
      formData.append('firma', profesional.firma.file);
    }
  
    if (profesional.id) {
      try {
        const { data } = await clientAxios.put(`/admin/modulo-profesional/${profesional.id}`, formData, config);
        const profesionalActualizado = profesionales.map(profesionalState => (profesionalState._id === data._id ? data : profesionalState));
        setProfesionales(profesionalActualizado);
        toastMixin.fire({
          title: 'Profesional actualizado correctamente'
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await clientAxios.post('admin/modulo-profesional', profesional, config);
        const { createdAt, updatedAt, __v, ...profesionalAlmacenado } = data;
        setProfesionales([profesionalAlmacenado, ...profesionales]);
        toastMixin.fire({
          animation: true,
          title: 'Registrado correctamente. Email de confirmación enviado'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email o Rut ya registrado',
        });
      }
    }
  };

    const guardarSoloProfesional = async (profesional)=>{
      const tokenAdm = localStorage.getItem('tokenAdm')
      const config = {
        headers:{
          'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${tokenAdm}`
        }
      }
      try{
      
        const{ data }= await clientAxios.post('admin/modulo-pro',profesional,config)
      
          const{ createdAt, updatedAt, __v, ...profesionalAlmacenado} = data
        setProfesionales ([profesionalAlmacenado, ...profesionales])
        toastMixin.fire({
          animation: true,
          title: 'Registrado correctamente. Email de confirmación enviado'
        });
        
       }
       catch(error){
console.log('error')
   
       }
    }

    const setEdicion = (profe) =>{
     setProfesional(profe)
    }


    const eliminarProfesional = async (id) => {
      const confirmar = await Swal.fire({
        title: '¿Estás seguro de eliminar el profesional?',
        text: "!No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4084f4',
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
          const {data} = await clientAxios.delete(`admin/modulo-profesional/${id}`, config);
          const profesionalActualizado = profesionales.filter(profesionalesState => profesionalesState._id !== id);
          setProfesionales(profesionalActualizado);
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
   <ProfesionalesContext.Provider
   value={{
    profesionales,
    guardarProfesional,
    profesional,
    setEdicion,
    eliminarProfesional,
    setProfesionales,
    tablaUsuarios,
    setTablaUsuarios,
    guardarSoloProfesional,
    setProfesional



   }}
   >
    {children}

   </ProfesionalesContext.Provider> 
  )
}


export default ProfesionalesContext