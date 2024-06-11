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
app.use(express.static(path.join(__dirname, '../', 'FrontEnd', 'adm')));


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
    characteristics: { type: String, required: false },
    observations: { type: String, required: false },
}, {
    timestamps: true
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timeStamps: true
});

// Models
const RescueFormData = mongoose.model('RescueRequest', rescueRequestSchema);
const UserFormData = mongoose.model('User', userSchema);

// Serve the HTML form
app.get('/rescueRequests', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'FrontEnd', 'formulario', 'formulario.html'));
});

app.get('/api/rescueRequests', async (req, res) => {
    try {
        const rescues = await RescueFormData.find({});
        res.status(200).json(rescues)

    } catch(err) {
        res.status(500).json( {message: err.message} )
    }
})

app.get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'FrontEnd', 'SignIn', 'cadastro.html'));
});

app.get('/adm', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'FrontEnd', 'adm', 'adm.html'));
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
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const fiveMinutesAgo = new Date(Date.now() - 30000);

        // Check for existing entry within the last 5 minutes
        const recentRequest = await RescueFormData.findOne({ email, phone, createdAt: { $gte: fiveMinutesAgo } });

        if (recentRequest) {
            return res.status(409);
        }

        const rescueFormData = new RescueFormData({ name, email, phone, address, characteristics, observations });
        await rescueFormData.save();
        res.redirect('/success');
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