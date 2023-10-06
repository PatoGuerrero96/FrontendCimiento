import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
export const ModalHora = ({ motivo , onClose }) => {
    const fechaActualChile = dayjs().tz('America/Santiago');
  return (
    <>
    
    <div className={`fixed z-10 top-0 right-4 m-0 w-80 bg-white rounded-md shadow-lg p-4 max-h-2xl h-auto ${motivo ? "" : "hidden"}`}>
    <div className='flex justify-end'>
    <button
    onClick={onClose}
    type="button"
    className="w-2">
    X
  </button>
    </div>
    <h1 className='font-bold text-center'>Horarios disponibles del paciente </h1>
    {motivo.horariopaciente && motivo.horariopaciente.length > 0 ? 
  <div className="grid grid-cols-3 grid-flow-row gap-4 px-1 py-2 mt-4">
    {motivo.horariopaciente.filter((horario) => dayjs(horario.fecha).isSameOrAfter(fechaActualChile, 'day')).map((horario) => (
      <div key={horario._id} className="bg-gray-100 py-2 px-1 text-xs text-gray-800 rounded-md">
        <h4 className="text-xs font-semibold mb-2">{dayjs(horario.fecha).format('DD/MM/YYYY')}</h4>
        <h4 className="text-xs font-regular mb-2">{horario.horarioinicio} <span className='font-bold'>-</span> {horario.horariofin}</h4>
      </div>
    ))}
  </div>
  : <p className=" mt-4">Sin horarios agregados</p>
}

</div>
    </>
  )
}

export default ModalHora