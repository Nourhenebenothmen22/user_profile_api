const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// 🔹 CREATE
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "L'email est requis" });
    }

    const newUser = new User({
      name,
      email,
      profileImage: req.file ? req.file.filename : undefined
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    }
    res.status(500).json({ error: error.message });
  }
};

// 🔹 READ ALL
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 READ ONE
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 UPDATE
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if ('name' in req.body) user.name = req.body.name;
    if ('email' in req.body) user.email = req.body.email; 

    // 🔄 Mise à jour de l'image (inchangé)
    if (req.file) {
      if (user.profileImage) {
        const oldPath = path.join(__dirname, '..', 'Storage', user.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profileImage = req.file.filename;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    // Gestion améliorée des erreurs
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    }
    if (error.code === 11000) { // Gestion des doublons d'email
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    res.status(500).json({ error: error.message });
  }
};

// 🔹 DELETE
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Supprimer l'image associée s'il y en a une
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', 'Storage', user.profileImage);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
