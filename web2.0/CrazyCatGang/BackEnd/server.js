const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../', 'FrontEnd', 'formulario')));
app.use(express.static(path.join(__dirname, '../', 'FrontEnd', 'SignIn')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:8zmSR64N8UmtVEhT@clusterccg.yjs1evk.mongodb.net/cats?retryWrites=true&w=majority&appName=ClusterCCG", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define schemas
const rescueRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    characteristics: { type: String, required: true },
    observations: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
});

// Models
const RescueFormData = mongoose.model('RescueRequest', rescueRequestSchema);
const UserFormData = mongoose.model('User', userSchema);

// Serve the HTML form
app.get('/rescueRequests', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'FrontEnd', 'formulario', 'formulario.html'));
});

app.get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'FrontEnd', 'SignIn', 'cadastro.html'));
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'formSavedSuccessfully', 'success.html'));
});

// Handle user registration
app.post('/api/signIn', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const userCount = await UserFormData.countDocuments({ email });

        if (userCount > 0) {
            return res.send(`
                <script>
                    alert('Email em uso!');
                    window.location.href = '/signIn';
                </script>
            `);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userFormData = new UserFormData({ name, email, phone, password: hashedPassword });
        
        await userFormData.save();
        res.redirect('/success');
    } catch (err) {
        res.status(500).json({ message: 'Error saving data: ' + err.message });
    }
});

// Handle rescue request submission
app.post('/api/rescueRequests', async (req, res) => {
    const { name, email, phone, address, characteristics, observations } = req.body;

    try {
        const rescueFormData = new RescueFormData({ name, email, phone, address, characteristics, observations });
        await rescueFormData.save();
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