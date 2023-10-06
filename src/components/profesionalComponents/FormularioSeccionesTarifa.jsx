import { useEffect,useState } from 'react'
import { ChromePicker } from 'react-color';
import clientAxios from '../../config/axios';
const FormularioSeccionesTarifa = () => {
    const [color, setColor] = useState('#FFFFFF'); 
    const [nombre, setNombre] = useState("");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const handleChangeColor = (newColor) => {
        setColor(newColor.hex);
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const seccion = { nombre, color};
    
        try {
            if (!nombre) {
                Swal.fire('¡Error!', 'Por favor, Agregue un nombre a su categoria', 'error');
                return;
              }
              if (color ==='#FFFFFF') {
                Swal.fire('¡Error!', 'Por favor, Agregue un color', 'error');
                return;
              }
            const tokenPro = localStorage.getItem('tokenPro')
            if(!tokenPro) return
      
            const config={
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenPro}`
            }
            }
          const response = await clientAxios.post("/profesional/crear-seccion-tarifa", seccion, config);
          Swal.fire('¡Perfecto!', 'Sección publicada', 'success');
        } catch (error) {
          console.log(error);
        }
       setNombre('')
       setColor('')
  
      };
      const handleToggleColorPicker = () => {
        setShowColorPicker((prevShowColorPicker) => !prevShowColorPicker);
      };
  return (
    <>
<div className='w-max-2xl mx-auto p-4 rounded-lg bg-lila-200 pb-14  '>
  <form onSubmit={handleSubmit} className="flex flex-col items-start max-w-5xl pb-1 mx-auto gap-1 sm:flex-row sm:justify-start sm:items-center">
    <label className="text-white">Nombre de tu categoría:</label>
    <input
      type="text"
      className="h-12 w-64 border border-1.5 rounded-md border-gray-300 text-gray-900  focus:outline-none focus:border-red-600 focus:border-2 p-3"
      placeholder="Ej: Medicina general"
      value={nombre || ''}
      onChange={(e) => setNombre(e.target.value)}
    />


  <div className="relative">
    <div className='flex justify-center '>
    <label className='p-2 text-white' >Tu color:</label>

  
    <button type="button"
      onClick={handleToggleColorPicker} style={{ backgroundColor: color }} className="w-10 h-10 ml-2 border border-gray-300 rounded-md"></button>
    </div>
    {showColorPicker && (      
      <div className="absolute top-12 right-0 z-10">
        <div className="bg-gray-300 p-2">
          <button
            type="button"
            className="ml-2 mb-1 mt-1 bg-red-500 text-white px-2 py-0.5 rounded-md"
            onClick={handleToggleColorPicker}
          >
            X
          </button>
          <ChromePicker color={color} onChange={handleChangeColor} />
        </div>
      </div>
    )}
  </div>

  <button className="bg-coral-200 hover:bg-coral-100 text-white font-bold text-[15px] rounded-full px-2 py-2">Guardar categoria</button>

</form>

</div>
    
    </>
  )
}

export default FormularioSeccionesTarifa