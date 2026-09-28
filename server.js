const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace the string below with your Atlas connection string
const mongoURI = 'mongodb+srv://equisplit_user:Wasey%400plm@cluster0.7nsrwgk.mongodb.net/equisplit_db?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const AppDataSchema = new mongoose.Schema({
    members: [String],
    expenses: Array
});

const AppData = mongoose.model('AppData', AppDataSchema);

app.get('/api/data', async (req, res) => {
    try {
        let data = await AppData.findOne();
        if (!data) data = { members: [], expenses: [] };
        res.json({ members: data.members, expenses: data.expenses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        const { members, expenses } = req.body;
        let data = await AppData.findOne();

        if (data) {
            data.members = members;
            data.expenses = expenses;
            await data.save();
        } else {
            data = new AppData({ members, expenses });
            await data.save();
        }
        res.json({ message: 'Data synced successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});