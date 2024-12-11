const amqp = require('amqplib');
const { sendEmail } = require('./ludmilo');

let channel;

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const consumeMessages = async () => {
    try {
        const channel = getChannel();
        await channel.assertQueue('notificationQueue');

        channel.consume('notificationQueue', (message) => {
            if (message) {
                const { to, subject, text } = JSON.parse(message.content.toString());
                sendEmail(to, subject, text);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
};

const getChannel = () => channel;

module.exports = { connectToRabbitMQ, getChannel , consumeMessages};
