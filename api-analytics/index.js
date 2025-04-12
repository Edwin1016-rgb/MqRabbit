const amqp = require('amqplib');
const express = require('express');
const app = express();
const RETRY_DELAY = 5000; // 5 segundos entre reintentos

let registros = {};
let channel = null;
let connection = null;

async function connectToRabbit() {
  try {
    console.log('Conectando a RabbitMQ...');
    connection = await amqp.connect('amqp://admin:password@rabbitmq:5672', {
      timeout: 10000 // 10 segundos de timeout
    });
    
    console.log('Conexión RabbitMQ establecida');
    channel = await connection.createChannel();
    await channel.assertQueue('eventos_analytics', { durable: true });
    
    channel.consume('eventos_analytics', (msg) => {
      try {
        const { serviceId } = JSON.parse(msg.content.toString());
        registros[serviceId] = (registros[serviceId] || 0) + 1;
        console.log(`Registro procesado: ${serviceId}`);
        channel.ack(msg);
      } catch (err) {
        console.error('Error procesando mensaje:', err);
      }
    });
    
  } catch (err) {
    console.error('Error de conexión RabbitMQ:', err.message);
    // Reconexión automática
    setTimeout(connectToRabbit, RETRY_DELAY);
  }
}

// Manejo de cierre limpio
process.on('SIGTERM', async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  process.exit(0);
});

// Endpoint con chequeo de salud
app.get('/reporte', (req, res) => {
  if (!channel) {
    return res.status(503).json({ 
      error: 'No conectado a RabbitMQ',
      registros: {} 
    });
  }
  res.json(registros);
});

// Inicio
app.listen(3000, '0.0.0.0', () => {
  console.log('API Analytics escuchando en 3000');
  connectToRabbit();
});