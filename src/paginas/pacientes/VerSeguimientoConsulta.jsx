import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clientAxios from '../../config/axios';
import useAuth from "../../hooks/useAuth"

const VerSeguimientoConsulta = () => {
  const { id } = useParams();
  const { auth } =  useAuth();
  const [consulta, setConsulta] = useState(null);

  useEffect(() => {
    const obtenerMotivoConsulta = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clientAxios.get(`/pacientes/obtener-una-consulta/${id}`, config);
        setConsulta(data);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerMotivoConsulta();
  }, []);
  function formatearFecha(fecha) {
    const fechaObjeto = new Date(fecha);
    
    // Obtiene los componentes de la fecha
    const dia = fechaObjeto.getUTCDate();
    const mes = fechaObjeto.getUTCMonth() + 1; // Los meses en JavaScript comienzan desde 0
    const anio = fechaObjeto.getUTCFullYear();
  
    // Formatea los componentes de la fecha como cadenas con ceros a la izquierda si es necesario
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    
    // Genera la cadena de fecha en el formato deseado
    const fechaFormateada = `${diaFormateado}/${mesFormateado}/${anio}`;
  
    return fechaFormateada;
  }

  return (
    <>
      {consulta ? (
        <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-3xl font-bold text-lila-300">Seguimiento de la consulta</h1>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <h1 className="text-2xl font-bold">Información de la consulta</h1>
            <div className=" p-2 rounded-lg">
              <p>Fecha de la consulta: {formatearFecha(consulta.fecha)   || ''}</p>
              <p>Mensaje: {consulta.mensaje || ''}</p>
              <p>Horario inicio: {consulta.horarioinicio || ''}</p>
              <p>Horario fin: {consulta.horariofin || ''}</p>
              <p>Motivo de consulta - Título: {consulta.motivoconsulta.titulo || ''}</p>
              <p>Motivo de consulta - Descripción: {consulta.motivoconsulta.descripcion || ''}</p>
              <p>Estado: {consulta.estado || ''}</p>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <h1 className="text-2xl font-bold">Registro del profesional para esta consulta</h1>
            <div className=" p-2 rounded-lg">
              <p>{consulta.registro || ''}</p>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <h1 className="text-2xl font-bold">Impresión diagnóstica</h1>
            <div className=" p-2 rounded-lg">
              <p>{consulta.motivoconsulta.impresiondiagnostica || ''}</p>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <h1 className="text-2xl font-bold">Medidas generales</h1>
            <div className="p-2 rounded-lg">
              <p>{consulta.motivoconsulta.medidasgenerales || ''}</p>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <div className="p-2 rounded-lg">
              <h2 className="text-2xl font-bold">Tratamiento farmacológico registrado para este motivo de consulta</h2>
              {consulta.farmaco && consulta.farmaco.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Horario</th>
                      <th>Dosis</th>
                      <th>Duración</th>
                      <th>Formato</th>
                      <th>Tipo de uso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consulta.farmaco.map((farmacos) => (
                      <tr key={farmacos._id}>
                        <td>{farmacos.nombre}</td>
                        <td>{farmacos.horario}</td>
                        <td>{farmacos.dosis}</td>
                        <td>{farmacos.duracion}</td>
                        <td>{farmacos.formato}</td>
                        <td>{farmacos.tipodeuso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron registros de tratamiento farmacológico</p>
              )}
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <h1 className="text-2xl font-bold">Recetas</h1>
            <div className=" p-2 rounded-lg">
              {consulta.recetas && consulta.recetas.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Tipo de receta</th>
                      <th>Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consulta.recetas.map((receta) => (
                      <tr key={receta._id}>
                        <td>{receta.tipoReceta}</td>
                        <td><a href={receta.documento.secure_url} target="_blank" rel="noopener noreferrer">Descargar</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron registros de recetas</p>
              )}

            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
            <div className=" p-2 rounded-lg">
              <h2 className="text-2xl font-bold">Exámenes solicitados</h2>
              {consulta.examenessolicitado && consulta.examenessolicitado.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Examen</th>
                      <th>Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consulta.examenessolicitado.map((examen) => (
                      <tr key={examen._id}>
                        <td>{examen.opciones.join(',')}</td>
                        <td><a href={examen.documento.secure_url} target="_blank" rel="noopener noreferrer">Descargar</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron registros de exámenes solicitados</p>
              )}
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4 flex">
            <h1 className="text-2xl font-bold">Interconsulta:</h1>
            <div className=" text-xl p-1 rounded-lg">
              <p>
                {consulta.motivoconsulta.interconsulta === 'Si' ? (
                  <>
                    Interconsulta: Propuesta: {consulta.motivoconsulta.propuestainterconsulta || 'Sin datos'} estado: Pendiente
                  </>
                ) : ''}
              </p>
              <p>
                {consulta.motivoconsulta.interconsulta === 'Interconsulta' ? (
                  <>
                    Interconsulta: Si/Propuesta: {consulta.motivoconsulta.especialidades} estado: Aceptada
                  </>
                ) : ''}
              </p>
              <p>
                {consulta.motivoconsulta.interconsulta === 'Sin datos' || consulta.motivoconsulta.interconsulta === 'No' ? 'No' : ''}
              </p>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg my-4">
  <h1 className="text-2xl font-bold">Signos de alarma</h1>
  <div className="p-2 rounded-lg">
    {consulta.motivoconsulta.signosdealarma && consulta.motivoconsulta.signosdealarma.length > 0 ? (
      <ul className="list-disc list-inside">
        {consulta.motivoconsulta.signosdealarma.map((signo, index) => (
          <li key={index} className="text-red-600 font-bold">
            {signo}
          </li>
        ))}
      </ul>
    ) : (
      <p>No hay signos de alarma.</p>
    )}
  </div>
</div>

        </div>
        
      ) : (
        <p className="text-center">Cargando...</p>
      )}
    </>
  );
}

export default VerSeguimientoConsulta;