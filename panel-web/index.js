const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

app.get('panel.web/status', async (req, res) => {
  try {
    const response = await axios.get('http://localhost/api.registro/countRegisters');
    const registros = response.data;
    
    const status = {
      rutasActivas: [
        '/cliente/uno',
        '/cliente/dos',
        '/reporte'
      ],
      registros: registros,
      totalRegistros: Object.values(registros).reduce((a, b) => a + b, 0),
      clientesComunicados: Object.keys(registros)
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).send('Error al obtener el estado');
  }
});

app.listen(port, () => {
  console.log(`Monitor listening at http://localhost:${port}`);
});