import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import clientAxios from '../../config/axios';
import useAuth from '../../hooks/useAuth';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f3f6f4',
  },
  section: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    fontSize: 8,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 10,
    flex: 1,
  },
  fieldLabelSin: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    marginBottom:2
  },
  fieldValue: {
    flex: 2,
    fontSize: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#999999',
    marginVertical: 5,
  },
});
const Historiaclinicapdf = () => {
  const [pdfData, setPdfData] = useState(null);
  const [paciente, setPaciente] = useState(null); // Almacena el objeto paciente en el estado

  const { auth } = useAuth();

  const obtenerDatosYGenerarPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await clientAxios.get(`/pacientes/historiaclinica/${auth._id}`, config);
      const pacienteData = response.data;

      setPaciente(pacienteData); // Almacena el objeto paciente en el estado
      const generatedPDF = (
        <Document>
        <Page size="A4" style={styles.page}>
                {/*   <Image source={logoImage} style={styles.logo} /> */}
        <View style={styles.header}>
        
          <Text style={styles.header}>Cimiento clinico</Text>
          </View>
          <Text style={styles.title}>HISTORIA CLÍNICA</Text>
          {/* Esta es la ficha de la identificacion */}
          <View style={styles.section}>
            <Text style={styles.title}>Ficha de identificación</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Rut: {pacienteData.paciente.rut}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nombre Completo: {pacienteData.paciente.nombres} {pacienteData.paciente.apellidos}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Localidad: {pacienteData.paciente.localidad || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Previsión de salud: {pacienteData.paciente.previsionsalud || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Lugar de atención: {pacienteData.paciente.lugardeatencion || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Ocupación: {pacienteData.paciente.ocupacion || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Escolaridad: {pacienteData.paciente.escolaridad || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Sexo: {pacienteData.paciente.sexo || ''}</Text>
            </View>
          </View>
  
          <View style={styles.section}>
            {/* Esta es los antecedentens morbidos */}
            <Text style={styles.title}>Antecedentes Mórbidos</Text>
            {pacienteData.enfermedades.length > 0 ? (
              pacienteData.enfermedades.map(enfermedad => (
                <View key={enfermedad._id}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Diagnóstico: {enfermedad.nombre} {enfermedad.fechadiagnostico || ''}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Observaciones: {enfermedad.obsdiagnostico || ''}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.fieldLabelSin}>Sin datos registrados</Text>
            )}
          </View>
  
          <View style={styles.section}>
            {/* Esta es la seccion de farmacos */}
            <Text style={styles.title}>Tratamiento farmacológico</Text>
            {pacienteData.farmacos.length > 0 ? (
              pacienteData.farmacos.map(farmaco => (
                <View key={farmaco._id}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Tratamiento farmacológico: {farmaco.nombre} {farmaco.dosis} {farmaco.formato} {farmaco.tipodeuso}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.fieldLabelSin}>Sin datos registrados</Text>
            )}
          </View>
  
          <View style={styles.section}>
            {/* Esta es la seccion de farmacos suspendidos */}
            <Text style={styles.title}>Tratamiento farmacológico Suspendidos</Text>
            {pacienteData.farmacosprevio.length > 0 ? (
              pacienteData.farmacosprevio.map(farmacoprevio => (
                <View key={farmacoprevio._id}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Tratamiento farmacológico suspendido: {farmacoprevio.nombre}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Información: {farmacoprevio.dosis} {farmacoprevio.formato} {farmacoprevio.tipodeuso}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.fieldLabelSin}>Sin datos registrados</Text>
            )}
          </View>
  
          <View style={styles.section}>
            {/* Esta es la seccion de antecedentes quirúrgicos */}
            <Text style={styles.title}>Antecedentes quirúrgicos</Text>
            {pacienteData.quirurgico.length > 0 ? (
              pacienteData.quirurgico.map(qui => (
                <View key={qui._id}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Antecedente quirúrgico: {qui.nombre} {qui.anio}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.fieldLabelSin}>Sin datos registrados</Text>
            )}
          </View>
  
          <View style={styles.section}>
            {/* Esta es la seccion de antecedentes familiares */}
            <Text style={styles.title}>Antecedentes familiares</Text>
            {pacienteData.antecedentes.length > 0 ? (
              pacienteData.antecedentes.map(ante => (
                <View key={ante._id}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Antecedente familiar: {ante.nombrediagnostico} {ante.familiar}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.fieldLabelSin}>Sin datos registrados</Text>
            )}
          </View>
  
          <View style={styles.section}>
            {/* Esta es la seccion de alergias */}
            <Text style={styles.title}>Alergias</Text>
            {pacienteData.alergias.length > 0 ? (
              pacienteData.alergias.map(ale => (
                <View key={ale._id}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Alergias: {ale.nombre}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.fieldLabelSin}>Sin datos registrados</Text>
            )}
          </View>
  
          <View style={styles.section}>
            {/* Esta es la seccion de datos adicionales para mujeres */}
            {pacienteData.paciente.sexo === 'Mujer' ? (
              <View >
                <Text style={styles.title}>Antecedente Ginecoobstetricos</Text>
                 <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Gestaciones: {pacienteData.paciente.gestaciones}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Perdidas: {pacienteData.paciente.perdidas}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Partos: {pacienteData.paciente.partos}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Cesáreas: {pacienteData.paciente.cesareas}</Text>

                  </View>
                  <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Menarquia: {pacienteData.paciente.menarquia}</Text>

                  </View>
                  <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Última regla: {pacienteData.paciente.ultimaregla}</Text>

                  </View>
                  <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Último PAP: {pacienteData.paciente.ultimopap}</Text>
                  </View>

              </View>
            ) : null}
          </View>
        </Page>
      </Document>
      );

      setPdfData(generatedPDF);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerDatosYGenerarPDF();
  }, []);

  const fileName = paciente ? `HistoriaClinica_${paciente.paciente.nombres}_${paciente.paciente.apellidos}.pdf` : 'HistoriaClinica.pdf'; // Genera el nombre del archivo usando el objeto paciente

  return (
    <>
      <div>
        {pdfData && (
          <PDFDownloadLink document={pdfData} fileName={fileName}>
            Descargar tu historia clínica
          </PDFDownloadLink>
        )}
      </div>
    </>
  );
};

export default Historiaclinicapdf;
