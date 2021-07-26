var express = require("express");
var router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware"); 


const {
  getAllGroceryItems,
  createGroceryItem,
  updateGrocery,
  updateGroceryPurchased,
  deleteGrocery,
  sortGroceryByDate,
  sortGroceryByPurchased,
} = require("./controller/groceryController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json(true);
});
router.get("/get-all-grocery-items", jwtMiddleware,getAllGroceryItems);
router.post("/create-grocery-item", jwtMiddleware,createGroceryItem);
router.put("/update-grocery-by-id/:id", jwtMiddleware,updateGrocery);
router.put("/update-purchased-by-id/:id", jwtMiddleware,updateGroceryPurchased);
router.delete("/delete-grocery-by-id/:id", jwtMiddleware,deleteGrocery);
router.get("/get-grocery-by-sort", jwtMiddleware, sortGroceryByDate);
router.get("/get-grocery-by-purchased", jwtMiddleware,sortGroceryByPurchased);
module.exports = router;
