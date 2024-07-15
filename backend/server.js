const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const bodyparser = require('body-parser');
const cors = require('cors');

dotenv.config();

// App setup
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyparser.json());
app.use(cors());

// Mongoose setup
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define a schema and model
const passwordSchema = new mongoose.Schema({
    site: String,
    username: String,
    password: String
});

const Password = mongoose.model('Password', passwordSchema);

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const passwords = await Password.find();
        res.json(passwords);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

// Save a password
app.post('/', async (req, res) => {
    const password = new Password(req.body);
    try {
        const savedPassword = await password.save();
        res.send({ success: true, result: savedPassword });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

// Delete a password by id
app.delete('/:id', async (req, res) => {
    try {
        const deletedPassword = await Password.findByIdAndDelete(req.params.id);
        if (!deletedPassword) {
            return res.status(404).send({ success: false, message: 'Password not found' });
        }
        res.send({ success: true, result: deletedPassword });
    } catch (err) {
        console.error('Error deleting password:', err); // Log the error
        res.status(500).send({ success: false, message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
