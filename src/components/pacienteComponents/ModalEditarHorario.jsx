import { useState } from 'react';

export const EditarHorarioDisponibleModal = ({  onClose, onSubmit }) => {
  const [fecha, setFecha] = useState("");
  const [horarioinicio, setHorarioInicio] = useState("");
  const [horariofin, setHorarioFin] = useState("");
  const [selectedHorario, setSelectedHorario] = useState(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      fecha,
      horarioinicio: horarioinicio,
      horariofin: horariofin,
    });
    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="fecha">
                  Fecha
                </label>
                <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fecha"
                value={fecha || selectedHorario.fecha}
                onChange={(event) => setFecha(event.target.value)}
            />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="horarioInicio">
                  Hora inicio
                </label>
                <input
                 type="time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="horarioInicio"
                value={horarioinicio || selectedHorario.horarioinicio}
                onChange={(event) => setHorarioInicio(event.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="horarioFin">
                  Hora fin
                </label>
                <input
                type="time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="horarioFin"
                value={horariofin || selectedHorario.horariofin}
                onChange={(event) => setHorarioFin(event.target.value)}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline-blue"
                >
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };