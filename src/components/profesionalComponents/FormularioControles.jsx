import React from 'react'
import { useEffect,useState } from "react";
import clientAxios from "../../config/axios";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import moment from "moment";
import pdfMake from 'pdfmake/build/pdfmake';
 import pdfFonts from './fonts';
 pdfMake.vfs = pdfFonts;
const FormularioControles = ({  pacienteId,consulta, motivoId,profesionalId }) => {

      const [control, setControl] = useState([]);
      const [modalOpen, setModalOpen] = useState(false);
      const [fecha, setFecha] = useState("");
      const [descripcion, setDescripcion] = useState("");
      const [loading, setLoading] = useState(true); 
      const [seccionVisible, setSeccionVisible] = useState(false);
      const fetchData = async () => {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
          try {
            const { data } = await clientAxios.get(`/profesional/obtener-controles-motivo/${motivoId}`, config);
         setControl(data)
         setLoading(false);
          } catch (error) {
            console.log(error);
          }
        };
      useEffect(() => {

            fetchData();
          }, []); 
      const openModal = () => {
        setModalOpen(true);
      };
      
      const closeModal = () => {
        setModalOpen(false);
      };
    

       
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          if (!fecha) {
            Swal.fire('¡Error!', 'Por favor, seleccione una fecha para el control', 'error');
            return;
          }
          if (!descripcion) {
            Swal.fire('¡Error!', 'Por favor, seleccione el motivo del control', 'error');
            return;
          }
          const tokenPro = localStorage.getItem("tokenPro");
          if (!tokenPro) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`,
            },
          };
    
          // Crear el objeto de control a enviar en la solicitud POST
          const control = {
            fecha: fecha,
            descripcion: descripcion,
            pacienteId:pacienteId,
            motivoconsultaId:motivoId,
            profesionalId:profesionalId

          };
    
          // Realizar la solicitud POST al servidor
          const response = await clientAxios.post('/profesional/guardar-control', control,config);
    
          // Mostrar mensaje de éxito
          Swal.fire('¡Éxito!', 'Indicación de control publicada', 'success');
    
          // Restablecer los valores del formulario y cerrar el modal
          fetchData();
          setFecha('');
          setDescripcion('');
          setModalOpen(false);
        } catch (error) {
          console.log(error);
          // Mostrar mensaje de error
          Swal.fire('¡Error!', 'No se pudo enviar la solicitud', 'error');
        }
      };


      const toggleSeccion = () => {
        setSeccionVisible(!seccionVisible);
      };

      


      const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));
  return (
    <>  
    <div className='py-4'>
    <div className="max-w-7xl mx-auto  px-3 py-1 rounded-t flex justify-start">

            <button
              className=" py-2 text-sm rounded-md  text-black "
              onClick={toggleSeccion}
            >
              {seccionVisible ? (
                <div className="flex">
                  <p className="text-sm font-semibold">Indicación de control:  {' '}   {control && control.length > 0 ? ('Sí') : (  'No')} </p>
                  <p className="text-xl">
                    <MdKeyboardArrowDown />
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <p className="text-sm font-semibold">Indicación de control: {' '}   {control && control.length > 0 ? ('Sí') : (  'No')} </p>
                  <p className="text-xl">
                    <MdKeyboardArrowRight />
                  </p>
                </div>
              )}
            </button>
    </div>
   

    {seccionVisible && ( 
      <div className="max-w-7xl mx-auto px-2  bg-gray-50">
      <div className="py-2 "> 

       {loading ? (
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
) : ( 
<div>
  {control && control.length > 0 ? (
    <div>
     <div className='flex justify-end py-2'>
       {showButton && ( <button className=' bg-coral-200 hover:bg-coral-100 px-2 py-2 text-white rounded-md' onClick={openModal}>CREAR INDICACIÓN DE CONTROL </button> )  }     
       </div>
    <ul>
       
      {control.map((item, index) => (
        <li key={index} className="flex items-center border-b border-gray-200 py-4">
<div className="mr-4 flex gap-1">
  {`${index + 1}.- `}
  <span className="font-bold">Fecha del control:</span>
  <span>{item.fecha}</span>
  <span> {'  '} </span>
  <span className="font-bold">Motivo del control:</span>
  <span>{item.descripcion}</span>
</div>
        </li>
      ))}
    </ul>
    </div>
  ) : (
    <div className='flex text-md font-regular mt-2 gap-2'>
    <p className=''> ¿Quieres agregar una indicación de control ?</p>
       {showButton && ( <button className=' ' onClick={openModal}>Si </button> )  }
       {showButton && ( <button className=''onClick={toggleSeccion}>No </button> )  }    
    </div>  
    
  )}
</div>

) }
       </div>
       </div>
    )}
    </div>
    <div>
      <div className={`modal ${modalOpen ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-y-auto`}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="px-10 py-10 modal-container bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="flex justify-end">
              <button className="px-1 py-1 mr-2 text-3xl rounded-md text-red-500 hover:text-red-700" onClick={closeModal}>
                <AiFillCloseCircle />
              </button>
            </div>
            <div>
              {/* Agrega aquí los campos de fecha y descripción del control */}
              <form>
                {/* Campos de fecha y descripción */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
                    Fecha del control
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                    Motivo del control
                  </label>
                  <textarea
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="flex justify-center mt-2">
              <button
                className="bg-lila-300 px-2 py-2 text-white hover:bg-lila-200 rounded-lg"
                type="submit"
                onClick={handleSubmit}
              >
                Subir control
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default FormularioControles