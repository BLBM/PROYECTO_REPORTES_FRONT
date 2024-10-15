// ReportForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportForm.css';
import ParameterInput from './ParameterInput'; // Asegúrate de importar el nuevo componente

const dominio = "http://localhost:7007";

const ReportForm = () => {
  const [reports, setReports] = useState([]); // Lista de reportes disponibles
  const [selectedReport, setSelectedReport] = useState(''); // Reporte seleccionado
  const [parameters, setParameters] = useState([]); // Parámetros que necesita el reporte
  const [formData, setFormData] = useState({}); // Datos llenados por el usuario
  const [error, setError] = useState(''); // Manejar mensajes de error

  // Cargar la lista de reportes disponibles desde la API
  useEffect(() => {
    axios.get(`${dominio}/reportes/listaReportesDisponibles`).then((response) => {
      setReports(response.data);
    });
  }, []);

  // Cuando el usuario selecciona un reporte, cargar sus parámetros
  const handleReportSelect = async (reportId) => {
    setSelectedReport(reportId);
    const response = await axios.get(`${dominio}/reportes/${reportId}/params`);
    setParameters(response.data); // Aquí tendrás los parámetros específicos para ese reporte
  };

  // Manejar los cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.trim() !== '' ? value : prevFormData[name],
    }));
  };
  

  // Validar parámetros antes de enviar el formulario
  const validateParameters = () => {
    for (const param of parameters) {
      const value = formData[param.codigo];
      //console.log(formData);
      if (value === undefined || value === null || value.toString().trim() === '') {
        setError(`El parámetro ${param.etiqueta} no puede estar vacío.`);
        return false;
      }
    }
    setError('');
    return true;
  };


  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    if (!validateParameters()) return; // Validar antes de enviar

    const requestData = {
      parameters: formData, // Enviar los parámetros llenos
    };

    try {
      const response = await axios.post(`${dominio}/reportes/generarReporte/${selectedReport}`, requestData, {
        responseType: 'blob',
      });

      // Descargar el archivo CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-${selectedReport}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generando el reporte:', error);
      setError('Error generando el reporte.'); // Manejar el error
    }
  };


  return (
    <div className="container">
      <h1>Generar Reporte</h1>
      <form onSubmit={handleSubmit}>
        {/* Seleccionar el reporte */}
        <div>
          <label>Selecciona un reporte:</label>
          <select onChange={(e) => handleReportSelect(e.target.value)} value={selectedReport}>
            <option value="">-- Selecciona un reporte --</option>
            {reports.map((report) => (
              <option key={report.reportes_disponibles_id} value={report.reportes_id}>
                {report.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campos dinámicos basados en el reporte seleccionado */}
        {parameters.length > 0 && (
          <div>
            <h3>Llena los parametros</h3>
            <ParameterInput 
              parameters={parameters} 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          </div>
        )}

        <button type="submit" disabled={!selectedReport}>
          Generar Reporte
        </button>
        {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error si existe */}
      </form>
    </div>
  );
};

export default ReportForm;