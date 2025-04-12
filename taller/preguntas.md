# Preguntas Taller RabbitMQ

## 1. Beneficios frente a HTTP directo

- **Desacoplamiento**:
    Los servicios no necesitan conocerse entre sí, solo emiten y escuchan

- **Tolerancia a fallos**:
    Mensajes persisten aunque un servicio caiga, esto puede ser una ayuda, pero a la ves un peligro, se puede saturar o algo por el estilo.

- **Escalabilidad**:
    Puedes añadir más consumidores fácilmente, esto porque hay una cola y se le apuntaria a la cola.

- **Balanceo de carga**: 
    RabbitMQ distribuye mensajes automáticamente

## 2. Problemas con servicios caídos

- **Sin RabbitMQ**: 
    Pérdida inmediata de datos y errores en cascada, si no esta configurado los mensajes se pueden perder de una.

- **Con RabbitMQ**: 
  - Mensajes se acumulan en colas hasta que el servicio se recupere
  - Posible congestión si la caída es de un tiempo considerable 

## 3. Mejora de resiliencia

- **Reintentos automáticos**: 
    Los mensajes no confirmados se reencolan, van al final de la cola pero no se pierden

- **Persistencia**: 
    Mensajes sobreviven a reinicios del broker 

- **Patrón dead-letter**: 
    Manejo de mensajes fallidos, por si no se llegan a finalizar

## 4. Cambios en escalabilidad

- **Antes**: 
    Escalar requería balancear HTTP entre instancias

- **Ahora**:
  docker-compose up -d --scale api-analytics=3

  ## 5. formato de mensaje
  A mi parecer, un formato json seria lo mas facil, porque es facil de leer y tiene una estructura sencilla.

  en el proycto esta estructurado asi:

  {
  "registros": {
    "api-requests": 15
  },
  "total": 15,
  "status": "success"
  }

## 6. diagrama
![Image](https://github.com/user-attachments/assets/e1519460-6232-445d-bc5f-4215880a8aa8)

## 7. nueva estructura

## Estructura
- `api-requests/`: Publicadores de mensajes
- `api-analytics/`: Consumidor RabbitMQ + API HTTP
- `panel-web/`: Visualización  en json
