import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportForm.css';
import LogoutButton from './LogoutButton';
import ParameterInput from './ParameterInput'; // Asegúrate de importar el nuevo componente

const dominio = "http://localhost:7007";

const ReportForm = ({ token, setToken  }) => {
  const [reports, setReports] = useState([]); // Lista de reportes disponibles
  const [selectedReport, setSelectedReport] = useState(''); // Reporte seleccionado
  const [parameters, setParameters] = useState([]); // Parámetros que necesita el reporte
  const [formData, setFormData] = useState({}); // Datos llenados por el usuario
  const [error, setError] = useState(''); // Manejar mensajes de error

  useEffect(() => {
    axios.get(`${dominio}/reportes/listaReportesDisponibles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setReports(response.data);
    }).catch((err) => {
      console.error('Error al cargar reportes:', err);
      setError('Error al cargar la lista de reportes');
    });
  }, [token]);

  const handleReportSelect = async (reportId) => {
    setSelectedReport(reportId);
    try {
      const response = await axios.get(`${dominio}/reportes/${reportId}/params`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParameters(response.data);
    } catch (err) {
      console.error('Error al cargar los parámetros:', err);
      setError('Error al cargar los parámetros');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.trim() !== '' ? value : prevFormData[name],
    }));
  };

  const validateParameters = () => {
    for (const param of parameters) {
      const value = formData[param.codigo];
      if (value === undefined || value === null || value.toString().trim() === '') {
        setError(`El parámetro ${param.etiqueta} no puede estar vacío.`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateParameters()) return;

    const requestData = { parameters: formData };

    try {
      const response = await axios.post(`${dominio}/reportes/generarReporte/${selectedReport}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-${selectedReport}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generando el reporte:', error);
      setError('Error generando el reporte.');
    }
  };

  return (
    <div className="container">
      <h1>Generar Reporte</h1>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="error-message">{error}</p>}
      </form>
      <LogoutButton setToken={setToken} />
    </div>
  );
};

export default ReportForm;
