import { useState, useEffect } from "react"
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
import HeaderConsultasPro from "./HeaderConsultasPro";
import { Link } from "react-router-dom";
const ListaConsultaPendientes = () => {
    const [consultas, setConsultas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {authpro} =  proAuth()
    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
    useEffect(()=>{
        const obtenerMotivosConsulta = async() =>{
          try {
            const tokenPro = localStorage.getItem('tokenPro')
            if(!tokenPro) return
      
            const config={
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
            }
            }
            const { data } = await clientAxios.get('/profesional/obtener-lista-consultas',config)
             setConsultas(data)
             setIsLoading(false);
          } catch (error) {
            console.log(error)
          }
      
        }
        obtenerMotivosConsulta()      
      },[consultas])
    const consultaspro =  consultas.filter(con => con.profesional._id === authpro._id &&con.estado ==='pendiente') 

    return (
    <> 
    <HeaderConsultasPro
    />

    {isLoading ?
  <div className="sk-circle">
  <div className="sk-circle1 sk-child"></div>
  <div className="sk-circle2 sk-child"></div>
  <div className="sk-circle3 sk-child"></div>
  <div className="sk-circle4 sk-child"></div>
  <div className="sk-circle5 sk-child"></div>
  <div className="sk-circle6 sk-child"></div>
  <div className="sk-circle7 sk-child"></div>
  <div className="sk-circle8 sk-child"></div>
  <div className="sk-circle9 sk-child"></div>
  <div className="sk-circle10 sk-child"></div>
  <div className="sk-circle11 sk-child"></div>
  <div className="sk-circle12 sk-child"></div>
</div>
  
    :  
     <div>

    { consultaspro.length?
          <div className="container mx-auto mt-10">
          <div className="container mx-auto shadow-lg mt-1">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4">
                <div className="max-w-full overflow-x-auto overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="border-collapse w-full min-w-full divide-y divide-gray-300">
                    <thead className="bg-yellow-600 ">
                      <tr>
                        <th scope="col" className=" font-nunito pr-3 text-center text-sm font-semibold text-white sm:pl-6">Motivo de consulta</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white ">Fecha de la consulta</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white hidden md:table-cell">Hora de inicio</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white hidden md:table-cell">Hora de fin</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white">Tarifa</th>
                        <th scope="col" className="px-3 py-3.5 font-nunito text-center text-sm font-semibold text-white hidden md:table-cell">Fecha de creación</th>
                        <th scope="col" className="font-bold font-nunito text-center text-sm  text-white">Acciones </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {consultaspro.map(consulta => (
                      <tr key={consulta._id}>
                        <td className="text-center py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">{consulta.motivoconsulta.titulo || ''}</td>
                <td className="text-center px-3 py-4 text-sm ">{ formatearFecha(consulta.fecha) }</td>
                <td className="text-center px-3 py-4 text-sm hidden md:table-cell">{consulta.horarioinicio || ''} </td>
                <td className="text-center px-3 py-4 text-sm hidden md:table-cell">{consulta.horariofin || ''} </td>
                <td className="text-center px-3 py-4 text-sm hidden md:table-cell">{consulta.precio && !isNaN(parseFloat(consulta.precio))? `$${parseFloat(consulta.precio).toLocaleString('es-CL')}`: ''}</td>
                <td className="text-center px-3 py-4 text-sm hidden md:table-cell">{ formatearFecha(consulta.fechaCreacion) || '' } </td>
          
                                     <td className="py-3 pr-3 text-center block sm:hidden">
          <Link to={`/profesional/consulta/${consulta._id}`}  className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-nunito font-semibold mr-1 py-1 px-2 rounded">
            Ver más
          </Link>
        </td>
        
        <td className="hidden sm:table-cell md:border md:border-grey-500 text-center">
          <Link to={`/profesional/consulta/${consulta._id}`}  className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-nunito font-semibold mr-1 py-2 px-2 rounded">
            Ver más
          </Link>
        </td>
        
        <td className="hidden sm:hidden">
          <div className="flex justify-center">
            <Link to={`/profesional/consulta/${consulta._id}`}  className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-nunito font-semibold mr-1 py-1 px-2 rounded">
              Ver más
            </Link>
          </div>
        </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                         </div>
                         </div>
                         </div>
               </div>
               </div>
        :
        <div className="flex justify-center py-10  ">
                  <div className="bg-lila-200 px-10 py-10 rounded-lg">
                  <h1 className="text-2xl text-white">Aún no tienes Consultas Pendientes</h1>
                  </div>
               
        </div>
        
        }
        </div>
        
    }

      </>
  )
}

export default ListaConsultaPendientes