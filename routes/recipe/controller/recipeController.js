const Recipe = require('../model/Recipe');
const User = require('../../user/model/User.js');

const getAllRecipes = async (req, res,next) => {
  try {
    const { decodedJwt } = res.locals;

    let payload = await User.findOne({ email: decodedJwt.email })
      .populate({
        path: 'recipes',
        model: Recipe,
        select: '-__v',
      })
      .select('-email -password -firstName -lastName -__v -_id -userName -friends -grocery');

    res.json(payload);
  } catch (e) {
    next(e)
  }
};
const createRecipe = async (req, res, next) => {
  try {
    const { label, image, ingredients, directionsUrl  } = req.body;
    const newRecipe = new Recipe({
      label,
      image,
      ingredients,
      directionsUrl
    });
    const savedNewRecipe = await newRecipe.save();
    const { decodedJwt } = res.locals;

   
    const foundTargetUser = await User.findOne({ email: decodedJwt.email });
    foundTargetUser.recipes.push(savedNewRecipe._id);
    await foundTargetUser.save();
    res.json(savedNewRecipe);
  } catch (e) {
    next(e)
  }
};
const deleteRecipeById = async (req, res, next) => {
  try {
    let deletedRecipe = await Recipe.findByIdAndRemove(req.params.id);

    const { decodedJwt } = res.locals;

    let foundUser = await User.findOne({ email: decodedJwt.email });

    let foundRecipeArray = foundUser.friends;



    let filteredRecipesArray = foundRecipeArray.filter((id) => {

      return id.toString() !== deletedRecipe._id.toString();

    });

    foundUser.recipe = filteredRecipesArray;

    await foundUser.save();

    res.json({ message: "success", payload: deletedRecipe});
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  deleteRecipeById,
};
