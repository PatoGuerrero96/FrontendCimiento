import React, { useEffect, useState } from 'react';
import clientAxios from '../../config/axios';
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'moment/locale/es'; // Importa el idioma español de Moment.js

const GraficoMotivoConsulta = () => {
  const [motivos, setMotivos] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('total'); 

  useEffect(() => {
    const obtenerMotivos = async () => {
      try {
        const tokenAdm = localStorage.getItem('tokenAdm');
        if (!tokenAdm) return;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenAdm}`,
          },
        };
        const { data } = await clientAxios.get('/admin/grafico-motivoconsulta', config);
        setMotivos(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    const obtenerConsultas = async () => {
        try {
          const tokenAdm = localStorage.getItem('tokenAdm');
          if (!tokenAdm) return;
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenAdm}`,
            },
          };
          const { data } = await clientAxios.get('/admin/grafico-consultas', config);
          setConsultas(data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };

    obtenerMotivos();
    obtenerConsultas();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const obtenermotivosFiltrados = () => {
    switch (filtro) {
      case 'total':
        return motivos;
      case 'hoy':
        const fechaHoy = new Date().setHours(0, 0, 0, 0);
        return motivos.filter(
          (motivo) => new Date(motivo.fecha).setHours(0, 0, 0, 0) === fechaHoy
        );
      case 'ultimoMes':
        const hoy = new Date();
        const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
        return motivos.filter((motivo) => new Date(motivo.fecha) > ultimoMes);
      default:
        return motivos;
    }
  };

  const motivosFiltrados = obtenermotivosFiltrados();
  const cantidadmotivosFiltrados = motivosFiltrados.length;

  const handleFiltroClick = (filtroSeleccionado) => {
    setFiltro(filtroSeleccionado);
  };

  const formatValue = (value) => {
    return parseInt(value);
  };
  const obtenerCantidadConsultasPorEstado = (estado) => {
    return consultas.filter((consulta) => consulta.estado === estado).length;
  };

  const dataConsultasPorEstado = [
    { estado: 'Rechazadas', cantidad: obtenerCantidadConsultasPorEstado('rechazada') },
    { estado: 'Aceptadas', cantidad: obtenerCantidadConsultasPorEstado('pagado') },
    { estado: 'Pendientes', cantidad: obtenerCantidadConsultasPorEstado('pendiente') },
    { estado: 'Finalizadas', cantidad: obtenerCantidadConsultasPorEstado('finalizado') },
  ];

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
  return (
    <>
<div className='bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-1 px-20 py-5 rounded-md'>
  <div className='flex flex-col text-sm'>
    <h2 className='font-bold'>Cantidad Total de Motivos de consulta</h2>
    <div className='flex gap-1'>
      <button className='bg-lila-300 hover:bg-lila-100 text-white px-1 py-1 text-xs rounded-lg' onClick={() => handleFiltroClick('total')}>Registrados en Total</button>
      <button className='bg-lila-300 hover:bg-lila-100 text-white px-1 py-1 text-xs rounded-lg' onClick={() => handleFiltroClick('hoy')}>Registrados Hoy</button>
      <button className='bg-lila-300 hover:bg-lila-100 text-white px-1 py-1 text-xs rounded-lg' onClick={() => handleFiltroClick('ultimoMes')}>Registrados en el Último Mes</button>
    </div>
    <div className='sm:mt-4'>
      <BarChart width={500} height={350} data={[{ name: 'Motivos de consulta', value: cantidadmotivosFiltrados }]}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis tickFormatter={formatValue} />
        <Tooltip />
        <Bar
          dataKey='value'
          name='Cantidad'
          fill='rgba(182, 149, 192, 0.8)' // Color lila
          stroke='rgba(182, 149, 192, 1)' // Color lila
          strokeWidth={2}
          shape={(bar) => (
            <rect
              fill='rgba(182, 149, 192, 0.8)' // Color lila
              stroke='rgba(182, 149, 192, 1)' // Color lila
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
    <h2 className='font-bold'>Cantidad de Consultas por Estado</h2>
    <div className='flex justify-center sm:justify-start'>
      <div className='px-10 sm:self-center'>
        <PieChart width={400} height={400}>
          <Pie
            data={dataConsultasPorEstado}
            dataKey='cantidad'
            nameKey='estado'
            cx='50%'
            cy='50%'
            outerRadius={100}
            fill='#8884d8'
            label={(entry) => entry.estado}
          >
            {dataConsultasPorEstado.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
    <div className=''>
      <ul>
        {dataConsultasPorEstado.map((entry, index) => (
          <li key={index} className=''>
            <span
              className='inline-block w-3 h-3 mr-2'
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            {entry.estado}: {entry.cantidad}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

    </>
  );
};

export default GraficoMotivoConsulta;
