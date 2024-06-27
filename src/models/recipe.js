const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  image: String,
  summary: String,
  sourceUrl: String,
  instructions: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Recipe = mongoose.model('Recipes', recipeSchema);

module.exports = Recipe;
