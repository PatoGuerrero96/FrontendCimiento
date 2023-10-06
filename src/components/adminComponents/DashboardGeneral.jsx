import React, { useEffect, useState } from 'react';
import clientAxios from '../../config/axios';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'moment/locale/es'; // Importa el idioma español de Moment.js
const DashboardGeneral = () => {
    const [pacientes, setPacientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('total'); // Estado del filtro: total, hoy, ultimoMes
  
    useEffect(() => {
      const obtenerPacientes = async () => {
        try {
          const tokenAdm = localStorage.getItem('tokenAdm');
          if (!tokenAdm) return;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenAdm}`,
            },
          };
          const { data } = await clientAxios.get("/admin/modulo-paciente", config);
          setPacientes(data);
        } catch (error) {
          console.log(error);
        }
      };
  
      const obtenerProfesionales = async () => {
        try {
          const tokenAdm = localStorage.getItem('tokenAdm');
          if (!tokenAdm) return;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenAdm}`,
            },
          };
          const { data } = await clientAxios.get("/admin/modulo-profesional", config);
          setProfesionales(data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
  
      obtenerPacientes();
      obtenerProfesionales();
    }, []);
  
    if (loading) {
      return <div>Cargando...</div>;
    }
  
    const obtenerPacientesFiltrados = () => {
      switch (filtro) {
        case 'total':
          return pacientes;
        case 'hoy':
          const fechaHoy = new Date().setHours(0, 0, 0, 0);
          return pacientes.filter(
            (paciente) => new Date(paciente.fecha).setHours(0, 0, 0, 0) === fechaHoy
          );
        case 'ultimoMes':
          const hoy = new Date();
          const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
          return pacientes.filter(
            (paciente) => new Date(paciente.fecha) > ultimoMes
          );
        default:
          return pacientes;
      }
    };
  
    const obtenerProfesionalesFiltrados = () => {
      switch (filtro) {
        case 'total':
          return profesionales;
        case 'hoy':
          const fechaHoy = new Date().setHours(0, 0, 0, 0);
          return profesionales.filter(
            (profesional) => new Date(profesional.fecha).setHours(0, 0, 0, 0) === fechaHoy
          );
        case 'ultimoMes':
          const hoy = new Date();
          const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
          return profesionales.filter(
            (profesional) => new Date(profesional.fecha) > ultimoMes
          );
        default:
          return profesionales;
      }
    };
  
    const pacientesFiltrados = obtenerPacientesFiltrados();
    const cantidadPacientesFiltrados = pacientesFiltrados.length;
  
    const profesionalesFiltrados = obtenerProfesionalesFiltrados();
    const cantidadProfesionalesFiltrados = profesionalesFiltrados.length;
  
    const dataFiltrados = [
      { name: 'Pacientes', value: cantidadPacientesFiltrados },
      { name: 'Profesionales', value: cantidadProfesionalesFiltrados },
    ];
  
    const handleFiltroClick = (filtroSeleccionado) => {
      setFiltro(filtroSeleccionado);
    };
  
    const formatValue = (value) => {
      return parseInt(value);
    };
    const obtenerEvolucionUsuarios = () => {
        const usuariosPorMes = {};
        const fechaActual = new Date();
    
        const meses = [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ];
    
        // Inicializar usuariosPorMes con 0 para cada mes
        meses.forEach((mes) => {
          usuariosPorMes[mes] = 0;
        });
    
        pacientes.forEach((paciente) => {
          const fechaRegistro = new Date(paciente.fecha);
          const mesRegistro = meses[fechaRegistro.getMonth()];
    
          if (fechaRegistro <= fechaActual) {
            usuariosPorMes[mesRegistro] += 1;
          }
        });
    
        profesionales.forEach((profesional) => {
          const fechaRegistro = new Date(profesional.fecha);
          const mesRegistro = meses[fechaRegistro.getMonth()];
    
          if (fechaRegistro <= fechaActual) {
            usuariosPorMes[mesRegistro] += 1;
          }
        });
    
        const evolucionUsuarios = meses.map((mes) => ({
          fecha: mes,
          cantidad: usuariosPorMes[mes],
        }));
    
        return evolucionUsuarios;
      };
    
      const evolucionUsuarios = obtenerEvolucionUsuarios();
    return (
      <>
<div className='bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-1 px-20 py-5 rounded-md'>
  <div className='flex flex-col text-sm'>
    <h2 className='font-bold'>Cantidad Total de Pacientes y Profesionales</h2>
    <div className='flex gap-1'>
      <button className='bg-lila-300 hover:bg-lila-100 text-white px-1 py-1 text-xs rounded-lg' onClick={() => handleFiltroClick('total')}>Registrados en Total</button>
      <button className='bg-lila-300 hover:bg-lila-100 text-white px-1 py-1 text-xs rounded-lg' onClick={() => handleFiltroClick('hoy')}>Registrados Hoy</button>
      <button className='bg-lila-300 hover:bg-lila-100 text-white px-1 py-1 text-xs rounded-lg' onClick={() => handleFiltroClick('ultimoMes')}>Registrados en el Último Mes</button>
    </div>
    <div className='sm:mt-4'>
      <BarChart width={500} height={350} data={dataFiltrados}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis tickFormatter={formatValue} />
        <Tooltip />
        <Bar
          dataKey='value'
          name='Cantidad'
          fill={(bar) => (bar.payload.name === 'Pacientes' ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 71, 0.8)')}
          stroke={(bar) => (bar.payload.name === 'Pacientes' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 71, 1)')}
          strokeWidth={2}
          shape={(bar) => (
            <rect
              fill={(bar.payload.name === 'Pacientes' ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 71, 0.8)')}
              stroke={(bar.payload.name === 'Pacientes' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 71, 1)')}
              strokeWidth={2}
              width={bar.width}
              height={bar.height}
              x={bar.x}
              y={bar.y}
              rx={bar.rx}
              ry={bar.ry}
            />
          )}
        />
      </BarChart>
    </div>
  </div>
  <div className='flex flex-col text-sm'>
    <h2 className='font-bold'>Registro de usuarios por meses</h2>
    <div className='sm:mt-4'>
      <LineChart width={700} height={350} data={evolucionUsuarios}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='fecha' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='cantidad' name='Cantidad de Usuarios registrados por meses' stroke='rgba(75, 11, 222, 1)' />
      </LineChart>
    </div>
  </div>
</div>

      </>
    );
  };
  
  export default DashboardGeneral;