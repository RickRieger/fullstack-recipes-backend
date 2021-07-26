const Grocery = require("../model/Grocery");
const User = require('../../user/model/User.js');

async function getAllGroceryItems(req, res, next) {
  try {
    const { decodedJwt } = res.locals;

    // let allGroceryItems = await Grocery.find({});
    // res.json({ payload: allGroceryItems });
    let allGroceryItems = await User.findOne({ email: decodedJwt.email })
    .populate({
      path: 'grocery',
      model: Grocery,
      select: '-__v',
    })
    .select('-email -password -firstName -lastName -__v -_id -userName -friends -recipes');

    res.json({ payload: allGroceryItems });

  } catch (e) {
    next(e)
    // res.status(500).json({ message: e.message, error: e });
  }
}

async function createGroceryItem(req, res, next) {
  
  
  try {
    let createdGroceryItem = new Grocery({
      grocery: req.body.grocery,
    });
    let savedGroceryItem = await createdGroceryItem.save();

    const { decodedJwt } = res.locals;
 
    const foundTargetUser = await User.findOne({ email: decodedJwt.email });
    foundTargetUser.grocery.push(savedGroceryItem._id);
    await foundTargetUser.save();
    res.json({ payload: savedGroceryItem });
  } catch (e) {
    next(e);

    // res.status(500).json({ message: e.message, error: e });
  }
}

async function updateGrocery(req, res, next) {
  
    let updateObj = {};
    let body = req.body;
    for (let key in body) {
      if (body[key] !== '') {
        updateObj[key] = body[key];
      }
    }



    try {
    let updatedGrocery = await Grocery.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    ).select('-__v');
    res.json({
      message: 'success',
      payload: updatedGrocery,
    });
  } catch (e) {
    next(e);
    // res.status(500).json({ message: e.message, error: e });
  }
}

async function updateGroceryPurchased(req, res, next) {
  try {
    let updatedGroceryDone = await Grocery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ payload: updatedGroceryDone });
  } catch (e) {
    next(e);
    // res.status(500).json({ message: e.message, error: e });
  }
}

async function deleteGrocery(req, res, next) {
  try {
    let deletedGrocery = await Grocery.findByIdAndRemove(req.params.id);
    
    const { decodedJwt } = res.locals;
    console.log(decodedJwt.email);
    let foundUser = await User.findOne({ email: decodedJwt.email });
    
    let foundGroceryArray = foundUser.grocery;
    console.log('here', foundGroceryArray);
    let filteredGroceryArray = foundGroceryArray.filter((id) => {

      return id.toString() !== deletedGrocery._id.toString();

    });
    
    foundUser.grocery = filteredGroceryArray;

    await foundUser.save();


    res.json({ message: "success", payload: deletedGrocery });
  } catch (e) {

    next(e);
  }
}

async function sortGroceryByDate(req, res, next) {
  try {
    console.log(req, res)
    let sort = req.query.sort;
    let sortOrder = sort === "desc" ? -1 : 1;
    let foundGrocery = await Grocery.find({}).sort({ Date: sortOrder });
    res.json({ payload: foundGrocery });
  } catch (e) {
    // res.status(500).json({ message: e.message, error: e });
    next(e);

  }
}

async function sortGroceryByPurchased(req, res, next) {
  try {
    
    let purchased = req.query.isPurchased;
    let isPurchasedOrder = purchased === "true" ? true : false;
    let sortByDate = req.query.sort ? req.query.sort : null;
    let finalSort;
    if (!sortByDate) {
      finalSort = null;
    } else {
      console.log(sortByDate);
      finalSort = sortByDate === "asc" ? 1 : -1;
    }
    let foundGrocery= await Grocery.find({ purchased: isPurchasedOrder }).sort({
      Date: finalSort,
    });
    res.json({ payload: foundGrocery });
  } catch (e) {
    next(e);
  }
}

// async function sortGroceryByPurchased(req, res) {
//   try {
//     let isPurchased = req.query.isPurchased;
//     let isPurchasedOrder = isPurchased === "true" ? true : false;
//     let foundGrocery = await Grocery.find({ purchased: isPurchasedOrder });
//     res.json({ payload: foundGrocery });
//   } catch (e) {
//     res.status(500).json({ message: e.message, error: e });
//   }
// }

module.exports = {
  getAllGroceryItems,
  createGroceryItem,
  updateGrocery,
  updateGroceryPurchased,
  deleteGrocery,
  sortGroceryByDate,
  sortGroceryByPurchased
};