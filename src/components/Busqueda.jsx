import React from 'react';

function Busqueda({ criterio, setCriterio }) {
  return (
    <input 
      type="text" 
      className="form-control mb-3" 
      placeholder="Buscar por nombre o categoría" 
      value={criterio}
      onChange={(e) => setCriterio(e.target.value)}
    />
  );
}

export default Busqueda;
