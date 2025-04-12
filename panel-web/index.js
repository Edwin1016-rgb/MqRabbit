const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.get('/panel.web/status', async (req, res) => {
  try {
    const response = await axios.get('http://api-analytics:3000/reporte', {
      timeout: 5000 // 5 segundos de timeout
    });
    
    const registros = response.data;
    res.json({
      registros,
      total: Object.values(registros).reduce((a, b) => a + b, 0),
      status: 'success'
    });
  } catch (error) {
    console.error('Error al consultar api-analytics:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'No se pudo obtener el estado',
      details: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Panel web escuchando en puerto ${PORT}`);
});