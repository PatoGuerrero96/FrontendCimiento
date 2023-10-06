import FormularioCalendario from '../../components/pacienteComponents/FormularioCalendario';
import BigCalendar from '../../components/pacienteComponents/BigCalendar';
const Agenda = () => {
  return (
    <>
    
    <div className="grid grid-cols-1  gap-4">
  <div className="w-full">
  <h1 className='text-4xl text-center font-bold text-lila-300 pb-10 '>Guarda Tu Horario</h1>
    <div className='pb-4 '>
    <h2 className='text-2xl font-regular text-center '>Selecciona aquí tus días disponibles</h2>
    </div>
    <FormularioCalendario/>
  </div>
  <div className="w-full">
    <BigCalendar/>
  </div>
</div>
    </>
  )
}

export default Agenda