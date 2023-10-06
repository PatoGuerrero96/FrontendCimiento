import { useEffect,useState } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import clientAxios from "../../config/axios";
import proAuth from "../../hooks/proAuth"
import moment from "moment";
import { MdKeyboardArrowDown, MdKeyboardArrowRight,MdAddCircle } from "react-icons/md";
import { IoMdCloseCircle} from "react-icons/io";
import { BsFillExclamationOctagonFill} from "react-icons/bs";
import { RxMagnifyingGlass } from "react-icons/rx";
import { BsFillPencilFill } from "react-icons/bs";

import { Paginacion } from "../Paginacion";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import ExamenSolicitado from "./ExamenSolicitado";
import FormularioControles from "./FormularioControles";
import pdfMake from 'pdfmake/build/pdfmake';
 import pdfFonts from './fonts';
 pdfMake.vfs = pdfFonts;
const FormularioLlenarConsulta = () => {
    const [consulta, setConsulta] = useState([]);
    const navigate = useNavigate()
    const { id } = useParams();
    const {authpro} =  proAuth()
    const [datosPaciente, setDatosPaciente] = useState({ });
    const [datosPacienteMotivo, setDatosPacienteMotivo] = useState({});
    const [datosPacientediagnostico, setDatosPacientediagnostico] = useState({});
    const [datosPacientemotivo, setDatosPacientemotivo] = useState({});
    const [loading, setLoading] = useState(true); 
    const [cargando, setCargando] = useState(true); 
    const [datosCargados, setDatosCargados] = useState(false);
    const [seccionVisible, setSeccionVisible] = useState(false);
    const [nombre, setNombre] = useState('');
    const [fechadiagnostico, setFechadiagnostico] = useState('');
    const [tratamiento, setTratamiento] = useState('');
    const [ultimocontrol, setUltimoControl] = useState('');
    const [obsdiagnostico, setObsdiagnostico] = useState('');
    const [ocultarEnfermedad, setOcultarEnfermedad] = useState({});
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [enfermedadActualId, setEnfermedadActualId] = useState(null);

    const [medidas, setMedidas] = useState([]);
    const [enfermedades, setEnfermedades] = useState([]);
    const [loadingEnfermedades, setLoadingEnfermedades] = useState(true);
    const [datosPacienteconsulta, setDatosPacienteconsulta] = useState({});
    const [seccionVisibleFarmaco, setSeccionVisibleFarmaco] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [recetamodalVisible, setRecetamodalvisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [buscarRecetaValue, setBuscarRecetaValue] = useState('');
    const [buscarSignosValue, setBuscarSignosValue] = useState('');
    const [pagina, setPagina] = useState(1);
    const [porPagina, setPorPagina] = useState(3);
    const [paginareceta, setPaginaReceta] = useState(1);
    const [porPaginareceta, setPorPaginaReceta] = useState(3);
    const [paginaSignos, setPaginaSignos] = useState(1);
    const [porPaginaSignos, setPorPaginaSignos] = useState(3);
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
    const [seccionVisibleReceta, setSeccionVisibleReceta] = useState(false);
    const [receta, setReceta] = useState([]);
    const [mostrarFormulariointerconsulta, setMostrarFormulariointerconsulta] = useState(false);
    const [seccionVisibleinterconsulta, setSeccionVisibleinterconsulta] = useState(false);
    const [profesionalesSeleccionados, setProfesionalesSeleccionados] = useState([]);
    const [tipoReceta, setTipoReceta] = useState('');
    const [mostrarFormularioReceta, setMostrarFormularioReceta] = useState(false);
    const [mostrarFormularioNormal, setMostrarFormularioNormal] = useState(false);
    const [mostrarFormularioSignos, setMostrarFormularioSignos] = useState(false);
    const [inputs, setInputs] = useState(['']); // Agregamos un campo de entrada inicial vacío
    const [recetasmagistrales, setRecetasmagistrales] = useState([]);
    const [signos, setSignos] = useState([]);
    const [signoscontenido, setSignoscontenido] = useState(['']); // Agregamos un campo de entrada inicial vacío
    const [seleccionado, setSeleccionado] = useState(
      datosPacienteMotivo?.interconsulta === 'Si' || datosPacienteMotivo?.interconsulta === 'Interconsulta'
    );
    
    const cerrarFormularioSignos = () => {
      setMostrarFormularioSignos(false);
      setSignoscontenido(['']);
    };
    const abrirFormularioSignos = () => {
      if (datosPacienteMotivo.signosdealarma && datosPacienteMotivo.signosdealarma.length > 0) {
        setSignoscontenido(datosPacienteMotivo.signosdealarma);
      } else {
        setSignoscontenido(['']);
      }
      setMostrarFormularioSignos(true);
    };
    const handleInputChangeSignos = (index, event) => {
      const newInputs = [...signoscontenido];
      newInputs[index] = event.target.value;
      setSignoscontenido(newInputs);
    };
  
    const handleKeyDownSignos = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addInput();
      }
    };
  
    const addInputSignos = () => {
      setSignoscontenido([...signoscontenido, '']);
    };
    const removeInputSignos = (index) => {
      const newInputs = signoscontenido.filter((_, i) => i !== index);
      setSignoscontenido(newInputs);
    };





    const handleInputChange = (index, event) => {
      const newInputs = [...inputs];
      newInputs[index] = event.target.value;
      setInputs(newInputs);
    };
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addInput();
      }
    };
  
    const addInput = () => {
      setInputs([...inputs, '']);
    };
    const removeInput = (index) => {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    };
    


  //Sección farmacos
    const maximo = Math.ceil(medidas.length / porPagina);
      //Sección recetas
    const maximoreceta = Math.ceil(recetasmagistrales.length / porPaginareceta);
      //Sección signos
      const maximosignos = Math.ceil(signos.length / porPaginaSignos);

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
      if (!dosis) {
        Swal.fire('¡Error!', 'Por favor, Agregue una dosis', 'error');
        return;
      }
      if (!horario) {
        Swal.fire('¡Error!', 'Por favor, Agregue un horario', 'error');
        return;
      }
      if (!duracion) {
        Swal.fire('¡Error!', 'Por favor, Agregue la duración para el farmaco', 'error');
        return;
      }
      if (!formato) {
        Swal.fire('¡Error!', 'Por favor, Agregue un formato', 'error');
        return;
      }
      if (!tipodeuso) {
        Swal.fire('¡Error!', 'Por favor, Agregue el tipo de uso', 'error');
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
  
    const medidasfiltradas = medidas.filter(me => {
      if (!me || (!me.titulo && !me.tags)) return false;
    
      const titulo = me.titulo ? me.titulo.toString().toLowerCase() : '';
      const tags = me.tags ? me.tags.toString().toLowerCase() : '';
    
      return titulo.includes(searchValue.toLowerCase()) ||  tags.includes(searchValue.toLowerCase());
    });
    
    

  
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
        const { data } = await clientAxios.get(
          `/profesional/informacion-paciente-consulta/${id}`,
          config
        );
    
        setConsulta(data);
        setMostrarFormulariointerconsulta(false)
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
    const toggleSeccionVisibleFar = () => {
      setSeccionVisibleFarmaco(!seccionVisibleFarmaco);
    };
    const toggleSeccionReceta = () => {
      setSeccionVisibleReceta(!seccionVisibleReceta);
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
    const copiarAlPortapapelesIndice = (nombre, contenido) => {
      // Verificar si contenido es un array
      if (!Array.isArray(contenido)) {
        console.error('El contenido no es un array');
        return;
      }
    
      // Copiar cada línea de contenido en los inputs
      setInputs(contenido);
    
      // Mostrar el mensaje de éxito
      const toastMixin = Swal.mixin({
        toast: true,
        icon: 'success',
        title: `datos de receta magistral: "${nombre}" copiada con éxito`,
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
    };
    const copiarAlPortapapelesSignos = (nombre, contenido) => {
      // Verificar si contenido es un array
      if (!Array.isArray(contenido)) {
        console.error('El contenido no es un array');
        return;
      }
    
      // Copiar cada línea de contenido en los inputs
      setSignoscontenido(contenido);
    
      // Mostrar el mensaje de éxito
      const toastMixin = Swal.mixin({
        toast: true,
        icon: 'success',
        title: `datos de signos de alarma: "${nombre}" copiada con éxito`,
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
    };
    
    
    

    const imageUrl = authpro.firma.secure_url;
  
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
    function formatearFechaReceta(fecha) {
      const fechaActual = new Date();
      const fechaNacimiento = new Date(fecha);
      
      // Calcula la diferencia en milisegundos entre la fecha actual y la fecha de nacimiento
      let diferencia = fechaActual - fechaNacimiento;
      
      // Convierte la diferencia en milisegundos a años
      const milisegundosPorAnio = 1000 * 60 * 60 * 24 * 365.25;
      const edad = Math.floor(diferencia / milisegundosPorAnio);
      
      return edad;
    }
    const generarReceta = async () => {
      const nombrepaciente = datosPaciente.paciente.nombres;
      const apellidopaciente = datosPaciente.paciente.apellidos;
      const rutpaciente = datosPaciente.paciente.rut;
      const edadpaciente = formatearFechaReceta(datosPaciente.paciente.fechaNacimiento);
      const rutprofesional = authpro.rut;
      const nombreprofesional = authpro.nombres;
      const apellidoprofesional = authpro.apellidos;
      
      try {
        // Obtener los datos de los fármacos relacionados al motivo de consulta actual
        const farmacosRelacionados = Object.keys(datosPacientefarmaco)
          .filter((farmacoId) => {
            const farmaco = datosPacientefarmaco[farmacoId];
            return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
          })
          .map((farmacoId) => datosPacientefarmaco[farmacoId]);
    
        // Verificar si hay fármacos seleccionados
        if (farmacosRelacionados.length === 0) {
          // Si no hay fármacos, simplemente detener la ejecución de la función
          return;
        }
    
        // Obtener la imagen de Cloudinary como base64
        const base64Image = await fetchImageAsBase64(imageUrl);
    
        // Obtener la fecha actual
        const fechaactual = new Date().toLocaleDateString();
    
        // Crear el contenido de la ficha de identificación del paciente
        const fichaPaciente = [
          [{ text: 'Nombres del paciente:', bold: true },`${nombrepaciente} ` , { text: 'Apellidos paciente:', bold: true },apellidopaciente ],
          [{ text: 'RUT', bold: true }, rutpaciente, { text: 'Edad:', bold: true }, edadpaciente || ''],
          [{ text: 'Profesional', bold: true }, `${nombreprofesional} ${apellidoprofesional}`, { text: 'RUT Profesional:', bold: true }, rutprofesional || ''],
        ];
    
        // Crear el contenido del documento PDF a partir de los datos de los fármacos relacionados y la ficha del paciente
        const content = [
          { text: 'Cimiento Clínico', bold: true, margin: [0, 0, 0, 10] },
          { text: 'RECETA MÉDICA', style: 'header', margin: [0, 0, 0, 10] },
          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto'],
              body: fichaPaciente,
              alignment: 'center'
            },
            margin: [25, 0, 0, 10],
            alignment: 'center'
          },
          { text: 'Tratamiento farmacológico:', style: 'subheader', margin: [0, 10, 0, 5] },
          {
            ul: farmacosRelacionados.map((farmaco) => ({
              text: [
                { text: farmaco.nombre || '', bold: true },
                '\n',
                `${farmaco.horario || ''} - ${farmaco.dosis || ''} - ${farmaco.tipodeuso || ''} - ${farmaco.duracion || ''} - ${farmaco.formato || ''}`
              ]
            }))
          },
          { text: '' , margin: [0, 20, 0, 0] },
          { image: base64Image, width: 100, alignment: 'center', margin: [0, 20, 0, 0] },
          { text: 'Firma Digital', alignment: 'center' , margin: [0, 2, 0, 0] },
          { text: `Fecha actual: ${fechaactual}`, alignment: 'left', margin: [0, 20, 0, 0] },
        ];
    
        // Definir el documento PDF
        const documentDefinition = {
          content,
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              alignment: 'center',
              margin: [0, 0, 0, 10] // Márgenes [arriba, izquierda, abajo, derecha]
            },
            subheader: {
              bold: true,
              fontSize: 14,
              margin: [0, 5, 0, 0]
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
          try {
            // Crear un FormData y agregar el PDF con el nombre 'documento'
            const formData = new FormData();
            formData.append('documento', blob, 'documento.pdf');
            formData.append('pacienteId', consulta.paciente._id);
    
            const opciones = farmacosRelacionados.map((farmaco) => farmaco.nombre || '').join(', ');
            formData.append('opciones', opciones);
            formData.append('tipoReceta', tipoReceta);
    
            formData.append('profesionalId', consulta.profesional._id);
            formData.append('motivoId', consulta.motivoconsulta._id);
            formData.append('consultaId', consulta._id);
    
            // Realizar la petición a tu backend utilizando Axios
            const tokenPro = localStorage.getItem('tokenPro');
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${tokenPro}`
              }
            };
            const response = await clientAxios.post('/profesional/guardar-receta', formData, config);
            setRecetamodalvisible(false);
          } catch (error) {
            // Manejar el error en caso de fallo al subir el PDF al backend
            console.log(error);
          }
        });
      } catch (error) {
        // Manejar el error en caso de fallo al generar el PDF
        console.log(error);
      }
    };
    
    
    
    const generarRecetaMagistral = async () => {
      const nombrepaciente = datosPaciente.paciente.nombres;
      const apellidopaciente = datosPaciente.paciente.apellidos;
      const rutpaciente = datosPaciente.paciente.rut;
      const edadpaciente = formatearFechaReceta(datosPaciente.paciente.fechaNacimiento);
      const rutprofesional = authpro.rut;
      const nombreprofesional = authpro.nombres;
      const apellidoprofesional = authpro.apellidos;
    
      try {
        // Obtener los datos de los farmacos relacionados al motivo de consulta actual
        const farmacosRelacionados = Object.keys(datosPacientefarmaco)
          .filter((farmacoId) => {
            const farmaco = datosPacientefarmaco[farmacoId];
            return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
          })
          .map((farmacoId) => datosPacientefarmaco[farmacoId]);
    
        // Verificar si hay fármacos seleccionados
        if (farmacosRelacionados.length === 0) {
          // Si no hay fármacos, simplemente detener la ejecución de la función
          return;
        }
         // Obtener la imagen de Cloudinary como base64
         const base64Image = await fetchImageAsBase64(imageUrl);
        // Crear el contenido de la ficha de identificación del paciente
        const fichaPaciente = [
          [{ text: 'Nombres del paciente:', bold: true },`${nombrepaciente} ` , { text: 'Apellidos paciente:', bold: true },apellidopaciente ],
          [{ text: 'RUT', bold: true }, rutpaciente, { text: 'Edad:', bold: true }, edadpaciente || ''],
          [{ text: 'Profesional', bold: true }, `${nombreprofesional} ${apellidoprofesional}`, { text: 'RUT Profesional:', bold: true }, rutprofesional || ''],
        ];
        const inputsArray = Array.isArray(inputs) ? inputs : [];

    
        // Generar el contenido del PDF a partir de los datos de los farmacos relacionados y la ficha del paciente
        const content = [
          { text: 'Cimiento Clínico', bold: true, margin: [0, 0, 0, 10] },
          { text: 'RECETA MAGISTRAL', style: 'header', margin: [0, 0, 0, 10] },
          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto'],
              body: fichaPaciente,
              alignment: 'center', // Centrar la tabla
            },
            margin: [25, 0, 0, 10],
            alignment: 'center'
          },
            // Incluir los datos del array inputs en el contenido del PDF
            {
              text: inputsArray.join('\n'), // Unir los elementos del array con un salto de línea
              margin: [0, 10, 0, 0],
            },

          { image: base64Image, width: 100, alignment: 'center', margin: [0, 20, 0, 0] },
          { text: 'Firma Digital', alignment: 'center', margin: [0, 2, 0, 0] },
          { text: `Fecha actual: ${new Date().toLocaleDateString()}`, alignment: 'left', margin: [0, 20, 0, 0] },

        ];
    
        // Definir el documento PDF
        const documentDefinition = {
          content,
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              alignment: 'center',
              margin: [0, 0, 0, 10] // Márgenes [arriba, izquierda, abajo, derecha]
            },
            subheader: {
              bold: true,
              fontSize: 14,
              margin: [0, 5, 0, 0]
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
          try {
            // Crear un FormData y agregar el PDF con el nombre 'documento'
            const formData = new FormData();
            formData.append('documento', blob, 'documento.pdf');
            formData.append('pacienteId', consulta.paciente._id);
    
            formData.append('opciones', inputs);
            formData.append('tipoReceta', tipoReceta);
    
            formData.append('profesionalId', consulta.profesional._id);
            formData.append('motivoId', consulta.motivoconsulta._id);
            formData.append('consultaId', consulta._id);
    
            // Realizar la petición a tu backend utilizando Axios
            const tokenPro = localStorage.getItem('tokenPro');
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${tokenPro}`
              }
            };
            const response = await clientAxios.post('/profesional/guardar-receta', formData, config);
            setRecetamodalvisible(false);
          } catch (error) {
            // Manejar el error en caso de fallo al subir el PDF al backend
            console.log(error);
          }
        });
      } catch (error) {
        // Manejar el error en caso de fallo al generar el PDF
        console.log(error);
      }
    };
    
    

//------------------------------------------------
    //Parte de los diagnosticos
    const toggleEnfermedad = (enfermedadId) => {
      setOcultarEnfermedad((prevOcultarEnfermedad) => ({
        ...prevOcultarEnfermedad,
        [enfermedadId]: !prevOcultarEnfermedad[enfermedadId]
      }));
    };
    const cerrarModal = () => {
      setMostrarFormulario(false);
    };
      const VerFormularioCerrado = () => {
    setMostrarFormulario(!mostrarFormulario);
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        if (!nombre) {
          Swal.fire('¡Error!', 'Por favor, Agregue un nombre para el diagnóstico', 'error');
          return;
        }
        if (!fechadiagnostico) {
          Swal.fire('¡Error!', 'Por favor, Agregue fecha del diagnóstico', 'error');
          return;
        }
        if (!tratamiento) {
          Swal.fire('¡Error!', 'Por favor, Agregue un tratamiento.', 'error');
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
    
        await clientAxios.post('/profesional/agregar-enfermedad-motivo', {
          pacienteId: consulta.paciente._id,
          nombre,
          fechadiagnostico,
          tratamiento,
          ultimocontrol,
          obsdiagnostico,
          motivoId: consulta.motivoconsulta._id
        },config);
        const { data } = await clientAxios.get(
          `/profesional/informacion-paciente-consulta/${id}`,
          config
        );
   
        setConsulta(data);
        setDatosPaciente(data.enfermedades);
        fetchData();
        setNombre('');
        setFechadiagnostico('');
        setTratamiento('');
        setUltimoControl('');
        setObsdiagnostico('');
        setMostrarFormulario(false)
        // Mostrar mensaje de éxito o redireccionar a otra página
        Swal.fire('¡Perfecto!', 'Diangóstico actualizado con éxito', 'success');
      } catch (error) {
        console.log(error);
        // Mostrar mensaje de error
        Swal.fire('¡Error!', 'No se puede guardar el diagnóstico', 'error');
      }
    };
    
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
     setConsulta(data)
     setLoading(false);
     setCargando(false);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
        fetchData();
      }, [id]); 
      useEffect(() => {
        if (consulta) {
          setDatosPaciente(consulta);
          setDatosCargados(true);
        }
      }, [consulta]);
      useEffect(() => {
        if (consulta.motivoconsulta) {
          setDatosPacientemotivo(consulta.motivoconsulta);
          setDatosCargados(true);
        }
      }, [consulta.motivoconsulta]);
      useEffect(() => {
        if (consulta && Array.isArray(consulta.enfermedades)) {
          setDatosPacientediagnostico(consulta.enfermedades);
        }
      }, [consulta]);
      const actualizarConsulta = async () => {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
      
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
        try {
          await clientAxios.put(`/profesional/actualizar-consulta-ficha/${id}`, datosPaciente,config);

        } catch (error) {
          console.error(error.message);
          // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
        }
      };
      const actualizarMotivo = async () => {
        const tokenPro = localStorage.getItem('tokenPro');
        if (!tokenPro) return;
    
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPro}`
          }
        };
    
        try {
          await clientAxios.put(`/profesional/actualizar-motivo-ficha/${datosPacientemotivo._id}`, datosPacientemotivo, config);
        } catch (error) {
          console.error(error.message);
          // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
        }
      };
      const actualizarMotivoSignos = async () => {
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
      
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPro}`,
            },
          };
      
          // Aquí se pasa el array signoscontenido en el campo "signosdealarma"
          const data = {
            signosdealarma: signoscontenido,
          };
          // Realizar la petición PUT hacia la API
          await clientAxios.put(`/profesional/actualizar-signos-motivo/${datosPacientemotivo._id}`, data, config);
      
          // Si la petición es exitosa, mostrar mensaje o realizar acciones adicionales
          Swal.fire('¡Perfecto!', 'Signos de alarma registrados', 'success');

        } catch (error) {
          console.error(error.message);
          // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
        }
      };
      
      
      const actualizarPaciente = async () => {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro || !enfermedadActualId) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`
            }
          };
      
          try {
            const enfermedad = datosPacientediagnostico[enfermedadActualId];
      
            await clientAxios.put(`/profesional/editar-enfermedades-paciente/${enfermedad._id}`, enfermedad, config);
      
            // Obtener los datos actualizados después de la actualización
            fetchData();
            
          } catch (error) {
            console.error(error.message);
          }

      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosPaciente((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };
      const handleChangemotivo = (e) => {
        const { name, value } = e.target;
        setDatosPacientemotivo((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };
      const handleChangediagnostico = (e, enfermedadId) => {
        const { name, value } = e.target;
        setDatosPacientediagnostico((prevState) => ({
          ...prevState,
          [enfermedadId]: {
            ...prevState[enfermedadId],
            [name]: value
          }
        }));
      
        setEnfermedadActualId(enfermedadId); // Establecer el ID de la enfermedad actual
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
            actualizarConsulta();
            actualizarMotivo();
            actualizarPaciente();
            actualizarPacienteFar();
            actualizarMotivoFar();
            Swal.fire({
              title: 'Espere un momento',
              html: 'Cargando...',
              allowOutsideClick: false,
              showCancelButton: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              }
            });
      
            await fetchData();
      
            Swal.close(); // Cerrar el Swal de espera
      

            Swal.fire('¡Perfecto!', 'Sección publicada', 'success');
          } catch (error) {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
            console.error(error);
          }
        }
      };
      
      const now = moment();
      const showButton = consulta && now.isSameOrAfter(moment(consulta.fecha).add(consulta.horarioinicio));

      const toggleSeccionVisible = () => {
        setSeccionVisible(!seccionVisible);
      };
      const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset());
        const formatoFecha = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        };
        return nuevaFecha.toLocaleDateString('es-CL', formatoFecha);
      };
      function isValidDate(dateString) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(dateString);
      }
    
      const motivoConsultaId = datosPaciente.motivoconsulta?._id;
      useEffect(() => {
        const fetchData2 = async () => {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro || !consulta || !consulta.motivoconsulta) return;
          
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`
            }
          };
      
          try {
            const { data } = await clientAxios.get(`/profesional/obtener-recetas/${consulta.motivoconsulta._id}`, config);
            setReceta(data);
            setLoading(false);
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData2();
      }, [consulta]);

      //INTERCONSULTA
      const handleOpcionSi = () => {
        setSeleccionado(true);
        setDatosPacientemotivo((prevState) => ({
          ...prevState,
          interconsulta: 'Si',
        }));
        setMostrarFormulariointerconsulta(true);
        // Aquí puedes enviar la información al backend utilizando la variable `datosPaciente.interconsulta` ('Si')
        // por ejemplo, puedes hacer una llamada a una API utilizando fetch o axios
      };
      const toggleSeccionVisibleinterconsulta = () => {
        setSeccionVisibleinterconsulta(!seccionVisibleinterconsulta);
      };
     const  cerrarInterconsulta = () =>  {
        setMostrarFormulariointerconsulta(false);
      }

      const actualizarPropuestaInterconsulta = () => {
        const propuestaInterconsulta = profesionalesSeleccionados.join(', ');
        setDatosPacientemotivo((prevState) => ({
          ...prevState,
          propuestainterconsulta: propuestaInterconsulta
        }));
      };
      useEffect(() => {
        // Llamar a la función para actualizar el campo "propuestainterconsulta"
        actualizarPropuestaInterconsulta();
      }, [profesionalesSeleccionados]);
      const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
          setProfesionalesSeleccionados((prevSeleccionados) => [...prevSeleccionados, value]);
        } else {
          setProfesionalesSeleccionados((prevSeleccionados) =>
            prevSeleccionados.filter((profesional) => profesional !== value)
          );
        }
      };
      const actualizarNotificacionInterconsulta = async () => {
        if (datosPacientemotivo.interconsulta !== 'Si') {
          // Si datosPacientemotivo.interconsulta no es igual a "Si", no realizar la petición
          return;
        }
      else{
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`,
            },
          };
          await clientAxios.put(
            `/profesional/actualizar-notificacion-interconsulta/${datosPacientemotivo._id}`,{notificacioninterconsulta:true},
            config
          );
        } catch (error) {
          console.error(error.message);
          // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
        }
      }

      };
      const finalizarConsulta = async () => {
        try {
          const tokenPro = localStorage.getItem('tokenPro');
          if (!tokenPro) return;
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPro}`,
            },
          };
          await clientAxios.put(`/profesional/finalizar-consulta/${id}`,{estado:'finalizado', visible:false},config);
          // La petición se realiza sin esperar una respuesta o realizar acciones adicionales
        } catch (error) {
          console.log(error);
          // Manejar el error
        }
      };     
      const handleFinalizar = async () => {
        if (datosPacienteMotivo.medidasgenerales === '' ||datosPacienteMotivo.medidasgenerales === null ) {
          Swal.fire('¡Error!', 'Por favor, Agregue medidas generales antes de finalizar la consulta', 'error');
          return;
        }
        if (datosPacienteMotivo.impresiondiagnostica === '' ||datosPacienteMotivo.impresiondiagnostica === null ) {
          Swal.fire('¡Error!', 'Por favor, Agregue la impresión diagnóstica antes de finalizar la consulta', 'error');
          return;
        }
        if (datosPaciente.registro === '' ||datosPaciente.registro === null ) {
          Swal.fire('¡Error!', 'Por favor, Agregue el registro de la consulta antes de finalizarla', 'error');
          return;
        }
        if (!authpro.firma || !authpro.firma.secure_url) {
          Swal.fire('¡Error!', 'Aún no tienes una firma digital para generar recetas. Por favor, contáctate con el administrador de Cimiento Clínico.', 'error');
          return;
        }
        
        if (datosPacienteMotivo.interconsulta === 'Si' && (datosPacienteMotivo.propuestainterconsulta === null || datosPacienteMotivo.propuestainterconsulta.trim() === '')) {
          Swal.fire('¡Error!', 'Por favor, si seleccionaste "Sí" para la creación de una interconsulta, no olvides indicar los profesionales.', 'error');
          return;
        } 
        const farmacosRelacionados = Object.keys(datosPacientefarmaco).filter((farmacoId) => {
          const farmaco = datosPacientefarmaco[farmacoId];
          return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
        });
        
        if (farmacosRelacionados.length === 0 && tipoReceta==='normal') {
          Swal.fire('¡Error!', 'Por favor agregue fármacos para la receta normal', 'error');
          return;
        }
        if (inputs.every((input) => input === '') && tipoReceta === 'magistral') {
          Swal.fire('¡Error!', 'Por favor agregue información para su receta magistral', 'error');
          return;
        }
        
      
        const mensajeReceta = tipoReceta !=='' ? 'SI' : 'NO';
        const colorReceta = tipoReceta !=='' > 0 ? 'green' : 'red';

        const confirmar = await Swal.fire({
          title: '¿Estás seguro de finalizar esta consulta?',
          html: `
            <div>
              <p style="color: ${colorReceta}">Creación de receta médica: ${mensajeReceta}</p>
              ${mensajeReceta === 'SI' ? `<p>Tipo de receta: ${tipoReceta === 'normal' ? 'Receta Normal' : 'Receta Magistral'}</p>` : ''}
              <p>Impresión diagnóstica: ${datosPacientemotivo.impresiondiagnostica}</p>
              <p>Interconsulta: ${datosPacientemotivo.interconsulta}</p>
            </div>
          `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#5d5ddb',
          confirmButtonText: 'Si, Finalizar'
        });
      
        if (confirmar.isConfirmed) {
          try {
            await actualizarPacienteFar();
            if (tipoReceta === 'normal') {
              await generarReceta(); // Esperar a que se genere la receta normal
            } else if (tipoReceta === 'magistral') {
              await generarRecetaMagistral(); // Esperar a que se genere la receta magistral
            }
           
      
            await actualizarNotificacionInterconsulta(); // Esperar a que se actualice la notificación de interconsulta
      
            Swal.fire({
              title: 'Espere un momento',
              html: 'Cargando...',
              allowOutsideClick: false,
              showCancelButton: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              }
            });          
      
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(); // Simulación de tiempo de espera para la generación del PDF
                Swal.close(); // Cerrar el Swal de carga
              }, 5000);
            });
      
            await finalizarConsulta(); // Esperar a que se finalice la consulta
            navigate(`/profesional/consulta/${id}`)
            Swal.fire('¡Perfecto!', 'La consulta fue finalizada correctamente, se envió un correo al paciente con un resumen de su consulta', 'success');
          } catch (error) {
            Swal.fire('¡Error!', 'No se pudo finalizar la consulta', 'error');
          }
        }
      };
      
      const handleTipoReceta = (tipo) => {
        setTipoReceta(tipo);
        if (tipo === 'magistral') {
          setMostrarFormularioReceta(true);
        } else {
          setMostrarFormularioReceta(false);
        }
        if (tipo === 'normal') {
          setMostrarFormularioNormal(true);
        } else {
          setMostrarFormularioNormal(false);
        }

      };
      const SinTipoReceta = () => {
        setTipoReceta('');
      };
      const cerrarReceta = () => {
        setMostrarFormularioReceta(false);
       }
       const cerrarRecetaNormal = () => {
        setMostrarFormularioNormal(false);
       }
       const handleOpcionNo = async () => {
        const interconsultaNo = datosPacienteMotivo?.interconsulta !== 'Si' && datosPacienteMotivo?.interconsulta !== 'Interconsulta';

        if (interconsultaNo) {
          setSeleccionado(false);
        }
        const confirmar = await Swal.fire({
          title: '¿Estás seguro de no generar interconsulta para este motivo?',
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
            const tokenPro = localStorage.getItem('tokenPro');
            if (!tokenPro) return;
      
            const config = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenPro}`,
              },
            };
            await clientAxios.put(
              `/profesional/actualizar-no-interconsulta/${datosPacientemotivo._id}`,
              {
                interconsulta: 'No',
                propuestainterconsulta: null,
                notificacioninterconsulta: false,
                motivointerconsulta: null
              },
              config
            );
      
            // Aquí actualizamos el estado 'seleccionado' a 'no'
            setSeleccionado(false);
            setDatosPacientemotivo((prevState) => ({
              ...prevState,
              interconsulta: 'No',
              propuestainterconsulta: null,
              notificacioninterconsulta: false,
              motivointerconsulta: null,
            }));
      
            const { data } = await clientAxios.get(
              `/profesional/informacion-paciente-consulta/${id}`,
              config
            );
            setConsulta(data);
          } catch (error) {
            console.error(error.message);
            // Mostrar un mensaje de error o realizar acciones adicionales en caso de error
          }
        }
        setSeccionVisibleinterconsulta(false);
      };
      const farmacosRelacionados = Object.keys(datosPacientefarmaco)
  .filter((farmacoId) => {
    const farmaco = datosPacientefarmaco[farmacoId];
    return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
  })
  .map((farmacoId) => datosPacientefarmaco[farmacoId]);

  const BorrarFarmaco = async (id) => {
        
    try {
      const tokenPro = localStorage.getItem('tokenPro');
      if (!tokenPro) return;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenPro}`,
        },
      };
      const resultado = await Swal.fire({
        title: '¿Estás seguro de eliminar este tratamiento para este motivo de consulta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5d5ddb',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      });
      if (resultado.isConfirmed) {
      const response = await clientAxios.delete(`/profesional/eliminar-farmaco-motivo/${id}`, config);
      Swal.fire('¡Listo!', 'Tratamiento farmacológico eliminado', 'success');
      fetchData()
    }
    } catch (error) {
      console.log(error);
    }
  };

  const ObtenerRecetasmagistrales = async () => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };

    try {
      const { data } = await clientAxios.get(`/profesional/obtener-recetasmagistrales`, config);
      setRecetasmagistrales(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ObtenerRecetasmagistrales();
  }, [])
  const recetasmagistralfiltradas = recetasmagistrales.filter(me => {
    if (!me || (!me.nombre && !me.contenido)) return false;
  
    const nombre = me.nombre ? me.nombre.toString().toLowerCase() : '';
    const contenido = me.contenido ? me.contenido.toString().toLowerCase() : '';
  
    return nombre.includes(buscarRecetaValue.toLowerCase()) ||  contenido.includes(buscarRecetaValue.toLowerCase());
  });


  const ObtenerSignos = async () => {
    const tokenPro = localStorage.getItem('tokenPro');
    if (!tokenPro) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenPro}`
      }
    };

    try {
      const { data } = await clientAxios.get(`/profesional/obtener-signos`, config);
      setSignos(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    ObtenerSignos();
  }, [])
  const signosfiltrados = signos.filter(sig => {
    if (!sig || (!sig.nombre && !sig.contenido)) return false;
  
    const nombre = sig.nombre ? sig.nombre.toString().toLowerCase() : '';
    const contenido = sig.contenido ? sig.contenido.toString().toLowerCase() : '';
  
    return nombre.includes(buscarSignosValue.toLowerCase()) ||  contenido.includes(buscarSignosValue.toLowerCase());
  });
  useEffect(() => {
    // Cuando datosPacienteMotivo.interconsulta cambie, actualizamos el estado seleccionado
    setSeleccionado(
      datosPacienteMotivo?.interconsulta === 'Si' || datosPacienteMotivo?.interconsulta === 'Interconsulta'
    );
  }, [datosPacienteMotivo?.interconsulta]);
  return (
    <>
    <div className="max-w-7xl mx-auto mt-10 bg-gray-200 px-5 py-5  rounded-t ">
    {/* SECCIÓN DE REGISTRO ATENCIÓN Y DIAGNÓSTICOS! */}
{loading || cargando ? (
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
) : (
    <div className="">
  <h1 className="text-center text-lg font-semibold">Registro de la consulta</h1>
    <div className="max-w-7xl mx-auto bg-lila-300 px-3 py-1 rounded-t flex justify-start">
      <button
        className=" py-2 text-sm rounded-md  text-white "
        onClick={toggleSeccionVisible}>
        {seccionVisible ? <div className="flex"> <p className="text-sm font-semibold">Registro de la atención </p>  <p className="text-xl">
     <MdKeyboardArrowDown />
        </p></div> :<div className="flex"> <p className="text-sm font-semibold">Registro de la atención</p>   <p className="text-xl">
          <MdKeyboardArrowRight />
        </p></div>} 
      </button>
    </div>
    {seccionVisible && (
   <div className="max-w-7xl mx-auto px-2 border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50">
   <div className="py-2 ">
 
     <label htmlFor="" className="text-sm font-regular">Registro de la consulta</label>
            <textarea
                className="w-full h-28 p-3 bg-white border border-gray-300 rounded resize-none outline-none focus:border-indigo-500"
                placeholder="Escribe aquí los detalles de la consulta del paciente..."
                type="text"
                name="registro"
                value={datosPaciente.registro || ''}
                onChange={handleChange}
            ></textarea>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-1">
            <div className="flex flex-col text-sm">
            <label htmlFor="impresiondiagnostica" className="text-sm font-regular">Impresión diagnóstica</label>
            <textarea
                className="w-full h-16 p-3 bg-white border border-gray-300 rounded-md resize-none outline-none focus:border-indigo-500"
                placeholder="Ingrese la impresión diagnóstica..."
                type="text"
                name="impresiondiagnostica"
                value={datosPacientemotivo.impresiondiagnostica || ''}
                onChange={handleChangemotivo}
            ></textarea>
            </div>
            </div>
            </div>
          </div>
            )  }

        </div>
    )}

      {mostrarFormulario && (
  <div className="fixed inset-0 flex  items-center justify-center z-50">
    <div
      className="bg-gray-800 bg-opacity-75  absolute inset-0 pointer-events-none"
      onClick={cerrarModal}
    ></div>
    <div className="bg-white rounded-lg p-6 relative w-96 ">
      <button onClick={cerrarModal} className="absolute top-0 right-0 p-2 ">
      < IoMdCloseCircle className="text-3xl text-lila-300  hover:text-lila-100 "/>
      </button>

      <form className="p-2 " onSubmit={handleSubmit}>
    <h1 className=" text-center text-xl font-bold p-2">Nuevo diagnóstico</h1>
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 ">
    <div className="flex flex-col text-sm">
        <label htmlFor="nombre" className="mb-2 ">Nombre del diagnóstico</label>
        <input
  type="text"
  className="border px-4 py-2 rounded-lg w-full "
  name="nombre"
  id="nombre" 
  placeholder="Nombre exacto del diagnóstico"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} 
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="fechadiagnostico"className="mb-2 ">Fecha de diagnóstico:</label>
        <input
  type="date" 
  id="fechadiagnostico"
  className="border px-4 py-2 rounded-lg w-full "
  value={fechadiagnostico}
  onChange={(e) => setFechadiagnostico(e.target.value)}
/>
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="ultimocontrol"className="mb-2 ">Último control:</label>
        <input
  type="date" 
  id="ultimocontrol"
  className="border px-4 py-2 rounded-lg w-full "
  value={ultimocontrol}
  onChange={(e) => setUltimoControl(e.target.value)} 
/>
      </div>
    </div>

    <div className="flex flex-col text-sm">
        <label htmlFor="tratamiento" className="mb-2">Tratamiento:</label>
        <textarea
          type="text"
          id="tratamiento"
          className="border px-4 py-2 rounded-lg w-full"
          value={tratamiento}
          placeholder="Tratamiento para este diagnóstico"
          onChange={(e) => setTratamiento(e.target.value)} 
        />
      </div>
      <div className="flex flex-col text-sm">
        <label htmlFor="obsdiagnostico" className="mb-2">Observaciones diagnóstico:</label>
        <textarea
          type="text"
          id="obsdiagnostico"
          className="border px-4 py-2 rounded-lg w-full"
          placeholder="Agregar recomendaciones o información relevante"
          value={obsdiagnostico} 
          onChange={(e) => setObsdiagnostico(e.target.value)} 
        />
      </div>
      <div className="flex  text-sm mt-2 gap-1 bg-blue-200 px-2 py-1 rounded">
        <p  className="  font-bold">motivo de consulta: </p>
        <p className=" font-regular">  {' '} {datosPacientemotivo.titulo}  </p>
      
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

{/* SECCIÓN DE INDICACIONES Y FARMACOS! */}
{loading || cargando ? (
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
) : (       <div className="py-4">
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
              {showButton && (
              <button className="px-1 py-1 text-xs rounded-md text-center flex text-white bg-lila-200 hover:bg-lila-100" onClick={abrirModal}>
              Buscar medidas generales <RxMagnifyingGlass className=" text-xl" />
            </button>
              )}
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
                      <div className=" flex "> <p className="text-xs font-bold  ">Fuente: </p>  <p className="text-xs text-gray-600 font-regular italic"> {' '}{me.fuente || 'Sin datos'}</p></div>

                      <div className="flex">
                      <div className=" flex "> <p className="text-sm font-bold  ">Tags: </p>  <p className="font-regular text-sm text-indigo-800 bg-indigo-100 rounded ml-1"> {' '}{me.tags || ''}</p></div>
                      </div>
                      <div className=""> {me.anonimo===true ? <div className="flex"> <p className="text-sm font-bold">Subido por: </p><p className="text-sm">Anónimo</p></div> : <div className="flex"> <p className="text-sm font-bold">Subido por: </p><p className="text-sm ">Subido por:{me.profesional.nombres} {me.profesional.apellidos}</p></div>}  </div>
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

        <div className=" flex justify-end">
         
      {showButton && (
        <div>

<button
onClick={VerFormularioCerradofar}
className="uppercase bg-coral-200 hover:bg-coral-100 px-2 py-2 text-white rounded-md"
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
</div>
)}

      </div>
<div>
{ Object.keys(datosPacientefarmaco)
.filter((farmacoId) => {
const farmaco = datosPacientefarmaco[farmacoId];
return farmaco && farmaco.motivoconsulta?.includes(motivoConsultaId);
})
.length > 0 ? (
  <>
          <div className="text-center font-semibold">
        FARMACOS ASIGNADOS PARA ESTE MOTIVO DE CONSULTA
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
  <div>
<div className="flex justify-end">

<button  onClick={() => BorrarFarmaco(farmaco._id)} className="bg-coral-300 hover:bg-coral-200 px-1 py-1  rounded text-sm text-white">Borrar farmaco 🗑️</button>
</div>
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
    </>
  ) : (
''  )}
</div>
<div>


   </div>
   <div >
  {/* SECCIÓN DE RECETA MÉDICA! */}
  <div className="max-w-7xl mx-auto bg-lila-300 px-3 py-1 rounded-t flex justify-start mt-2">
            <button
              className=" py-2 text-sm rounded-md  text-white "
              onClick={toggleSeccionReceta}
            >
              {seccionVisibleReceta ? (
                <div className="flex">
                  <p className="text-sm font-semibold">Receta Médica: {tipoReceta==='normal' ? 'Receta normal' :''}{tipoReceta==='magistral' ? 'Receta Magistral' :''} </p>
                  <p className="text-xl">
                    <MdKeyboardArrowDown />
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <p className="text-sm font-semibold">Receta Médica: {tipoReceta==='normal' ? 'Receta Normal' :''}{tipoReceta==='magistral' ? 'Receta Magistral' :''} </p>
                  <p className="text-xl">
                    <MdKeyboardArrowRight />
                  </p>
                </div>
              )}
            </button>

    </div>
    {seccionVisibleReceta && (
    <div className="max-w-7xl mx-auto px-2 border-l-2 border-l-indigo-200 border-r-2 border-r-indigo-200 border-b-2  border-b-indigo-200 bg-gray-50 ">
    <div className="flex justify-end py-2">  
    </div> 
    {loading ? (
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
) : ( 
<div>
{showButton && (  
<div className="flex gap-2">
  <p className="mt-1">¿Qué tipo de receta quieres generar?</p>
  <button
    className={`text-white px-2 py-2 rounded text-sm ${tipoReceta === 'normal' ? 'bg-lila-100' : 'bg-lila-300'}`}
    onClick={() => handleTipoReceta('normal')}
  >
    Receta Normal
  </button>
  <button
    className={`text-white px-2 py-2 rounded text-sm ${tipoReceta === 'magistral' ? 'bg-lila-100' : 'bg-lila-300'}`}
    onClick={() => handleTipoReceta('magistral')}
  >
    Receta Magistral
  </button>
  <button
    className={`text-white px-2 py-2 rounded text-sm ${tipoReceta === '' ? 'bg-lila-100' : 'bg-lila-300'}`}
    onClick={SinTipoReceta}
  >
    Sin Receta
  </button>
</div>
)  }
{mostrarFormularioReceta && (
  <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div className="bg-white p-2 rounded-lg min-w-4xl min-h-4xl">
    <div className="flex justify-end">
      <button onClick={cerrarReceta}>
        <AiFillCloseCircle className="text-3xl text-coral-300 hover:text-coral-100" />
      </button>
    </div>
    <div>
      <h1 className="text-center  font-bold mb-6 text-xl">Generar receta magistral</h1>
    </div>
<div className="grid grid-cols-2 gap-8  ">
<div className="col-span-1 bg-white p-12 rounded-lg border border-zinc-900 flex flex-col">
  <label htmlFor="magistral" className="text-lg mb-4 font-semibold">
    Receta magistral
  </label>
  {inputs.map((value, index) => (
    <div key={index} className="mb-4">
      <label htmlFor={`input-${index}`} className="text-md mb-2 mr-1">
        {index + 1}.-
      </label>
      <input
        id={`input-${index}`}
        type="text"
        value={value}
        onChange={(event) => handleInputChange(index, event)}
        className="border p-2 rounded-lg text-sm px-2 w-96"
        onKeyDown={handleKeyDown}
      />
      {index > 0 && (
        <button
          className="px-3 py-1 ml-1 text-md rounded-md text-white bg-lila-200 hover:bg-lila-100 mt-2"
          onClick={() => removeInput(index)}
        >
          X
        </button>
      )}
    </div>
  ))}
  <div className="flex justify-center">
  <button
    className="px-4 py-2 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100"
    onClick={addInput}
  >
    Agregar indice
  </button>
  </div>
</div>

  <div className="col-span-1 grid gap-8">
    <div className=" bg-white p-8 rounded-lg border border-zinc-900">
    <div className="flex justify-center px-1 py-1 ">
                  <label htmlFor="orden" className="mr-2 text-md font-semibold">Buscar:</label>
                  <input type="text" value={buscarRecetaValue} onChange={(e) => setBuscarRecetaValue(e.target.value)} placeholder="Buscar datos receta magistral" className="p-1 border rounded-md w-52 placeholder:text-sm" />

                </div>
    </div>
    <div className="row-span-1 bg-white p-12 rounded-lg border border-zinc-900">
    <div className="">
  {recetasmagistralfiltradas.slice((paginareceta - 1) * porPaginareceta, (paginareceta - 1) * porPaginareceta + porPaginareceta).map((me) => (
    <div key={me._id} className="py-2 border border-neutral-800 cursor-pointer hover:bg-gray-100" onClick={() => copiarAlPortapapelesIndice(me.nombre, me.contenido)}>
      <div className="flex justify-end ">
        <button className="px-2 py-1 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100" onClick={() => copiarAlPortapapelesIndice(me.nombre, me.contenido)}>
          <FaCopy />
        </button>
      </div>  
      <p className="text-center text-sm font-semibold">{me.nombre || ''}</p>
      {Array.isArray(me.contenido) ? (
        me.contenido.map((linea, index) => (
          <p key={index} className="text-xs bg-gray-100 px-2 p-1 ">{`${index + 1}.- ${linea}`}</p>
        ))
      ) : (
        <p className="text-xs bg-gray-100 px-2 p-1 ">{me.contenido}</p>
      )}

      <p className="text-left text-sm font-semibold"> Fuente:{me.fuente || ''}</p>
      <div className="text-left text-sm font-semibold flex"> Publicado por:{me.anonimo ===false ?<p> {me.profesional.nombres} {me.profesional.apellidos} </p> :'Anónimo'}</div>

      <hr />
    </div>
  ))}
</div>

                {recetasmagistralfiltradas.length ? (
  <Paginacion
    maximo={maximoreceta}
    pagina={paginareceta}
    setPagina={setPaginaReceta}
  />
) : (

  <div> <h1 className="text-center">Aún no hay datos para filtrar </h1> </div>
)}


    </div>
  </div>
</div>

    <div className="flex justify-center mt-8">
      {showButton && (
        <button onClick={cerrarReceta} className="px-6 py-2 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100">
          Guardar información
        </button>
      )}
    </div>
  </div>
</div>

    )}
{mostrarFormularioNormal && (
  
  <div>

{farmacosRelacionados.length === 0 && (
  <div className="text-center">
    <hr className="mt-2" />
        <div className="flex justify-end">          
  <button onClick={cerrarRecetaNormal} className="text-md px-1 flex "> Cerrar
< IoMdCloseCircle className=" text-lila-300 text-2xl  hover:text-lila-100 "/>
</button>
  </div>
    <h1 className="font-semibold text-coral-300">Aún no se han registrado tratamientos farmacológicos para este motivo, por lo que no puedes crear una receta aún</h1>
    <h1>Empieza registrando un tratamiento aquí</h1>
    <button
      onClick={VerFormularioCerradofar}
      className="uppercase bg-coral-200 hover:bg-coral-100 px-2 py-2 text-white rounded-md mt-2"
    >
      {mostrarFormularioFarmaco ? (
        <div className="flex">
          <IoMdCloseCircle className="text-xl" />
        </div>
      ) : (
        <div className="flex">
          Agregar farmaco<MdAddCircle className="text-2xl" />
        </div>
      )}
    </button>
  </div>
)}
 </div>
     )}
  {receta && receta.length > 0 ? (
    <div className="py-2">
      <hr />
      <h1 className="text-center py-2 font-semibold">Lista de recetas generadas en este motivo de consulta</h1>
    <ul>
      
      {receta.map((item, index) => (
        <li key={index} className="flex items-center border-b border-gray-200 py-4">
          <div className="mr-4">
            
            
            {`${index + 1}.- Farmacos de la receta: ${item.opciones.join(', ')}`}/ Tipo de receta: {item.tipoReceta ==='normal'?'Receta Normal':'Receta Magistral'} </div>
          
            {item.profesional?._id === authpro._id && item.documento?.secure_url ? (
  <div className="text-sm font-medium text-gray-900 py-0.5 px-0.5">
    <button
      onClick={() =>
        downloadFile(item.documento?.secure_url, `Receta médica(Cimiento clínico).pdf`)
      }
      className="bg-lila-200 hover:bg-lila-100 text-white text-sm font-nunito font-semibold py-1 px-2 rounded inline-flex items-center"
    >
      📥 Descargar
    </button>
  </div>
) : (
  <div className="lg:px-6 lg:py-4"></div>
)}


        </li>
      ))}
    </ul>
    </div>
  ) : (
    <p className="font-bold text-center py-5 text-coral-300"></p>
  )}
</div>


) }       
    </div> )}




{/* SECCIÓN DE EXAMENES SOLICITADOS! */}
   {cargando || !datosCargados ? (
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
) : (
  <div>

       <ExamenSolicitado
        consultaId={consulta._id}
        pacienteId={consulta.paciente._id}
        profesionalId={consulta.profesional._id}
        motivoConsultaId={consulta.motivoconsulta._id}
        consulta={consulta}
        nombrepaciente={datosPaciente.paciente.nombres}
        apellidopaciente={datosPaciente.paciente.apellidos}
        rutpaciente={datosPaciente.paciente.rut}
        edadpaciente={datosPaciente.paciente.fechaNacimiento}

      />
  </div>
)}
        {/*INTERCONSULTA */}
        <div className=" py-1 mb-5">
    <div className="max-w-7xl mx-auto  px-3 py-1 rounded-t flex justify-start">
      <button
        className=" py-2 text-sm rounded-md  text-black "
        onClick={toggleSeccionVisibleinterconsulta}>
        {seccionVisibleinterconsulta ? <div className="flex "> <p className="text-sm font-semibold">Interconsulta: </p>  
        <div>{datosPacienteMotivo.interconsulta ==='Interconsulta'?<p className="text-sm font-semibold px-1"> {datosPacienteMotivo.especialidades} </p> : ''} </div>
        <div>{datosPacienteMotivo.interconsulta ==='Si'?<p className="font-semibold px-1"> Si </p> : ''} </div> 
        <div>{datosPacienteMotivo.interconsulta ==='No'?<p className="font-semibold px-1"> No </p> : ''} </div> 
        <div>{datosPacienteMotivo.interconsulta ==='Sin datos'?<p></p> : ''} </div> 
        <p className="text-xl">
     <MdKeyboardArrowDown />
        </p></div> 
        :<div className="flex "> <p className="text-sm font-semibold">Interconsulta:</p> 
        <div >{datosPacienteMotivo.interconsulta ==='Interconsulta'?<p className="font-semibold px-1"> {datosPacienteMotivo.especialidades} </p> : ''} </div>
        <div>{datosPacienteMotivo.interconsulta ==='Si'?<p className="font-semibold px-1"> Si </p> : ''} </div> 
        <div>{datosPacienteMotivo.interconsulta ==='No'?<p className="font-semibold px-1"> No </p> : ''} </div> 
        <div>{datosPacienteMotivo.interconsulta ==='Sin datos'?<p></p> : ''} </div> 
         <p className="text-xl">
          <MdKeyboardArrowRight />
        </p></div>} 
      </button>
    </div>
    {seccionVisibleinterconsulta && (
 <div className="max-w-7xl mx-auto px-2  bg-gray-50">
 <div className="py-2">
  <div className="flex ">
 <h1>{datosPacienteMotivo.interconsulta ==='Interconsulta'?<p className="font-semibold">Se genero una interconsulta con profesional/es: {datosPacienteMotivo.especialidades || ''}<button onClick={handleOpcionSi}>< BsFillPencilFill className="text-lila-300 hover:text-lila-200 ml-1"/></button></p>:<p></p>}</h1>
 <h1>{datosPacienteMotivo.interconsulta ==='Si'?<p className="font-semibold">Actualmente se propuso una interconsulta con los profesionales: {datosPacienteMotivo.propuestainterconsulta|| ''} <button onClick={handleOpcionSi}>< BsFillPencilFill  className="text-lila-300 hover:text-lila-200 ml-1"/></button>  </p>:<p></p>}</h1>
  </div>
  <div className="flex gap-2">

   <label htmlFor="" className="text-md font-regular mt-2">
   <h1>{datosPacienteMotivo.interconsulta  ==='Interconsulta' || datosPacienteMotivo.interconsulta ==='Si'?<p> ¿Quieres generar una nueva interconsulta?</p>:<p>¿Generar Interconsulta?</p>}</h1>
   </label>
   <div className="toggle-switch">
      <button
        className={`toggle-option ${seleccionado ? 'selected' : ''}`}
        onClick={handleOpcionSi}
      >
        Si
      </button>
      <button
        className={`toggle-option ${!seleccionado ? 'selected' : ''}`}
        onClick={handleOpcionNo}
      >
        No
      </button>
    </div>


   </div>
   {mostrarFormulariointerconsulta && (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ">


  <div className="bg-white p-6 rounded-lg">
    <div className="flex justify-end">
    <button onClick={cerrarInterconsulta}>
    <AiFillCloseCircle className="text-3xl text-coral-300  hover:text-coral-100"/>
      </button>
    </div>

    <div className="mt-2">
      {/* Aquí puedes agregar los campos adicionales del formulario */}
      {datosPacientemotivo.interconsulta === 'Si' && (
        <div>
           <h1>{datosPacienteMotivo.interconsulta ==='Interconsulta'?<p className="font-semibold">Se genero una interconsulta con profesional/es: {datosPacienteMotivo.especialidades}</p>:<p></p>}</h1>
 <h1>{datosPacienteMotivo.interconsulta ==='Si'?<div className="font-semibold flex">Actualmente se propuso una interconsulta con los profesionales: <p className="text-lila-300">{datosPacienteMotivo.propuestainterconsulta}</p> </div>:<p></p>}</h1>
          <p className="text-sm font-semibold">Selecciona los profesionales de la salud:</p>
          <div className="grid grid-cols-3 sm:grid-cols-8 gap-1">
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Médico"
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                Médico
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Cirujano"
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                Cirujano
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Nutricionista"
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                Nutricionista
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="diabetólogo"
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                Diabetologo
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="motivointerconsulta" className="block text-sm font-semibold mb-1">Motivo de la interconsulta</label>
            <textarea
              className="w-full h-32 p-3 bg-white border rounded border-gray-300 resize-none outline-none focus:border-indigo-500"
              placeholder="Escribe el motivo por el cual se propone una interconsulta..."
              type="text"
              name="motivointerconsulta"
              value={datosPacienteMotivo.motivointerconsulta || ''}
              onChange={Actualizacionmodo}
            ></textarea>
          </div>
        </div>
      )}

    </div>
    <div className=" flex justify-center mt-2">
             {showButton && (
               <button className="px-1 py-2 text-sm rounded-md text-center mb-2 text-white bg-lila-200 hover:bg-lila-100" onClick={guardarDatos}>
              Guardar interconsulta
             </button>
            )}
   </div>
  </div>
</div>

    )}
 </div>
</div>
            )  }

        </div>


{/* SECCIÓN DE CONTROLES! */}
{cargando || !datosCargados ? (
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>
) : (
  <div>
       <FormularioControles
        consultaId={consulta._id}
        pacienteId={consulta.paciente._id}
        motivoId={consulta.motivoconsulta._id}
        consulta={consulta}
        profesionalId={consulta.profesional._id}
      />
  </div>
)}

   </div>

      </div>
    )}
    
  </div>

</div>)}
<div>
{cargando || !datosCargados ? ( 
  <p className="max-w-7xl mx-auto bg-gray-200  py-5 rounded-md px-2">Cargando...</p>

 )  :
 <div className=" flex justify-center mt-2">
{showButton && (
  <button className="px-4 py-3 text-sm rounded-md text-center mb-2 text-white bg-lila-200 hover:bg-lila-100" onClick={guardarDatos}>
  GUARDAR REGISTRO DE LA CONSULTA
</button>
)}
</div>
 
 }

</div>

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

   </div>  

   {/*BOTON PARA FINALIZAR CONSULTA (ENVIARA PROPUIESTA INTERCONSULTA) */}
   <div>
   {cargando || !datosCargados ? ( 
  <p className=""></p>)  :
 <div>
{showButton && (
  <div className="fixed bottom-0 right-0 p-4">
    <button onClick={handleFinalizar} className="text-[14px] bg-gradient-to-r from-coral-200 to-coral-300 hover:from-coral-100 hover:to-coral-300 px-3 py-1.5 rounded-full shadow-lg text-white font-semibold">
      Finalizar la consulta
    </button>
  </div>
)}

</div>
 } 
</div>
   {/*BOTON PARA ABIR SECCIÓN DE SIGNOS DE ALARMA*/}
   <div>
   {cargando || !datosCargados ? ( 
  <p className=""></p>)  :
 <div>
{showButton && (
  <div className="fixed bottom-28 right-0 p-4">
  <button
    onClick={abrirFormularioSignos}
    className="flex flex-col items-center text-[14px] bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-200 hover:to-blue-500 px-3 py-1.5 rounded-full shadow-lg text-white "
  >
    <div className="text-lg text-blue-900">
      <BsFillExclamationOctagonFill />
    </div>
    <div className="text-xs text-white">
      Signos de alarma
    </div>
  </button>
</div>



)}

</div>
 } 
</div>




{mostrarFormularioSignos && (
  <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div className="bg-white p-2 mx-10 my-10 rounded-lg w-full">
    <div className="flex justify-end">
      <button onClick={cerrarFormularioSignos}>
        <AiFillCloseCircle className="text-3xl text-coral-300 hover:text-coral-100" />
      </button>
    </div>
    <div>
      <h1 className="text-center text-lila-300  font-bold mb-6 text-xl">Signos de alarma</h1>
    </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-8  ">
<div className="col-span-1 bg-white p-12 rounded-lg border border-zinc-900 flex flex-col">
  <div>
        <h1 className="text-center text-lila-300 font-bold mb-6 text-xl">
          {datosPacienteMotivo.signosdealarma === null || datosPacienteMotivo.signosdealarma === undefined || datosPacienteMotivo.signosdealarma===''
            ? 'Registro de signos de alarma'
            : 'Actualiza los signos de alarma'}
        </h1>
      </div>
  {signoscontenido.map((value, index) => (
    <div key={index} className="mb-4 w-full flex">
      <label htmlFor={`input-${index}`} className="text-md mb-2 mr-1 ">
        {index + 1}.-
      </label>
      <input
        id={`input-${index}`}
        type="text"
        value={value}
        onChange={(event) => handleInputChangeSignos(index, event)}
        className="border p-2 rounded-lg text-sm px-2 w-full"
        onKeyDown={handleKeyDownSignos}
      />
      
      {index > 0 && (
        <button
          className="px-3 py-1 ml-1 text-md rounded-md text-white bg-lila-200 hover:bg-lila-100 mt-2"
          onClick={() => removeInputSignos(index)}
        >
          X
        </button>
      )}
    </div>
  ))}
  <div className="flex justify-center">
  <button
    className="px-4 py-2 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100"
    onClick={addInputSignos}
  >
    Agregar indice
  </button>
  </div>
</div>

  <div className="col-span-1 grid gap-8">
    <div className=" bg-white p-8 rounded-lg border border-zinc-900">
    <div className="flex justify-center px-1 py-1 ">
                  <label htmlFor="orden" className="mr-2 text-md font-semibold">Buscar:</label>
                  <input type="text" value={buscarSignosValue} onChange={(e) => setBuscarSignosValue(e.target.value)} placeholder="Buscar signos de alarma" className="p-1 border rounded-md w-full placeholder:text-sm" />

                </div>
    </div>
    <div className="row-span-1 bg-white p-1 sm:p-12 rounded-lg border border-zinc-900">
    <div className="">
  {signosfiltrados.slice((paginaSignos - 1) * porPaginaSignos, (paginaSignos - 1) * porPaginaSignos + porPaginaSignos).map((me) => (
    <div key={me._id} className="py-2 border border-neutral-800 cursor-pointer hover:bg-gray-100" onClick={() => copiarAlPortapapelesSignos(me.nombre, me.contenido)}>
      <div className="flex justify-end ">
        <button className="px-2 py-1 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100" onClick={() => copiarAlPortapapelesSignos(me.nombre, me.contenido)}>
          <FaCopy />
        </button>
      </div>  
      <p className="text-center text-sm font-semibold">{me.nombre || ''}</p>
      {Array.isArray(me.contenido) ? (
        me.contenido.map((linea, index) => (
          <p key={index} className="text-xs bg-gray-100 px-2 p-1 ">{`${index + 1}.- ${linea}`}</p>
        ))
      ) : (
        <p className="text-xs bg-gray-100 px-2 p-1 ">{me.contenido}</p>
      )}

      <p className="text-left text-sm font-semibold"> Fuente:{me.fuente || ''}</p>
      <div className="text-left text-sm font-semibold flex"> Publicado por:{me.anonimo ===false ?<p> {me.profesional.nombres} {me.profesional.apellidos} </p> :'Anónimo'}</div>

      <hr />
    </div>
  ))}
</div>

   {signosfiltrados.length ? (
  <Paginacion
    maximo={maximosignos}
    pagina={paginaSignos}
    setPagina={setPaginaSignos}
  />
) : (

  <div> <h1 className="text-center">Aún no hay datos para filtrar </h1> </div>
)}


    </div>
  </div>
</div>

    <div className="flex justify-center mt-8">
      {showButton && (
        <button onClick={actualizarMotivoSignos} className="px-6 py-2 text-sm rounded-md text-white bg-lila-200 hover:bg-lila-100">
          Guardar información
        </button>
      )}
    </div>
  </div>
</div>

    )}

    </>
  )
}
export default FormularioLlenarConsulta