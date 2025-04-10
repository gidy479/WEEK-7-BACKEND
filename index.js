const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

//  Connect to MongoDB
mongoose.connect('mongodb+srv://gideontetteh792:CjkLE3grbCxUCWGL@cluster0.tzlhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log(' MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Shoe Schema
const shoeSchema = new mongoose.Schema({
  name: String,
  category: String,
  size: Number,
  price: Number,
  maleShoe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaleShoe'
  }
});

//Model
const Shoe = mongoose.model('Shoe', shoeSchema);

// MaleShoe Schema
const maleShoeSchema = new mongoose.Schema({
  brand: String,
  category: String,
  size: Number
});

//Model MaleShoe
const MaleShoe = mongoose.model('MaleShoe', maleShoeSchema);




// ROUTES

// Add a new shoe
app.post('/shoes', async (req, res) => {
  try {
    const newShoe = new Shoe(req.body);
    const saved = await newShoe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//  Get all shoes (with maleShoe populated)
app.get('/shoes', async (req, res) => {
  try {
    const shoes = await Shoe.find().populate('maleShoe');
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Create a new MaleShoe
app.post('/male-shoes', async (req, res) => {
  try {
    const maleShoe = new MaleShoe(req.body);
    const saved = await maleShoe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Link MaleShoe to a Shoe
app.put('/shoes/:id/link-male', async (req, res) => {
  try {
    const updatedShoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      { maleShoe: req.body.maleShoeId },
      { new: true }
    ).populate('maleShoe');
    res.json(updatedShoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Update a Shoe
app.put('/shoes/:id', async (req, res) => {
  try {
    const updated = await Shoe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Shoe not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Shoe
app.delete('/shoes/:id', async (req, res) => {
  try {
    const deleted = await Shoe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Shoe not found' });
    res.json({ message: 'Shoe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
