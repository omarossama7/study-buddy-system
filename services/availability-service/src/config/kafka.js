const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'availability-service',
  brokers: ['localhost:9092'], 
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer Connected');
};

const sendEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
};

module.exports = {
  connectProducer,
  sendEvent,
};