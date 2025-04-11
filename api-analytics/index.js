const express = require('express');
const app = express();
const port = 3000;
let registros = {};

app.use(express.json());
const ruta = "/api.registro";


app.post('${ruta}/countRegisters', (req, res) => {
  const serviceId = req.headers['x-service-id'];
  if (!serviceId) {
    return res.status(400).send('X-Service-ID header is required');
  }
  
  registros[serviceId] = (registros[serviceId] || 0) + 1;
  
  res.json({
    service: serviceId,
    count: registros[serviceId],
    total: Object.values(registros).reduce((a, b) => a + b, 0)
  });
});

app.get('${ruta}/reporte', (req, res) => {
  res.json(registros);
});

app.listen(port, () => {
  console.log(`API Registro listening at http://localhost:${port}`);
});