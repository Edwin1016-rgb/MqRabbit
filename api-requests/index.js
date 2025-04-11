const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

const SERVICE_ID = process.env.SERVICE_ID;

app.get('/', (req, res) => {
  res.send(`Cliente App ${SERVICE_ID} funcionando`);
});

// Función para hacer solicitudes periódicas al api-registro
setInterval(async () => {
  try {
    // En las solicitudes al api-registro
    const response = await axios.post('http://localhost/api.registro/countRegisters', {}, {
        headers: {
        'X-Service-ID -------> ': SERVICE_ID
        }
    });
    console.log(`App ${SERVICE_ID} - Registro exitoso:`, response.data);
  } catch (error) {
    console.error(`App ${SERVICE_ID} - Error al registrar:`, error.message);
  }
}, 5000); // Cada 5 segundos

app.listen(port, () => {
  console.log(`Cliente App ${SERVICE_ID} listening at http://localhost:${port}`);
});