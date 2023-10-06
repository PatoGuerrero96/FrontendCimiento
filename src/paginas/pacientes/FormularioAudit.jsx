import { useState, useEffect } from 'react'
import useHistoriaCli from "../../hooks/paciente/useHistoriaCli"

const FormularioAudit = () => {
    const [ocultarseccion, SetOcultarSeccion] = useState(false)
    const [ perfil, setPerfil ] = useState({});
    const {auth,audit} =   useHistoriaCli()


    useEffect(() => {
        setPerfil(auth)
      
      }, [])

    const handleSubmit = async e =>{
        e.preventDefault()
        await  audit (perfil)
        SetOcultarSeccion(true)
        
       }

  return (
    <>
    <div className='px-10 py-5 bg-teal-600 flex justify-center'>
          <h1 className='text-white'>Formilario Audit</h1>
    </div>
   <div className="max-w-5xl mx-auto px-2 bg-white rounded-md overflow-hidden shadow-md mt-10">
  <form onSubmit={handleSubmit} className="px-6 py-4">
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">1. ¿Con qué frecuencia consume alguna
bebida alcohólica?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntauno" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })} />
          <span className="ml-2 text-gray-700">Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntauno" value="1"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700"> Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntauno" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700"> De 2 a 4 veces al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntauno" value="3"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700"> De 2 a 3 veces a la semana</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntauno" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 o más veces a la semana</span>
        </label>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">2.¿Cuántos TRAGOS de alcohol suele
tomar en un día de consumo normal?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntados" value="0"
            onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700"> 1 ó 2</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntados" value="1"
            onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700"> 3 ó 4</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntados" value="2"
            onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700"> 5 ó 6</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntados" value="3"
            onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700"> 7,8 ó 9</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntados" value="4"
            onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700"> 10 o más</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">3. ¿Con qué frecuencia toma 5 o
más TRAGOS en un solo día?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntatres" value="0"
           onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntatres" value="1"
           onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">1 Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntatres" value="2"
           onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Mensualmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntatres" value="3"
           onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">3 Semanalmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntatres" value="4"
           onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 A diario o casi a diario</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">4. En el curso del último año, ¿Con qué
frecuencia ha sido incapaz de parar de
beber una vez que había empezado?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntacuatro" value="0"
             onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700">0 Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacuatro" value="1"
             onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700">1 Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacuatro" value="2"
             onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700">2 Mensualmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacuatro" value="3"
             onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700">3 Semanalmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacuatro" value="4"
             onChange={ e => setPerfil({
                ...perfil,
                [e.target.name] : e.target.value
              })}/>
          <span className="ml-2 text-gray-700">4 A diario o casi a diario</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">5. En el curso del último año, ¿Con qué
frecuencia no pudo hacer lo que se
esperaba de usted porque había bebido?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntacinco" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacinco" value="1"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">1 Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacinco" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Mensualmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacinco" value="3"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">3 Semanalmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntacinco" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 A diario o casi a diario</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">6. En el curso del último año, ¿Con qué
frecuencia ha necesitado beber en
ayunas para recuperarse después de
haber bebido mucho el día anterior?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntaseis" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaseis" value="1"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">1 Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaseis" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Mensualmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaseis" value="3"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">3 Semanalmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaseis" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 A diario o casi a diario</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">7.  En el curso del último año, ¿Con qué
frecuencia ha tenido remordimientos
o sentimientos de culpa después de
haber bebido?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntasiete" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntasiete" value="1"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">1 Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntasiete" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Mensualmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntasiete" value="3"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">3 Semanalmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntasiete" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 A diario o casi a diario</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">8.  En el curso del último año, ¿Con qué
frecuencia no ha podido recordar lo que
sucedió la noche anterior porque había
estado bebiendo?</p>
      <div className="ml-6">
        <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntaocho" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 Nunca</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaocho" value="1"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">1 Menos de una vez al mes</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaocho" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Mensualmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaocho" value="3"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">3 Semanalmente</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntaocho" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 A diario o casi a diario</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">9. ¿Usted o alguna otra persona ha
resultado herido porque usted había
bebido?</p>
      <div className="ml-6">
      <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntanueve" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 No</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntanueve" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Sí, pero no el curso del último año</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntanueve" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 Sí, el último año</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">10. ¿Algún familiar, amigo, médico o profesional de la salud ha mostrado preocupación por su consumo de bebidas alcohólicas o le han sugerido que deje de beber?  </p>
      <div className="ml-6">
        <label className="inline-flex items-center">
          <input type="radio" className="form-radio text-purple-500" name="preguntadiez" value="0"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">0 No</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntadiez" value="2"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">2 Sí, pero no el curso del último año</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input type="radio" className="form-radio text-purple-500" name="preguntadiez" value="4"
          onChange={ e => setPerfil({
            ...perfil,
            [e.target.name] : e.target.value
          })}/>
          <span className="ml-2 text-gray-700">4 Sí, el último año</span>
        </label>
      </div>
    </div>
    <button className="text-white  rounded-md text-center bg-indigo-400 hover:bg-indigo-600 py-2 px-4  items-center ">
   Guardar💾
  </button>

    </form>
    </div>
 

        </>
  )
}

export default FormularioAudit