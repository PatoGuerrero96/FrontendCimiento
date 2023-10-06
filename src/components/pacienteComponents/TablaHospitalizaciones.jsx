import React, { useState, useEffect } from 'react';
import clientAxios from '../../config/axios';
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"

const TablaHospitalizaciones = () => {
  const [examenes, setExamenes] = useState([]);

  const {eliminarHospitalizaciones} =  useHistoriaCli()
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }
  useEffect(() => {
    const obtenerExamenes = async() =>{
      try {
        const token = localStorage.getItem('token')
        if(!token) return
  
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }
        const { data } = await clientAxios.get('/pacientes/obtener-hospitalizacion',config)
        setExamenes(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerExamenes()
  }, [examenes]);

  return (
  <div className="flex flex-col px-10">
   <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className="bg-gray-50"> 
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de ingreso</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de salida</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {examenes.map((examen) => (
          <tr key={examen._id}>
            <td  className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-nunito font-medium text-gray-900">
                    {examen.nombre}
                    </div>
                  </div>
                </div>          
              </td>
              <td  className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-nunito font-medium text-gray-900">
                    {formatearFecha(examen.fechaingreso) }
                    </div>
                  </div>
                </div>          
              </td>
              <td  className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-nunito font-medium text-gray-900">
                    { formatearFecha(examen.fechasalida) }
                    </div>
                  </div>
                </div>          
              </td>

            {
            examen.documento?.secure_url.length
            ?
            <td  className="px-6 py-4 whitespace-nowrap">
               <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                     <a href={examen.documento?.secure_url} download="nombre_del_archivo" className="bg-indigo-400 hover:bg-indigo-700 text-white font-nunito font-semibold py-2 px-4 rounded inline-flex items-center">
                     Descargar Examen
                     📥
                      </a>  
                    
                    </div>
                  </div>
                </div>
           </td>

            :
            <td className="px-6 py-4 whitespace-nowrap">
      No se subió archivo
    </td>
            }
                        <td  className="px-6 py-4 whitespace-nowrap">    
            <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-nunito font-medium text-gray-900">
                    <button
  onClick={() => eliminarHospitalizaciones(examen._id)}
  className="flex bg-coral-200 hover:bg-coral-300 text-white text-sm font-nunito font-semibold py-2 px-2 border rounded">
    <h3>Eliminar 🗑️</h3>
  </button>
                    </div>
                  </div>
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
   
    
  );
};

export default TablaHospitalizaciones;