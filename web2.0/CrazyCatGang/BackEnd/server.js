const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../', 'FrontEnd', 'formulario')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:8zmSR64N8UmtVEhT@clusterccg.yjs1evk.mongodb.net/cats?retryWrites=true&w=majority&appName=ClusterCCG", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema
const rescueRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    characteristics: { type: String, required: true },
    observations: { type: String, required: true },
});

// Define a model
const FormData = mongoose.model('RescueRequest', rescueRequestSchema);

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'FrontEnd', 'formulario', 'formulario.html'));
});

// Handle form submission
app.post('/api/rescueRequests', async (req, res) => {
    const { name, email, phone, address, characteristics, observations } = req.body;
    const formData = new FormData({ name, email, phone, address, characteristics, observations });

    try {
        await formData.save();
        res.json({ message: 'Data saved successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data: ' + err.message });
    }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});