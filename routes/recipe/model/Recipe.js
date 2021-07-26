const mongoose = require("mongoose");
const RecipeSchema = new mongoose.Schema({
  label: {
    type: String,
  },
  image: {
    type: String,
  },
  ingredients: {
    type: Array,
  },
  directionsUrl: {
    type: String,
  },

});
module.exports = mongoose.model("recipe", RecipeSchema);