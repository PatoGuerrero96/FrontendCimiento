import { useState, useEffect } from 'react'
import usePreguntasCli from '../../hooks/paciente/usePreguntasCli';
import {  useNavigate} from 'react-router-dom';
const FormularioPreguntasInicio = () => {
    const [ perfil, setPerfil ] = useState({});
    const {auth,actualizarPreguntasSaludgeneral,
        actualizarPreguntasSueño,
        actualizarPreguntasSaludmental,
        actualizarPreguntasDolor,actualizarProcesopreguntas} =  usePreguntasCli()
    const navigate = useNavigate()
  
    useEffect(() => {
      setPerfil(auth)
    
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!perfil.estadogeneralpregunta) {

            Swal.fire('Seleccione una opción antes de enviar su respuesta')
          return;
        }
      
        await actualizarPreguntasSaludgeneral( {
            ...perfil,
            procesopreguntas:'iniciado'
        });
      };
      const guardarSueño = async (e) => {
        e.preventDefault();
        if (!perfil.sueñopregunta) {

            Swal.fire('Seleccione una opción antes de enviar su respuesta')
          return;}
        await actualizarPreguntasSueño( {
            ...perfil,
            procesopreguntas:'iniciado'
        });
      };
      const guardarSaludmental = async (e) => {
        e.preventDefault();
        if (!perfil.saludmentalpregunta) {

            Swal.fire('Seleccione una opción antes de enviar su respuesta')
          return;}     
        await actualizarPreguntasSaludmental( {
            ...perfil,
            procesopreguntas:'iniciado'
        });
        
      };
      const guardarPreguntasdolor = async (e) => {
        e.preventDefault();
        if (!perfil.dolorpregunta) {

            Swal.fire('Seleccione una opción antes de enviar su respuesta')
          return;}     
        await actualizarPreguntasDolor( {
            ...perfil,
            procesopreguntas:'iniciado'
        });
      };
       const handleSubmitNavegacion = async (e) => {
        e.preventDefault();
        await actualizarProcesopreguntas({
          ...perfil,
          procesopreguntas: 'terminado',
          
        });
        navigate('/paciente/consultas');
      };
  return (
    <>
<div>
    <div className='mt-1 mx-auto max-w-3xl grid gap-4 grid-cols-2 md:grid-cols-4'>
    { auth.historiaclinica?.estadogeneral < 6 && auth.historiaclinica?.estadogeneralpregunta ==='Sin datos'
    ? 
<div className=" shadow-lg rounded-xl ">
  <div className=" px-1 rounded-xl bg-lila-100 py-1">

	<p className=" py-2 text-sm text-gray-100 font-semibold">
    ¿Has considerado consultar por tu salud general?
	</p>
    <form onSubmit={handleSubmit}>
    <div className='flex justify-center gap-2'>
        <div>
        <input type="radio" name="estadogeneralpregunta" id="estadogeneralpreguntasi" className="peer hidden border border-gray-200" value='Si'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="estadogeneralpreguntasi"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>Si</label>
        </div>
        <div>
        <input type="radio" name="estadogeneralpregunta" id="estadogeneralpreguntano" className="peer hidden border border-gray-200" value='No'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="estadogeneralpreguntano"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>No</label>
        </div>
        <button>💾</button>
    </div>

</form>
  </div>

</div>
    : ''      
    }

{ auth.historiaclinica?.sueño < 6 && auth.historiaclinica?.sueñopregunta ==='Sin datos'
    ? 
    <div className="shadow-lg rounded-xl ">
  <div className="px-1 rounded-xl bg-lila-100 py-1">

	<p className="py-2 text-sm text-gray-100 font-semibold">
    ¿Has considerado consultar por tu calidad de sueño?
	</p>
    <form onSubmit={guardarSueño}>
    <div className='flex justify-center gap-2'>
        <div>
        <input type="radio" name="sueñopregunta" id="sueñopreguntasi" className="peer hidden border border-gray-200" value='Si'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="sueñopreguntasi"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>Si</label>
        </div>
        <div>
        <input type="radio" name="sueñopregunta" id="sueñopreguntano" className="peer hidden border border-gray-200" value='No'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="sueñopreguntano"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>No</label>
        </div>
        <button>💾</button>
    </div>

</form>
  </div>

</div>
    : ''
 }


{ auth.historiaclinica?.saludmental < 6 && auth.historiaclinica?.saludmentalpregunta ==='Sin datos'
    ? 
    <div className="shadow-lg rounded-xl ">
  <div className="px-1 rounded-xl bg-lila-100 py-1">

	<p className="py-2 text-sm text-gray-100 font-semibold">
    ¿Has considerado consultar por tu salud mental?
	</p>
    <form onSubmit={guardarSaludmental}>
    <div className='flex justify-center gap-2'>
        <div>
        <input type="radio" name="saludmentalpregunta" id="saludmentalpreguntasi" className="peer hidden border border-gray-200" value='Si'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="saludmentalpreguntasi"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>Si</label>
        </div>
        <div>
        <input type="radio" name="saludmentalpregunta" id="saludmentalpreguntano" className="peer hidden border border-gray-200" value='No'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="saludmentalpreguntano"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1   text-center peer-checked:bg-lila-300  peer-checked:text-white"
>No</label>
        </div>
        <button>💾</button>
    </div>

</form>
  </div>

</div>
    : ''
 }

{ auth.historiaclinica?.dolor === 'Si' && auth.historiaclinica?.dolorpregunta ==='Sin datos'
    ? 
    <div className="shadow-lg rounded-xl ">
    <div className="px-1 rounded-xl bg-lila-100 py-1">
  
    <p className="py-2 text-sm text-gray-100 font-semibold">
    ¿Ha considerado consultar por su molestia?
	</p>
    <form onSubmit={guardarPreguntasdolor}>
    <div className='flex justify-center gap-2'>
        <div>
        <input type="radio" name="dolorpregunta" id="dolorpreguntasi" className="peer hidden border border-gray-200" value='Si'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="dolorpreguntasi"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>Si</label>
        </div>
        <div>
        <input type="radio" name="dolorpregunta" id="dolorpreguntano" className="peer hidden border border-gray-200" value='No'
          onChange={ e => setPerfil({
           ...perfil,
           [e.target.name] : e.target.value
         })} />
<label
htmlFor="dolorpreguntano"
className="flex font-nunito text-black justify-center bg-white cursor-pointer select-none rounded-full px-2 py-1    text-center peer-checked:bg-lila-300  peer-checked:text-white"
>No</label>
        </div>
        <button>💾</button>
    </div>

</form>
  </div>

</div>
    : ''
 }

    </div>
    {(auth.historiaclinica?.estadogeneralpregunta === 'Si' ||
  auth.historiaclinica?.dolorpregunta === 'Si' ||
  auth.historiaclinica?.saludmentalpregunta === 'Si' ||
  auth.historiaclinica?.sueñopregunta === 'Si') &&
  auth.historiaclinica?.procesopreguntas === 'iniciado' && (
    <div className="  flex justify-center">
      <div className="px-2 md:px-3 rounded-xl bg-lila-100 py-1 mt-2 shadow-2xl">
        <p className="px-1 py-2 text-base md:text-lg text-gray-100">
          Puedes crear tu consulta aquí
        </p>
        <form onSubmit={handleSubmitNavegacion}>
          <input
            type="radio"
            name="procesopreguntas"
            className="peer hidden border border-gray-200"
            value="terminado"
            checked
            onChange={(e) =>
              setPerfil({
                ...perfil,
                [e.target.name]: e.target.value,
              })
            }
          />
          <div className='flex justify-center'>
          <button   className='bg-lila-300 text-white px-1 py-1 rounded-xl animate-bounce' type="submit">Crear consulta</button>
          </div>
        </form>
      </div>
    </div>
  )}
    </div>
    </>
  )
}

export default FormularioPreguntasInicio