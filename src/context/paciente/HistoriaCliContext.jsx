import { useState, createContext } from "react";
import clientAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth"

const HistoriaCliContext = createContext()

const HistoriaCliProvider = ({children})=>{
    const [quirurgicos, setQuirurgicos] = useState([])
    const [quirurgico, setQuirurgico] = useState({})
    const [farmacos, setFarmacos] = useState([])
    const [farmaco, setFarmaco] = useState({}) 
    const [farmacosprevios, setFarmacosprevios] = useState([])
    const [farmacoprevio, setFarmacoprevio] = useState({})
    const [vacunas, setVacunas] = useState([])
    const [vacuna, setVacuna] = useState({})
    const [enfermedades, setEnfermedades] = useState([])
    const [enfermedad, setEnfermedad] = useState({})
    const [alergias, setAlergias] = useState([])
    const [alergia, setAlergia] = useState({})
    const [antecedentesfamiliares, setAntecedentesfamiliares] = useState([])
    const [antecedentesfam, setAntecedentesfam] = useState({})
    const [hospitalizaciones, setHospitalizaciones] = useState([])
    const [hospitalizacion, setHospitalizacion] = useState({})
    const [urgencias, setUrgencias] = useState([])
    const [urgencia, setUrgencia] = useState({})
    const [nombre, setNombre] = useState('');
    const [enfermedadId, setEnfermedadId] = useState('');
    const [quirurgicoId, setQuirurgicoId] = useState('');
    const [documento, setDocumento] = useState(null);
    const [examenes, setExamenes] = useState([])
    const [documentoh, setDocumentoh] = useState(null);
    const [documentohospitalizacion, setDocumentohospitalizacion] = useState(null);
    const [nombreh, setNombreh] = useState('');
    const [fechaingreso, setFechaingreso] = useState('');
    const [fechasalida, setFechasalida] = useState('');
    const { auth } = useAuth()
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

    const cuentaConQuirurgico= async datos =>{
        try {
    const token = localStorage.getItem('token')
    if(!token){
        setCargando(false)
        return
    } 
    const config ={
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    }
        const url = `/pacientes/tiene-quirurgico/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
    
        
    } catch (error) {
        console.log(error)
    }
    }
    const guardarQuirurgico =  async(quirurgico) =>{
        const token = localStorage.getItem('token')
        const config = {
          headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
        }
        if(quirurgico.id){
         try {
            const{data}= await clientAxios.put(`/pacientes/actualizar-quirurgico/${quirurgico.id}`,quirurgico,config)
          
          const quirurgicosActualizados= quirurgicos.map( quirurgicoState => quirurgicoState._id===
            data._id ? data : quirurgicoState)
            setQuirurgicos(quirurgicosActualizados)
         } catch (error) {
          console.log(error)
         }
    
        }else{
          try {
         
            const{ data }= await clientAxios.post('/pacientes/agregar-quirurgico',quirurgico,config)
            const{ createdAt, updatedAt, __v, ...quirurgicoAlmacenado} = data
            setQuirurgicos ([quirurgicoAlmacenado, ...quirurgicos])
            toastMixin.fire({
                animation: true,
                title: 'Antecedentes quirúrgicos agregados',
                icon:'success'
              });
        
        } catch (error) {
          console.log(error.response.data.msg)
        }
        }
     
    }
    const cuentaConFarmaco= async datos =>{
        try {
    const token = localStorage.getItem('token')
    if(!token){
        setCargando(false)
        return
    } 
    const config ={
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    }
        const url = `/pacientes/tiene-farmaco/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
    
        
    } catch (error) {
        console.log(error)
    }
    }
    const guardarFarmaco =  async(farmaco) =>{
        const token = localStorage.getItem('token')
        const config = {
          headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
        }
        if(farmaco.id){
         try {
            const{data}= await clientAxios.put(`/pacientes/actualizar-farmaco/${farmaco.id}`,farmaco,config)
          
          const farmacosActualizados= farmacos.map( farmacoState => farmacoState._id===
            data._id ? data : farmacoState)
            setFarmacos(farmacosActualizados)
         } catch (error) {
          console.log(error)
         }
    
        }else{
          try {
         
            const{ data }= await clientAxios.post('/pacientes/agregar-farmaco',farmaco,config)
            const{ createdAt, updatedAt, __v, ...farmacoAlmacenado} = data
            setFarmacos ([farmacoAlmacenado, ...farmacos])
            toastMixin.fire({
                animation: true,
                title: 'Farmaco agregado',
                icon:'success'
              });
        
        } catch (error) {
          console.log(error.response.data.msg)
        }
        }
     
    }
    const cuentaConVacuna= async datos =>{
        try {
    const token = localStorage.getItem('token')
    if(!token){
        setCargando(false)
        return
    } 
    const config ={
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    }
        const url = `/pacientes/tiene-vacuna/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
    
        
    } catch (error) {
        console.log(error)
    }
    }
    const guardarVacuna =  async(vacuna) =>{
        const token = localStorage.getItem('token')
        const config = {
          headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
        }
        if(vacuna.id){
         try {
            const{data}= await clientAxios.put(`/pacientes/actualizar-vacuna/${vacuna.id}`,vacuna,config)
          
          const vacunasActualizados= vacunas.map( vacunaState => vacunaState._id===
            data._id ? data : vacunaState)
            setVacunas(vacunasActualizados)
         } catch (error) {
          console.log(error)
         }
    
        }else{
          try {
         
            const{ data }= await clientAxios.post('/pacientes/agregar-vacuna',vacuna,config)
            const{ createdAt, updatedAt, __v, ...vacunaAlmacenado} = data
            setVacunas ([vacunaAlmacenado, ...vacunas])
            toastMixin.fire({
                animation: true,
                title: 'Vacuna agregada',
                icon:'success'
              });
        
        } catch (error) {
          console.log(error.response.data.msg)
        }
        }
     
    }
    
  const cuentaConEnfermedad= async datos =>{
    try {
const token = localStorage.getItem('token')
if(!token){
    setCargando(false)
    return
} 
const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    }
}
    const url = `/pacientes/tiene-enfermedad/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)

    
} catch (error) {
    console.log(error)
}
    }
  const guardarEnfermedad =  async(enfermedad) =>{
    const token = localStorage.getItem('token')
    const config = {
      headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
    }
    if(enfermedad.id){
     try {
        const{data}= await clientAxios.put(`/pacientes/actualizar-enfermedad/${enfermedad.id}`,enfermedad,config)
      
      const enfermedadesActualizados= enfermedades.map( enfermedadState => enfermedadState._id===
        data._id ? data : enfermedadState)
        setEnfermedades(enfermedadesActualizados)
     } catch (error) {
      console.log(error)
     }

    }else{
      try {
     
        const{ data }= await clientAxios.post('/pacientes/agregar-enfermedad',enfermedad,config)
        const{ createdAt, updatedAt, __v, ...enfermedadAlmacenado} = data
        setEnfermedades ([enfermedadAlmacenado, ...enfermedades])
        toastMixin.fire({
            animation: true,
            title: 'Enfermedad agregada',
            icon:'success'
          });
    
    } catch (error) {
      console.log(error.response.data.msg)
    }
    }
 
    }
    
  const cuentaConAlergia= async datos =>{


    try {
const token = localStorage.getItem('token')
if(!token){
    setCargando(false)
    return
} 
const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    }
}

    const url = `/pacientes/tiene-alergia/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)
    
} catch (error) {
    console.log(error)
}
    }
  const guardarAlergia =  async(alergia) =>{
    const token = localStorage.getItem('token')
    const config = {
      headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
    }
    if(alergia.id){
     try {
        const{data}= await clientAxios.put(`/pacientes/actualizar-alergia/${alergia.id}`,alergia,config)
      
      const alergiasActualizados= alergias.map( alergiaState => alergiaState._id===
        data._id ? data : alergiaState)
        setAlergias(alergiasActualizados)
     } catch (error) {
      console.log(error)
     }

    }else{
      try {
     
        const{ data }= await clientAxios.post('/pacientes/agregar-alergia',alergia,config)
        const{ createdAt, updatedAt, __v, ...alergiaAlmacenado} = data
        setAlergias ([alergiaAlmacenado, ...alergias])
        toastMixin.fire({
            animation: true,
            title: 'Alergia agregada',
            icon:'success'
          });
    
    } catch (error) {
      console.log(error.response.data.msg)
    }
    }
 
   }

  const cuentaConAntecedentesfam= async datos =>{
    try {
const token = localStorage.getItem('token')
if(!token){
    setCargando(false)
    return
} 
const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    }
}

    const url = `/pacientes/tiene-antecedentesfam/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)
    
} catch (error) {
    console.log(error)
}
    }
  const guardarAntecedentesfam =  async(antecedentesfam) =>{
    const token = localStorage.getItem('token')
    const config = {
      headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
    }
    if(antecedentesfam.id){
     try {
        const{data}= await clientAxios.put(`/pacientes/actualizar-antecedentesfam/${antecedentesfam.id}`,antecedentesfam,config)
      
      const antecedentesfamiliaresActualizados= antecedentesfamiliares.map( antecedentesfamState => antecedentesfamState._id===
        data._id ? data : antecedentesfamState)
        setAntecedentesfamiliares(antecedentesfamiliaresActualizados)
     } catch (error) {
      console.log(error)
     }

    }else{
      try {
     
        const{ data }= await clientAxios.post('/pacientes/agregar-antecedentesfam',antecedentesfam,config)
        const{ createdAt, updatedAt, __v, ...antecedentesfamAlmacenado} = data
        setAntecedentesfamiliares([antecedentesfamAlmacenado, ...antecedentesfamiliares])
        toastMixin.fire({
            animation: true,
            title: 'Antecedente familiar  agregado',
            icon:'success'
          });
    
    } catch (error) {
      console.log(error.response.data.msg)
    }
    }
 
   }

   const cuentaConHospitalizaciones= async datos =>{
    try {
const token = localStorage.getItem('token')
if(!token){
    setCargando(false)
    return
} 
const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    }
}

    const url = `/pacientes/tiene-hospitalizacion/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)
    
} catch (error) {
    console.log(error)
}
    }

  const guardarHospitalizaciones =  async(hospitalizacion) =>{
    const token = localStorage.getItem('token')
    const config = {
      headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
    }
    if(hospitalizacion.id){
     try {
        const{data}= await clientAxios.put(`/pacientes/actualizar-hospitalizacion/${hospitalizacion.id}`,hospitalizacion,config)
      
      const hospitalizacionesActualizados= hospitalizaciones.map( hospitalizacionState => hospitalizacionState._id===
        data._id ? data : hospitalizacionState)
        setHospitalizaciones(hospitalizacionesActualizados)
     } catch (error) {
      console.log(error)
     }

    }else{
      try {
     
        const{ data }= await clientAxios.post('/pacientes/agregar-hospitalizacion',hospitalizacion,config)
        const{ createdAt, updatedAt, __v, ...hospitalizacionAlmacenado} = data
        setHospitalizaciones([hospitalizacionAlmacenado, ...hospitalizaciones])
        toastMixin.fire({
            animation: true,
            title: 'Hospitalizacion agregada',
            icon:'success'
          });
    
    } catch (error) {
      console.log(error.response.data.msg)
    }
    }
 
   }

   const guardarHospitalizacion = async (e) => {

    try {
    const token = localStorage.getItem('token')
    if(!token) return

    const config={
      headers:{
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
    }
    }
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('fechaingreso', fechaingreso);
    formData.append('fechasalida', fechasalida);
    formData.append('documento', documento);

      const response = await clientAxios.post('/pacientes/agregar-hospitalizacion', formData, config)
      toastMixin.fire({
        animation: true,
        title: 'Hospitalización cargada en el sistema',
        icon:'success'
      });
    } catch (error) {
       return{
        msg: error.response.data.msg,
        error:true
    }
    }
  };
  const eliminarHospitalizaciones = async (id) => {
    const confirmar = await Swal.fire({
      title: '¿Estás seguro de eliminar esta hospitalización?',
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
        const token = localStorage.getItem('token')
        const config = {
          headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
        }
        const {data} = await clientAxios.delete(`/pacientes/eliminar-hospitalizacion/${id}`, config);
        const hospitalizacionActualizado = hospitalizaciones.filter(hospitalizacionesState => hospitalizacionesState._id !== id);
        setHospitalizaciones(hospitalizacionActualizado);
        toastMixin.fire({
            animation: true,
            title: 'Eliminado correctamente'
          });
    } catch (error) {
        console.log(error);
    }
}
  
  }

   const cuentaConUrgencias= async datos =>{
    try {
const token = localStorage.getItem('token')
if(!token){
    setCargando(false)
    return
} 
const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    }
}

    const url = `/pacientes/tiene-urgencia/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)
    
} catch (error) {
    console.log(error)
}
    }

  const guardarUrgencias =  async(urgencia) =>{
    const token = localStorage.getItem('token')
    const config = {
      headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      }
    }
    if(urgencia.id){
     try {
        const{data}= await clientAxios.put(`/pacientes/actualizar-urgencia/${urgencia.id}`,urgencia,config)
      
      const urgenciasActualizados= urgencias.map( urgenciaState => urgenciaState._id===
        data._id ? data : urgenciaState)
        setUrgencias(urgenciasActualizados)
     } catch (error) {
      console.log(error)
     }

    }else{
      try {
     
        const{ data }= await clientAxios.post('/pacientes/agregar-urgencia',urgencia,config)
        const{ createdAt, updatedAt, __v, ...urgenciaAlmacenado} = data
        setUrgencias([urgenciaAlmacenado, ...urgencias])
        toastMixin.fire({
            animation: true,
            title: 'Atención en urgencia agregada',
            icon:'success'
          });
    
    } catch (error) {
      console.log(error.response.data.msg)
    }
    }
 
   }

   const actualizarIdentificacion= async datos =>{
    try {
const token = localStorage.getItem('token')
if(!token){
    setCargando(false)
    return
} 
const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    }
}

    const url = `/pacientes/actualizar-identificacion/${datos._id}`
    const {data} = await clientAxios.put(url,datos,config)
    toastMixin.fire({
      animation: true,
      title: 'Información actualizada',
      icon:'success'
    });
    
} catch (error) {
    console.log(error)
}
    }

    const actualizarGinecoobstetricos= async datos =>{
      try {
  const token = localStorage.getItem('token')
  if(!token){
      setCargando(false)
      return
  } 
  const config ={
      headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
      }
  }
  
      const url = `/pacientes/actualizar-ginecoobstetrico/${datos._id}`
      const {data} = await clientAxios.put(url,datos,config)
      toastMixin.fire({
        animation: true,
        title: 'Información actualizada',
        icon:'success'
      });
      
  } catch (error) {
    toastMixin.fire({
      animation: true,
      title: 'Formato no soportado',
      icon:'error'
    });
  }
      } 
      
      
      const guardarExamen = async (e) => {

        try {
        const token = localStorage.getItem('token')
        if(!token) return
    
        const config={
          headers:{
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        }
        }
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('enfermedadId', enfermedadId);
        formData.append('quirurgicoId', quirurgicoId);
        formData.append('documento', documento);
          const response = await clientAxios.post('/pacientes/agregar-examen', formData, config)
          toastMixin.fire({
            animation: true,
            title: 'Examen subido al sistema',
            icon:'success'
          });
        } catch (error) {
           return{
            msg: error.response.data.msg,
            error:true
        }
        }
      };


      const eliminarExamenes = async (id) => {
        const confirmar = await Swal.fire({
          title: '¿Estás seguro de eliminar este examen?',
          text: "!No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5d5ddb',
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
            const token = localStorage.getItem('token')
            const config = {
              headers:{
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              }
            }
            const {data} = await clientAxios.delete(`/pacientes/eliminar-examen/${id}`, config);
            const examenActualizado = examenes.filter(examenesState => examenesState._id !== id);
            setExamenes(examenActualizado);
            toastMixin.fire({
                animation: true,
                title: 'Eliminado correctamente'
              });
        } catch (error) {
            console.log(error);
        }
    }
      
      }
      
      const audit = async datos =>{
        try {
      const token = localStorage.getItem('token')
      if(!token){
        setCargando(false)
        return
      } 
      const config ={
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
      }
        const url = `/pacientes/formulario-audit/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
        toastMixin.fire({
          animation: true,
          title: 'Formulario AUDIT guardado',
          icon:'success'
        });
      
      } catch (error) {
        console.log(error)
      }
      }

      const cuentaConFarmacoPrevio= async datos =>{
        try {
    const token = localStorage.getItem('token')
    if(!token){
        setCargando(false)
        return
    } 
    const config ={
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    }
        const url = `/pacientes/tiene-farmaco-previo/${datos._id}`
        const {data} = await clientAxios.put(url,datos,config)
    
        
    } catch (error) {
        console.log(error)
    }
    }
    const guardarFarmacoPrevio =  async(farmacoprevio) =>{
      const token = localStorage.getItem('token')
      const config = {
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
      }
      if(farmacoprevio.id){
       try {
          const{data}= await clientAxios.put(`/pacientes/actualizar-farmaco-previo/${farmacoprevio.id}`,farmacoprevio,config)
        
        const farmacosActualizados= farmacosprevios.map( farmacoState => farmacoState._id===
          data._id ? data : farmacoState)
          setFarmacosprevios(farmacosActualizados)
       } catch (error) {
        console.log(error)
       }
  
      }else{
        try {
       
          const{ data }= await clientAxios.post('/pacientes/agregar-farmaco-previo',farmacoprevio,config)
          const{ createdAt, updatedAt, __v, ...farmacoAlmacenado} = data
          setFarmacosprevios ([farmacoAlmacenado, ...farmacosprevios])
          toastMixin.fire({
              animation: true,
              title: 'Tratamiento suspendido agregado',
              icon:'success'
            });
      
      } catch (error) {
        console.log(error.response.data.msg)
      }
      }
   
  }
    

    return(
        <HistoriaCliContext.Provider
        value={{
            auth,
            guardarQuirurgico,
            cuentaConQuirurgico,
            quirurgico,
            setQuirurgico,
            quirurgicos,
            setQuirurgicos,
            cuentaConFarmaco,
            guardarFarmaco,
            farmaco,
            setFarmaco,
            farmacos,
            setFarmacos,
            setVacunas,
            guardarVacuna,
            vacuna,
            setVacuna,
            vacunas,
            cuentaConVacuna,
            guardarEnfermedad,
            enfermedad,
            setEnfermedad,
            enfermedades,
            setEnfermedades,
            cuentaConEnfermedad,
            guardarAlergia,
            alergia,
            setAlergia,
            alergias,
            setAlergias,
            cuentaConAlergia,
            cuentaConAntecedentesfam,
            guardarAntecedentesfam,
            antecedentesfam,
            antecedentesfamiliares,
            setAntecedentesfam,
            setAntecedentesfamiliares,
            guardarHospitalizaciones,
            cuentaConHospitalizaciones,
            hospitalizacion,
            hospitalizaciones,
            setHospitalizacion,
            setHospitalizaciones,
            guardarUrgencias,
            cuentaConUrgencias,
            urgencias,
            urgencia,
            setUrgencia,
            setUrgencias,
            actualizarIdentificacion,
            actualizarGinecoobstetricos,
            nombre,
            setNombre,
            documento,
            setDocumento,
            enfermedadId,
            setEnfermedadId,
            guardarExamen,
            audit,
            guardarHospitalizacion,
            documentohospitalizacion,
            setDocumentohospitalizacion,
            eliminarHospitalizaciones,
            nombreh,
            setNombreh,
            fechaingreso,
            setFechaingreso,
            fechasalida,
            setFechasalida,
            documentoh,
            setDocumentoh,
            eliminarExamenes,
            cuentaConFarmacoPrevio,
            guardarFarmacoPrevio,
            farmacosprevios,
            setFarmacosprevios,
            farmacoprevio,
            setFarmacoprevio,
            quirurgicoId, 
            setQuirurgicoId

        }}
        >
            {children}
        </HistoriaCliContext.Provider>
    )
}
export {
    HistoriaCliProvider
    
}

export default HistoriaCliContext