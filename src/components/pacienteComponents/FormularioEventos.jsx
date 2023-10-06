import { useState, useEffect } from 'react';
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"
import Alerta from "../../components/Alerta"
import TablaHospitalizaciones from './TablaHospitalizaciones';
const FormularioEventos = () => {

    const [alerta, setAlerta ]= useState({})
    const {nombre,setNombre,documento,setDocumento,fechaingreso,setFechaingreso,fechasalida,setFechasalida, guardarHospitalizacion,eliminarHospitalizaciones} =  useHistoriaCli()
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!nombre  ||!documento|| !fechaingreso|| !fechasalida) {
        setAlerta({ msg: 'Hay campos vacíos', error: true });
        setTimeout(() => setAlerta({}), 4000);
        return;
      }
      const resultado = await guardarHospitalizacion();
      if (resultado && resultado.error) {
        setAlerta({ msg: 'Error al subir el examen, revise el formato', error: true });
        setTimeout(() => setAlerta({}), 5000);
        return;
      }
      setNombre('');
      setDocumento('');
      setFechaingreso('');
      setFechasalida('');
    };
    const { msg } = alerta
    return (
      <>
<div className='mt-10 px-8'>
  <h1 className='text-4xl text-center text-lila-300 font-bold'>Registra tus hospitalizaciones</h1>
  <div className='flex justify-center'>
    <div className='text-center w-5/12'>
      {msg && <Alerta alerta={alerta} />}
    </div>
  </div>
  <form className="flex items-center py-5" onSubmit={handleSubmit}>
    <div className='w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4'>
      <label className='block font-medium mb-2'>
        Motivo hospitalización:
        <input className='w-full border border-gray-300 p-2 rounded-lg' type="text" placeholder='Nombre o tipo de hospitalización' value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
    </div>
    <div className='w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4'>
      <label className='block font-medium mb-2'>
        Fecha de ingreso:
        <input className='w-full border border-gray-300 p-2 rounded-lg' type="date" value={fechaingreso} onChange={(e) => setFechaingreso(e.target.value)} />
      </label>
    </div>
    <div className='w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4'>
      <label className='block font-medium mb-2'>
        Fecha de egreso:
        <input className='w-full border border-gray-300 p-2 rounded-lg' type="Date" value={fechasalida} onChange={(e) => setFechasalida(e.target.value)} />
      </label>
    </div>
    <div className='w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4'>
      <label className='block font-medium mb-2' htmlFor="documentoh">
        Subir examen {'( foto o pdf)'}:
        <input className='w-full border border-gray-300 p-2 rounded-lg' type="file" id="documento" name="documento" onChange={(e) => setDocumento(e.target.files[0])} />
      </label>
    </div>
    <div className='w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4'>
      <button className="text-white rounded-md text-center bg-lila-200 hover:bg-lila-100 py-1 px-2 mt-3">
        Subir Examen📄
      </button>
    </div>
  </form>
</div>
    <TablaHospitalizaciones/>



      </>
    );
  }
  
export default FormularioEventos;