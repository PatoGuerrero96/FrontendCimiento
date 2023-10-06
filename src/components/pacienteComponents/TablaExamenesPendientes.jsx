import React, { useState, useEffect } from 'react';
import clientAxios from '../../config/axios';
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
const TablaExamenesPendientes = () => {
  const [examenes, setExamenes] = useState([]);
  const { eliminarExamenes} =  useHistoriaCli()
  const [showModal, setShowModal] = useState(false);
const [selectedExamen, setSelectedExamen] = useState(null);
const [documento, setDocumento] = useState(null);
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
  }, []);
  const handleSubirArchivo = (examen) => {
    setSelectedExamen(examen);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedExamen(null);
    setShowModal(false);
    setDocumento(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!documento) {
      Swal.fire('¡Error!', 'Seleccione un documento', 'error');
      return;
    }

    if (documento.type !== "application/pdf") {
      Swal.fire('¡Error!', 'Por favor, Revise el formato de su documento', 'error');
      return;
    }
    const formData = new FormData();
    formData.append("documento", documento);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      };

      const response = await clientAxios.put(`/pacientes/actualizar-examen-pendiente/${selectedExamen._id}`, formData, config);
      Swal.fire('¡Perfecto!', 'Su examen fue subido con éxito', 'success');
      handleCloseModal();
    } catch (error) {
      console.log(error);
      Swal.fire('¡Error!', 'No se pudo subir el documento', 'error');
    }
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
              <th
                scope="col"
                className="   lg:text-lg lg:px-10 sm:px-6  text-left text-xs font-medium text-gray-500 "
              >
                Nombre del examen
              </th>
              <th
                scope="col"
                className="  lg:text-lg lg:px-10 sm:px-6  lg:py-0 sm:py-2 text-left text-xs font-medium text-gray-500 "
              >
                Enfermedad
              </th>
              <th scope="col"className=" lg:text-lg lg:px-10 sm:px-6   lg:py-0 sm:py-2 text-left text-xs font-medium text-gray-500 ">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {examenes
              .filter((examen) => examen.estado === false)
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
                        <button
                            className="flex bg-lila-200 hover:bg-lila-100 text-white text-sm font-nunito font-semibold lg:py-2 lg:px-2 border rounded"
                            onClick={() => handleSubirArchivo(examen)}>
                            <h3>Subir Examen</h3>
                        </button>
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
{showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white rounded-lg px-4 py-6">
            <h2 className="text-xl font-bold mb-4">Subir Examen</h2>
            <form onSubmit={handleFormSubmit}>
              <label className='block font-medium mb-2' htmlFor="documento">
                Subir examen:
                <input
                  className='w-full border border-gray-300 p-2 rounded-lg'
                  type="file"
                  id="documento"
                  name="documento"
                  accept=".pdf"
                  onChange={(e) => setDocumento(e.target.files[0])}
                />
              </label>
              <button
                className="text-white rounded-md text-center bg-lila-200 hover:bg-lila-100 py-2 px-3"
                type="submit"
              >
                Subir Examen📄
              </button>
              <button
                className="text-white rounded-md text-center bg-red-500 hover:bg-red-400 py-2 px-3 ml-2"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
</div>

   
    
  );
};

export default TablaExamenesPendientes;