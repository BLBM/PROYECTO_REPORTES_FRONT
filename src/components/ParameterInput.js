// ParameterInput.js
import React from 'react';

const ParameterInput = ({ parameters, formData, handleInputChange }) => {
  return (
    <div>
      <h3>Llena los parámetros:</h3>
      {parameters.map((param) => (
        <div key={param.codigo}>
          <label>{param.etiqueta}:</label>
          <input
            type={
              param.tipo_dato === 'DATE' ? 'date' :
              param.tipo_dato === 'NUMERIC' ? 'number' :
              'text' // Valor por defecto si es texto u otro tipo
            }
            name={param.codigo}
            defaultValue={formData[param.param_name] || ''} // Usar defaultValue para evitar el bloqueo de escritura
            onChange={handleInputChange}
          />
        </div>
      ))}
    </div>
  );
};

export default ParameterInput;