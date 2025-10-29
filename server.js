const express = require('express');
const path = require('path');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://nicolasperrenoud_db_user:xSjxRbmCjNlQCrQr@cluster0.xr6eiwi.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);

// Routes API (backend)
app.get('/api/pokemons', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('pokemons');
    const collection = database.collection('pokemons');
    const pokemons = await collection.find({}).toArray();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/pokemons/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('pokemons');
    const collection = database.collection('pokemons');
    const pokemon = await collection.findOne({ id: parseInt(req.params.id) });
    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon non trouvé' });
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Servir les fichiers statiques Angular depuis dist/ton-app/browser
app.use(express.static(path.join(__dirname, 'dist/angular-pokedex-app/browser')));

// Rediriger toutes les routes vers index.html (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-pokedex-app/browser/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});