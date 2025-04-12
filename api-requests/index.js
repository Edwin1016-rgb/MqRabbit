const amqp = require('amqplib');
const express = require('express');  // Solo si necesitas HTTP
const app = express();
const SERVICE_ID = process.env.SERVICE_ID;

// Publicador RabbitMQ
async function publishMessage() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
    
    channel.sendToQueue(
      process.env.RABBITMQ_QUEUE,
      Buffer.from(JSON.stringify({ 
        serviceId: SERVICE_ID,
        timestamp: new Date().toISOString()
      }))
    );
    console.log(`[${SERVICE_ID}] Mensaje publicado`);
    setTimeout(() => conn.close(), 500);
  } catch (error) {
    console.error("Error en RabbitMQ:", error.message);
  }
}

// Publica cada 5 segundos
setInterval(publishMessage, 5000);

// Opcional: Endpoints HTTP (si los necesitas)
app.get('/', (req, res) => {
  res.send(`Cliente ${SERVICE_ID} funcionando`);
});

app.listen(4000, () => console.log(`Cliente ${SERVICE_ID} escuchando en 4000`));