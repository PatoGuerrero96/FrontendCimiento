import { useEffect,useState } from "react";
import { useParams, } from 'react-router-dom';
import clientAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth"
import FormularioConsultaAprobada from "../../components/pacienteComponents/FormularioConsultaAprobada";
import FormularioConsultaFinalizada from "../../components/pacienteComponents/FormularioConsultaFinalizada";

const VerConsultaAprobada= () => {
    const [consulta, setConsulta] = useState([]);
    const { id } = useParams();
    const {auth} =  useAuth();
        useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };

        const fetchData = async () => {
          try {
            const { data } = await clientAxios.get(`/pacientes/vermas-consulta-aprobada/${id}`, config);
         setConsulta(data)
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();

      }, []);      
          if (!consulta || consulta.length === 0) {
            return <p>Cargando...</p>;
          }

          if (consulta && consulta.paciente._id !== auth._id) {
            return (
                <div className=" bg-coral-100 w-full h-screen flex flex-col items-center justify-center">

                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold  font-nunito md:text-6xl lg:text-9xl text-white  mt-12">403</h1>
                    <h2 className="text-3xl font-semibold  font-nunito md:text-4xl lg:text-5xl text-white mt-12">No tienes permiso</h2>
                    <img  className="h-96"  src="https://res.cloudinary.com/dde62spnz/image/upload/v1683307824/Imagenes%20sitio/mano_nvygfz.png" alt="" />
                    <p className="md:text-lg font-nunito  lg:text-xl text-white mt-8">Lo sentimos no tienes el permiso para ver esta sección</p>

                </div>
            </div>
              );
          }
  return (
    <> 
    <div className="bg-lila-200 text-white text-3xl font-semibold text-center py-6 rounded-b"> 
       Mótivo de consulta: <span className="italic text-4xl font-bold">{consulta.motivoconsulta.titulo}</span> 
    </div>
    {consulta.estado === "pagado" ? (
  <FormularioConsultaAprobada/> 
) : ''}

{consulta.estado === "finalizado" ? (
    <FormularioConsultaFinalizada/> 
) : ''}





    </>
  )
}
export default VerConsultaAprobada