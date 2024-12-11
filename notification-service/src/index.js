const express = require('express');
const bodyParser = require('body-parser');
const { connectToRabbitMQ } = require('./config/rabbitMQ');
const notificationRoutes = require('./routes/notificationRoutes')
const cors = require('cors');

const app = express();
require('dotenv').config();
app.use(cors());

const PORT = process.env.PORT || 3005;

app.use(bodyParser.json());

// Connect to RabbitMQ
connectToRabbitMQ();
app.use('/api/', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});
