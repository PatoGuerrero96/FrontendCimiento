import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import clientAxios from "../../config/axios";
import moment from "moment";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { RxMagnifyingGlass } from "react-icons/rx";
import { Paginacion } from "../Paginacion";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { IoMdCloseCircle} from "react-icons/io";
import pdfMake from 'pdfmake/build/pdfmake';
 import pdfFonts from './fonts';
 pdfMake.vfs = pdfFonts;
const FormularioIndicaciones = () => {
  const [consulta, setConsulta] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);
  const [loadingEnfermedades, setLoadingEnfermedades] = useState(true);
  const { id } = useParams();
  const [datosPacienteMotivo, setDatosPacienteMotivo] = useState({});
  const [datosPacienteconsulta, setDatosPacienteconsulta] = useState({});
  const [loading, setLoading] = useState(true);
  const [datosCargados, setDatosCargados] = useState(false);
  const [seccionVisibleFarmaco, setSeccionVisibleFarmaco] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recetamodalVisible, setRecetamodalvisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(3);
  const [datosPacientefarmaco, setDatosPacientefarmaco] = useState({});
  const [ocultarFarmaco, setOcultarFarmaco] = useState({});
  const [mostrarFormularioFarmaco, setMostrarFormularioFarmaco] = useState(false);
  const [farmacoActualId, setFarmacoActualId] = useState(null)
  const [nombrefarmaco, setNombreFarmaco] = useState('');
  const [horario, setHorario] = useState('');
  const [dosis, setDosis] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipodeuso, setTipodeuso] = useState('');
  const [duracion, setDuracion] = useState('');
  const [formato, setFormato] = useState('');
  const [farmacoId, setFarmacoId] = useState('');
  const [farmacosSeleccionados, setFarmacosSeleccionados] = useState([]);

  const maximo = Math.ceil(medidas.length / porPagina);
  useEffect(() => {
    const tokenPro = localStorage.getItem("tokenPro");
    if (!tokenPro) return;
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`,
      },
    };
  
    const ObtenerEnfermedades = async () => {
      try {
        const { data } = await clientAxios.get(
          `/profesional/obtener-enfermedades`,
          config
        );
  
        if (consulta && consulta.paciente) {
          const enfermedadesFiltradas = data.filter(
            (enfermedad) => consulta.paciente._id === enfermedad.paciente
          );
          setEnfermedades(enfermedadesFiltradas);
          setLoadingEnfermedades(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    ObtenerEnfermedades();
  }, [consulta]);
  const togglefar = (farmacoId) => {
    setOcultarFarmaco((prevOcultarEnfermedad) => ({
      ...prevOcultarEnfermedad,
      [farmacoId]: !prevOcultarEnfermedad[farmacoId]
    }));
  };
  const toggleFarmaco = (farmacoId) => {
    if (farmacosSeleccionados.includes(farmacoId)) {
      const updatedFarmacos = farmacosSeleccionados.filter(
        (id) => id !== farmacoId
      );
      setFarmacosSeleccionados(updatedFarmacos);
    } else {
      setFarmacosSeleccionados([...farmacosSeleccionados, farmacoId]);
    }
  };
  const cerrarModalFarmaco = () => {
    setMostrarFormularioFarmaco(false);
  };
    const VerFormularioCerradofar = () => {
  setMostrarFormularioFarmaco(!mostrarFormularioFarmaco);
};
useEffect(() => {
  if (consulta && Array.isArray(consulta.farmaco)) {
    setDatosPacientefarmaco(consulta.farmaco);
  }
}, [consulta]);
const actualizarPacienteFar = async () => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro || !farmacoActualId) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };

    try {
      const enfermedad = datosPacientefarmaco[farmacoActualId];

      await clientAxios.put(`/profesional/editar-farmacos-paciente/${enfermedad._id}`, enfermedad, config);

      // Obtener los datos actualizados después de la actualización
      fetchData();
      
    } catch (error) {
      console.error(error.message);
  }
};
const GuardarFarmaco = async (e) => {
  e.preventDefault();

  try {
    if (!nombrefarmaco) {
      Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el farmaco', 'error');
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

    await clientAxios.post('/profesional/agregar-farmaco-motivo', {
      enfermedad: farmacoId,
      nombre:nombrefarmaco,
      horario,
      dosis,
      duracion,
      formato,
      tipo,
      tipodeuso,
      pacienteId: consulta.paciente._id,
      motivoId: consulta.motivoconsulta._id
    },config);
    const { data } = await clientAxios.get(
      `/profesional/informacion-paciente-consulta/${id}`,
      config
    );

    setConsulta(data);
    setDatosPacienteconsulta(data.farmaco);
    fetchData();
    setNombreFarmaco('');
    setHorario('');
    setDosis('');
    setDuracion('');
    setFormato('');
    setTipo('')
    setTipodeuso('')
    setFarmacoId({});
    setMostrarFormularioFarmaco(false)
    // Mostrar mensaje de éxito o redireccionar a otra página
    Swal.fire('¡Perfecto!', 'Farmaco actualizado con éxito', 'success');
  } catch (error) {o
    console.log(error);
    // Mostrar mensaje de error
    Swal.fire('¡Error!', 'No se puede guardar el farmaco', 'error');
  }
};

const handleChangefarmaco = (e, farmacoId) => {
  const { name, value } = e.target;
  setDatosPacientefarmaco((prevState) => ({
    ...prevState,
    [farmacoId]: {
      ...prevState[farmacoId],
      [name]: value
    }
  }));
  setFarmacoActualId(farmacoId); // Establecer el ID de la enfermedad actual
};
const openModal = () => {
  setRecetamodalvisible(true);
};
const closeModal = () => {
  setRecetamodalvisible(false);
  setFarmacosSeleccionados([''])
};
  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModalFar = () => {
    setModalVisible(false);
    setSearchValue('');
  };
  const motivoConsultaId = datosPacienteconsulta.motivoconsulta?._id;

  const ObtenerMedidasGenerales = async () => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };

    try {
      const { data } = await clientAxios.get(`/profesional/obtener-medidasgenerales`, config);
      setMedidas(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ObtenerMedidasGenerales();
  }, []);

  const medidasfiltradas = medidas.filter(me =>
    me.titulo.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
    me.tag.toString().toLowerCase().includes(searchValue.toLowerCase())
  );

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
      const { data } = await clientAxios.get(`/profesional/informacion-paciente-consulta/${id}`, config);
      setConsulta(data);
      setLoading(false);
      setDatosCargados(true); // Indicar que los datos se han cargado correctamente
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (consulta.motivoconsulta) {
      setDatosPacienteMotivo(consulta.motivoconsulta);
    }
  }, [consulta.motivoconsulta]);
  useEffect(() => {
    if (consulta) {
      setDatosPacienteconsulta(consulta);
    }
  }, [consulta]);
  const actualizarMotivoFar = async () => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };

    try {
      await clientAxios.put(`/profesional/actualizar-motivo-ficha/${datosPacienteMotivo._id}`, datosPacienteMotivo, config);
    } catch (error) {
      console.error(error.message);
      // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
    }
  };

  const Actualizacionmodo = (e) => {
    const { name, value } = e.target;
    setDatosPacienteMotivo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const guardarDatos = async () => {
    const confirmar = await Swal.fire({
      title: '¿Quieres actualizar la información de la consulta?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#5d5ddb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  
    if (confirmar) {
      try {
        actualizarPacienteFar();
        actualizarMotivoFar();

        Swal.fire('¡Perfecto!', 'Sección publicada', 'success');
      } catch (error) {
        Swal.fire('Error', 'Ha ocurrido un error', 'error');
        console.error(error);
      }
    }
  };

  const now = moment();
  const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));

  const toggleSeccionVisibleFar = () => {
    setSeccionVisibleFarmaco(!seccionVisibleFarmaco);
  };

  const copiarAlPortapapeles = (descripcion, titulo) => {
    navigator.clipboard.writeText(descripcion)
      .then(() => {
        const toastMixin = Swal.mixin({
          toast: true,
          icon: 'success',
          title: `Medida general sobre: "${titulo}" copiada con éxito`,
          animation: false,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

        toastMixin.fire();
      })
      .catch((error) => {
        console.error('Error al copiar al portapapeles:', error);
        Swal.fire('¡Error!', 'Ocurrió un error al copiar la descripción', 'error');
      });
  };
  const imageUrl = 'https://res.cloudinary.com/dde62spnz/image/upload/v1687451263/Imagenes%20sitio/kisspng-digital-signature-clip-art-signature-5b0840d4458ca4.5304199015272675402849_a47lug.png';

  async function fetchImageAsBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  const generarReceta = async () => {
    try {

      // Obtener los datos de los farmacos seleccionados a partir de los IDs
      const farmacosSeleccionadosData = Object.keys(datosPacientefarmaco)
        .filter((farmacoId) => {
          const farmaco = datosPacientefarmaco[farmacoId];
          return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
        })
        .filter((farmacoId) => farmacosSeleccionados.includes(farmacoId))
        .map((farmacoId) => datosPacientefarmaco[farmacoId]);
      // Generar el contenido del PDF a partir de los datos de los farmacos seleccionados
      const content = farmacosSeleccionadosData.map((farmaco) => {
        return `  ${farmaco.nombre  ||''}   ${farmaco.horario ||''} ${farmaco.dosis||''} ${farmaco.tipodeuso||''} ${farmaco.duracion||''}  ${farmaco.formato||''}`;
      });
      
      if (farmacosSeleccionadosData.length === 0) {
        // Si no se ha seleccionado ningún fármaco, mostrar un mensaje de error o realizar la acción que desees
        Swal.fire('¡Error!', 'Por favor, Seleccione farmacos para generar la receta', 'error');
        return;
      }

  // Obtener la imagen de Cloudinary como base64
  const base64Image = await fetchImageAsBase64(imageUrl);
    
  // Crear el documento PDF
  const documentDefinition = {
    content: [
      { text: 'RECETA MÉDICA', style: 'header' },
      '\n', // Salto de línea
      {
        stack: [
          content // Contenido de la receta
        ],
        width: '100%', // Ancho del stack es 100% del espacio disponible
        alignment: 'justify' // Alinear el contenido de manera justificada
      },
      {
        image: base64Image,
        width: 100, // Ajustar el tamaño de la imagen según tus necesidades
        alignment: 'right'
      },
      {
        text: 'Firma Digital',
        alignment: 'right',
        margin: [0, 5, 0, 0] // Márgenes [arriba, izquierda, abajo, derecha]
      },
      // Resto de las imágenes en el documento
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10] // Márgenes [arriba, izquierda, abajo, derecha]
      }
    },
    pageBackground: { fillColor: 'transparent' },
    images: {
      // Resto de las imágenes definidas en el documento
    }
  };
  
  

      // Generar el PDF a partir del documento definido
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      // Obtener el blob del PDF generado
      pdfDocGenerator.getBlob(async (blob) => {

        const confirmar = await Swal.fire({
          title: ` ¿Estas seguro de generar esta receta?` ,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#5d5ddb',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar'
        }).then((result) => {
          if (result.isConfirmed) {
            return true;
          } else {
            return false;
          }
        });
        if (confirmar) {

        try {
          // Crear un FormData y agregar el PDF con el nombre 'documento'
          const formData = new FormData();
          formData.append('documento', blob, 'documento.pdf');
  
          // Realizar la petición a tu backend utilizando Axios
          const tokenPro = localStorage.getItem('tokenPro');
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${tokenPro}`,
            }
          };
          const response = await clientAxios.post('/profesional/guardar-receta', formData, config);
          // Manejar la respuesta del backend si es necesario
          Swal.fire('¡Perfecto!', 'La receta fue creada y enviada por correo', 'success');
          setRecetamodalvisible(false)
          setFarmacosSeleccionados([''])
        } catch (error) {
          // Manejar el error en caso de fallo al subir el PDF al backend
          console.log(error);
        }
      }
      });
    } catch (error) {
      // Manejar el error en caso de fallo al generar el PDF
      console.log(error);
    }
  };
  

  return (
    <>
      {loading || !datosCargados ? (
        <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
      ) : (
        <div className="">
          <div className="max-w-7xl mx-auto bg-lila-300 px-3 py-1 rounded-t flex justify-start">
            <button
              className=" py-2 text-sm rounded-md  text-white "
              onClick={toggleSeccionVisibleFar}
            >
              {seccionVisibleFarmaco ? (
                <div className="flex">
                  <p className="text-sm font-semibold">Indicaciones </p>
                  <p className="text-xl">
                    <MdKeyboardArrowDown />
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <p className="text-sm font-semibold">Indicaciones</p>
                  <p className="text-xl">
                    <MdKeyboardArrowRight />
                  </p>
                </div>
              )}
            </button>
          </div>
          {seccionVisibleFarmaco && (
            <div className="max-w-7xl mx-auto px-2 border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50">
              <div className="py-2 ">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-1">
                  <div className="flex flex-col text-sm">
                    <div className="flex justify-end">
                      <button className="px-1 py-1 text-xs rounded-md text-center flex text-white bg-lila-200 hover:bg-lila-100" onClick={abrirModal}>
                        Buscar medidas generales <RxMagnifyingGlass className=" text-xl" />
                      </button>
                    </div>

                    <label htmlFor="medidasgenerales" className="text-sm font-regular">Medidas generales</label>

                    <textarea
  className="w-full h-44 p-3 bg-white border rounded border-gray-300  resize-none outline-none focus:border-indigo-500"
  placeholder="Escribe aquí las medidas generales para el motivo de consulta del paciente..."
  type="text"
  name="medidasgenerales"
  value={datosPacienteMotivo.medidasgenerales || ''}
  onChange={Actualizacionmodo}
></textarea>
                  </div>
                </div>
                {modalVisible && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
                    <div className="bg-white w-1/1 md:w-1/2 p-4 rounded-md shadow-md border border-gray-300">
                      <div className="flex justify-end ">
                        <button
                          className="px-1 py-1 mr-2 text-2xl rounded-md text-red-500 hover:text-red-700"
                          onClick={cerrarModalFar}
                        >
                          <AiFillCloseCircle />
                        </button>
                      </div>
                      <h2 className="text-md font-semibold text-center ">Buscar Medidas Generales</h2>
                      <div className="flex justify-end px-1 py-1 ">
                        <label htmlFor="orden" className="mr-2 text-md font-semibold">Buscar:</label>
                        <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Buscar medidas generales" className="p-1 border rounded-md w-52 placeholder:text-sm" />

                      </div>
                      <div className="divide-y divide-gray-300 ">
                        {medidasfiltradas.slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina).map((me) => (
                          <div key={me._id} className="py-2 cursor-pointer hover:bg-gray-100" onClick={() => copiarAlPortapapeles(me.descripcion, me.titulo)}>
                            <div className="flex justify-end ">
                              <button className="px-4 py-2 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100" onClick={() => copiarAlPortapapeles(me.descripcion, me.titulo)}>
                                <FaCopy />
                              </button>
                            </div>
                            <p className=" text-center text-sm font-semibold">{me.titulo || ''}</p>
                            <p className="text-xs bg-gray-100 px-2 p-1">{me.descripcion || ''}</p>
                            <div className=" flex "> <p className="text-sm font-bold  ">Tags: </p>  <p className="font-regular text-sm text-indigo-800 bg-indigo-100 rounded ml-1"> {' '}{me.tag || ''}</p></div>
                            <hr />
                          </div>
                        ))}
                      </div>
                      <Paginacion
                        maximo={maximo}
                        pagina={pagina}
                        setPagina={setPagina}
                      />
                    </div>
                  </div>
                )}
              </div>
                      <div className="text-center font-semibold">
              FARMACOS ASIGNADOS PARA ESTE MOTIVO DE CONSULTA
            </div>
              <div className=" flex justify-end">
            {showButton && (
    <button
      onClick={VerFormularioCerradofar}
      className="text-sm rounded-xl px-2 focus:outline-none focus:border-lila-200 text-white bg-lila-100 hover:bg-lila-100 hover:text-lila-200"
    >
      {mostrarFormularioFarmaco ? (
        <div className="flex">
          <IoMdCloseCircle className="text-2xl" />
        </div>
      ) : (
        <div className="flex">
          Agregar farmaco<MdAddCircle className="text-2xl" />
        </div>
      )}
    </button>
  )}

            </div>

              { Object.keys(datosPacientefarmaco)
  .filter((farmacoId) => {
    const farmaco = datosPacientefarmaco[farmacoId];
    return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
  })
  .map((farmacoId, index) => {
    const numeroEnumeracion = index + 1;
    const isEnfermedadOculta = ocultarFarmaco[farmacoId] || false;
    const farmaco = datosPacientefarmaco[farmacoId];
  return (
    <div className=" bg-gray-50 " key={farmacoId}>
<div className="" >
  <div className="container mx-auto p-1">
  <div className="grid grid-cols-2 items-center  ">
  <div className="flex justify-start gap-2 ">
    <div className="">
    <h2 className="text-md font-semibold">{numeroEnumeracion}.-</h2>
    </div>
    <div>
    <h2 className="text-md font-regular">
    {farmaco.nombre}
    </h2>
      </div>
      <div>

      </div>
    <div>

    <button
      className="text-blue-500 focus:outline-none"
      onClick={() => togglefar(farmacoId)}
    >
      {isEnfermedadOculta ? (
        <p className="text-3xl">< MdKeyboardArrowDown/></p>
      ) : (
        <p className="text-3xl"><MdKeyboardArrowRight /></p>
      )}
    </button>
    </div>


  </div>


</div>
        {isEnfermedadOculta && (
          <>
   {showButton ? (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
    <div className="flex flex-col text-sm">
    <div className="flex">
    <label htmlFor="nombre">Nombre del farmaco:</label>
    </div>
    <input
      key={farmacoId}
      type="text"
      className={`border px-2 py-1.5 rounded-lg  flex-grow ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
      name="nombre"
      placeholder="Nombre exacto del diagnóstico"
      value={farmaco.nombre || ''}
      onChange={(e) => handleChangefarmaco(e, farmacoId)}
    />

  </div>
  <div className="flex flex-col text-sm">
  <label htmlFor="horario" className=" ">Hora de consumo</label>
    <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        placeholder="Ej:Consumir cada 8 Horas"
        name="horario"
        value={farmaco.horario || ''}
        onChange={(e) => handleChangefarmaco(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col  text-sm">
    <div className="flex">
      <label htmlFor="dosis" className="">Dosis</label>
    </div>
      <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="dosis"
        placeholder="Ej: 800 ml"
        value={farmaco.dosis || ''}
        onChange={(e) => handleChangefarmaco(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col  text-sm">
      <div className="flex">
      <label htmlFor="dosis" className="">Tipo de uso</label>
      </div>
      <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="tipodeuso"
        placeholder="Ej: Solo en episodios de dolor"
        value={farmaco.tipodeuso || ''}
        onChange={(e) =>handleChangefarmaco(e, farmacoId)}
      />
    </div>


      </div>
      ) : (
        <div className="flex flex-col text-sm gap-1">
        <div className="flex items-center  gap-1">
          <label htmlFor="nombre" className="font-bold">Nombre del farmaco:</label>
          <label>{farmaco.nombre||''}  </label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="ultimocontrol" className="font-bold">
            Hora de consumo:
          </label>
          <label>{farmaco.horario||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="tratamiento" className="font-bold">
              Dosis:
          </label>
          <label >{farmaco.dosis||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="obsdiagnostico" className="font-bold">
          Tipo de uso:
          </label>
          <label>{farmaco.tipodeuso||''}</label>
        </div>
      </div>
    )}
       {showButton ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
    <div className="flex flex-col text-sm">
    <div className="flex">
    <label htmlFor="duracion" className="">Duración</label>
    </div>
    <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="duracion"
        placeholder="Ej: Durante 6 días"
        value={farmaco.duracion || ''}
        onChange={(e) =>  handleChangefarmaco(e, farmacoId)}
      />

  </div>
  <div className="flex flex-col text-sm">
  <label htmlFor="formato" className="">Tipo de presentación</label>     
  <input
        key={farmacoId}
        type="text"
        className={`border  px-2 py-1 rounded-lg w-full ${farmaco.guardadoporpaciente ? 'text-gray-600' : 'text-black'}`}
        name="formato"
        placeholder="Ej: Tabletas"
        value={farmaco.formato || ''}
        onChange={(e) => handleChangefarmaco(e, farmacoId)}
      />
    </div>
    <div className="flex flex-col text-sm">
  <label htmlFor="enfermedad" className="">Asociar a</label>
  {loadingEnfermedades ? (
    <span>Cargando...</span>
  ) : (
    <select
      className="border  px-2 py-1 rounded-lg w-full"
      name="enfermedad"
      value={farmaco.enfermedad || ''}
      onChange={(e) => handleChangefarmaco(e, farmacoId)}
    >
      <option value={null}>Sin enfermedad</option>
      {enfermedades.map((enfermedad) => (
        <option key={enfermedad._id} value={enfermedad._id}>{enfermedad.nombre}</option>
      ))}
    </select>
  )}
</div>
      </div>
      ) : (
        <div className="flex flex-col text-sm gap-1">
        <div className="flex items-center  gap-1">
          <label htmlFor="nombre" className="font-bold">Duración:</label>
          <label>{farmaco.duracion||''}  </label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="ultimocontrol" className="font-bold">
          Tipo de presentación:
          </label>
          <label>{farmaco.formato||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="tratamiento" className="font-bold">
          Tipo de tratamiento:
          </label>
          <label >{farmaco.tipo||''}</label>
        </div>
        <div className="flex items-center  gap-1">
          <label htmlFor="obsdiagnostico" className="font-bold">
          Enfermedad asociada:
          </label>
          <label>{farmaco.enfermedad||''}</label>
        </div>
      </div>
    )}
      </>
        )}
  </div>
</div>
<hr />
</div>


);
})}
    <div className="max-w-7xl mx-auto bg-gray-50 px-2 py-1 rounded-b">
                {showButton && (
                  <div className="flex justify-center mt-2 ">
                    <button
                      className='px-4 py-3 text-sm rounded-md text-center mb-2 text-white bg-lila-200 hover:bg-lila-100'
                      onClick={guardarDatos}
                    >
                     Guardar
                    </button>
                  </div>
                )}
              </div>
<div className="py-2">
<button className="bg-lila-200 text-white px-2 py-1 rounded " onClick={openModal}>Crear receta 📄</button>
</div>
{recetamodalVisible && (
   <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
   <div className="bg-white w-1/1 md:w-1/2 p-4 rounded-md shadow-md border border-gray-300">
     <div className="flex justify-end ">
       <button
         className="px-1 py-1 mr-2 text-2xl rounded-md text-red-500 hover:text-red-700"
         onClick={closeModal}
       >
         <AiFillCloseCircle />
       </button>
     </div>
     <h2 className="text-md font-semibold text-center ">Seleccione farmacos para generar la receta</h2>
     <div>
     {Object.keys(datosPacientefarmaco)
    .filter((farmacoId) => {
      const farmaco = datosPacientefarmaco[farmacoId];
      return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
    })
    .map((farmacoId) => {
      const farmaco = datosPacientefarmaco[farmacoId];
      return (
        <div className="flex bg-gray-100" key={farmacoId}>
          <input
            type="checkbox"
            checked={farmacosSeleccionados.includes(farmacoId)}
            onChange={() => toggleFarmaco(farmacoId)}
          />
          <div className="flex gap-1 ">
          <p>{farmaco.nombre ||''}</p>
          <p>{farmaco.horario||''}</p>
          <p>{farmaco.dosis||''}</p>
          <p>{farmaco.tipodeuso||''}</p>
          <p>{farmaco.duracion||''}</p>
          <p>{farmaco.formato||''}</p>
          </div>
        </div>
      );
    })}
 <button className="bg-lila-300 text-white px-2 py-2 rounded mt-2" onClick={generarReceta}>Generar receta</button>

   </div>
 </div>
 
 </div>
   )}
   
            </div>
          )}
        </div>
      )}
            {mostrarFormularioFarmaco && (
  <div className="fixed inset-0 flex  items-center justify-center z-50">
    <div
      className="bg-gray-800 bg-opacity-75  absolute inset-0 pointer-events-none"
      onClick={cerrarModalFarmaco}
    ></div>
    <div className="bg-white rounded-lg p-6 relative w-96 ">
      <button onClick={cerrarModalFarmaco} className="absolute top-0 right-0 p-2 ">
      < IoMdCloseCircle className="text-3xl text-lila-300  hover:text-lila-100 "/>
      </button>

      <form className="p-2 " onSubmit={GuardarFarmaco}>
    <h1 className=" text-center text-xl font-bold p-2">Nuevo farmaco</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className="mb-2 ">Nombre del farmaco</label>
        <input
  type="text"
  className="border px-4 py-2 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Nombre exacto del diagnóstico"
  value={nombrefarmaco}
  onChange={(e) => setNombreFarmaco(e.target.value)} 
/>
    </div>
    <div className="flex flex-col text-sm">
        <label htmlFor="horario"className=" ">Hora de consumo:</label>
        <input
  type="text" 
  id="horario"
  placeholder="Ej:Consumir cada 8 Horas"
  className="border  px-2 py-1 rounded-lg w-full "
  value={horario}
  onChange={(e) => setHorario(e.target.value)}
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="dosis"className="">Dosis:</label>
        <input
  type="text" 
  id="dosis"
  placeholder="Ej: 800 ml"
  className="border  px-2 py-1 rounded-lg w-full "
  value={dosis}
  onChange={(e) => setDosis(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="tipodeuso"className="">Tipo de uso:</label>
        <input
  type="text" 
  id="tipodeuso"
  placeholder="Ej:Solo en episodios de dolor"
  className="border  px-2 py-1 rounded-lg w-full "
  value={tipodeuso}
  onChange={(e) => setTipodeuso(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="duracion" className="">Duración:</label>
        <input
          type="text"
          id="duracion"
          placeholder="Ej: Durante 6 días"
          className="border  px-2 py-1 rounded-lg w-full"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)} 
        />
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="formato" className="">Formato:</label>
        <input
          type="text"
          id="formato"
          placeholder="Ej: Tabletas"
          className="border  px-2 py-1 rounded-lg w-full"
          value={formato} 
          onChange={(e) => setFormato(e.target.value)} 
        />
      </div>
<div className="flex flex-col text-sm">
      <label htmlFor="enfermedad" className="">Asociar a</label>
  {loadingEnfermedades ? (
    <span>Cargando...</span>
  ) : (
    <select className='border  px-2 py-1 rounded-lg w-full' value={farmacoId} onChange={(e) => setFarmacoId(e.target.value)}>
  <option className='font-bold' value={null}>Sin enfermedad</option>
  {enfermedades.map((enfermedad) => (
    <option key={enfermedad._id} value={enfermedad._id}>
      {enfermedad.nombre}
    </option>
  ))}
    </select>
  )}
      </div>

    </div>
    <div className="flex justify-center py-2">
        <button  type="submit" className="bg-lila-200 hover:bg-lila-100 text-white font-semibold py-2 px-4 rounded-lg">
         Guardar
        </button>
        
      </div>

  </form>
  </div>
        </div>
      )}
    </>
  );
};

export default FormularioIndicaciones;
