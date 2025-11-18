const express = require('express');
const path = require('path');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


app.use(cors({
  origin: ['http://localhost:4200', 'https://pokedex.blizzardaudioclub.ch'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Routes API
// Récupérer tous les pokémons
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

// Récupérer un pokémon par son ID
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

// Mettre à jour un pokémon par son ID
app.put('/api/pokemons/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('pokemons');
    const collection = database.collection('pokemons');
    
    const { _id, ...updatedPokemon } = req.body; // Exclure le champ _id
    const result = await collection.updateOne(
      { id: parseInt(req.params.id) }, // Utiliser le champ id pour la recherche
      { $set: updatedPokemon } // Mettre à jour avec les nouvelles données
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Pokemon non trouvé' });
    }
    res.json(updatedPokemon); // Retourner les données mises à jour
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un nouveau pokémon
app.post('/api/pokemons', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('pokemons');
    const collection = database.collection('pokemons');

    const newPokemon = { ...req.body };
    delete newPokemon._id; // ne pas propager _id venant du client

    // calculer un id numérique : max(id) + 1
    const last = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = (last[0] && typeof last[0].id === 'number') ? last[0].id + 1 : 1;
    newPokemon.id = nextId;

    // ajouter created si absent
    newPokemon.created = newPokemon.created || new Date().toISOString();

    const result = await collection.insertOne(newPokemon);
    const inserted = await collection.findOne({ _id: result.insertedId });

    res.status(201).json(inserted);
  } catch (error) {
    console.error('POST /api/pokemons error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un pokémon par son ID
app.delete('/api/pokemons/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('pokemons');
    const collection = database.collection('pokemons');
    const result = await collection.deleteOne({ id: parseInt(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Pokemon non trouvé' });
    }
    res.json({ message: 'Pokemon supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Servir les fichiers statiques Angular depuis le dossier 'dist'
app.use(express.static(path.join(__dirname, 'dist/angular-pokedex-app/browser')));

// Rediriger toutes les routes vers index.html (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-pokedex-app/browser/index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});