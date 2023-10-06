import React, { useState, useEffect } from 'react';
import clientAxios from '../../config/axios';
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"

const TablaExamenes = () => {
  const [examenes, setExamenes] = useState([]);
  const { eliminarExamenes} =  useHistoriaCli()
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
        const { data } = await clientAxios.get('/pacientes/obtener-examenes',config)
        setExamenes(data)
      } catch (error) {
        console.log(error)
      }
  
    }
    obtenerExamenes()
  }, [examenes]);
  const handleDownload = async (url, filename) => {
    try {
      const response = await clientAxios({
        url: url,
        method: 'GET',
        responseType: 'blob', // Indicar que la respuesta es un archivo binario
      });
  
      // Crear una URL temporal con el archivo recibido
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
  
      // Crear un enlace invisible y hacer clic en él para descargar el archivo
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
  
      // Limpiar la URL temporal creada
      window.URL.revokeObjectURL(fileUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };
  
  // Dentro de tu componente
  const downloadFile = (url, filename) => {
    handleDownload(url, filename);
  };
  
  return (
    <div className='flex justify-center'>
<div className="flex flex-col lg:px-10 sm:px-1">

  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block max-w-6xl sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col"  className="  lg:text-lg lg:px-10 sm:px-6  text-left text-xs font-medium text-gray-500"> Nombre del examen</th>
              <th scope="col" className="  lg:text-lg lg:px-10 sm:px-6  text-left text-xs font-medium text-gray-500 ">Enfermedad</th>
              <th scope="col" className="  lg:text-lg lg:px-10 sm:px-6  text-left text-xs font-medium text-gray-500 ">Antecedente Quirúrgico</th>
              <th scope="col" className=" lg:text-lg lg:px-10 sm:px-6  text-left text-xs font-medium text-gray-500 "> Documento </th>
              <th scope="col" className=" lg:text-lg lg:px-10 sm:px-6  text-left text-xs font-medium text-gray-500 ">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {examenes
              .filter((examen) => examen.estado === true)
              .map((examen) => (
                <tr key={examen._id}>
                  <td className="lg:px-6 lg:py-4">
                    <div className="flex items-center">
                      <div className="">
                        <div className="text-sm font-nunito font-medium text-gray-900">
                          {examen.nombre}
                        </div>
                      </div>
                    </div>
                  </td>
            
                  <td className="lg:px-6 lg:py-4 ">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-nunito font-medium text-gray-900">
                          {examen.enfermedad
                            ? examen.enfermedad.nombre
                            : "Sin enfermedad asociada"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="lg:px-6 lg:py-4 ">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-nunito font-medium text-gray-900">
                          {examen.quirurgico
                            ? examen.quirurgico.nombre
                            : "Sin Antecedente quirúrgico"}
                        </div>
                      </div>
                    </div>
                  </td>
                  {examen.documento?.secure_url.length ? (
  <td className="lg:px-6 lg:py-4">
    <div className="flex items-center">
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          <button
            onClick={() =>
              downloadFile(examen.documento?.secure_url, `${examen.nombre}.pdf`)
            }
            className="bg-lila-200 hover:bg-lila-100 text-white text-sm font-nunito font-semibold lg:py-2 lg:px-4 rounded inline-flex items-center"
          >
            Descargar Examen 📥
          </button>
        </div>
      </div>
    </div>
  </td>
) : (
  <td className="lg:px-6 lg:py-4">No se subió archivo</td>
)}
                  <td className="lg:px-6 lg:py-4 ">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-nunito font-medium text-gray-900">
                          <button
                            onClick={() => eliminarExamenes(examen._id)}
                            className="flex bg-coral-200 hover:bg-coral-300 text-white text-sm font-nunito font-semibold lg:py-2 lg:px-2 border rounded"
                          >
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
</div>
   
    
  );
};

export default TablaExamenes;