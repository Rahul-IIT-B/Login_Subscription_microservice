// config/rabbitmq.js
const amqp = require('amqplib');
let channel;

/**
 * Establish connection & channel, declare a topic exchange.
 */
async function connect() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertExchange('subscriptions', 'topic', { durable: true });
}

/**
 * Publish a JSON message to the topic exchange.
 */
function publish(routingKey, message) {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  channel.publish(
    'subscriptions',
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
}

module.exports = { connect, publish };
