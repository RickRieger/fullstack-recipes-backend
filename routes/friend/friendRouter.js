const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware"); 

const { createFriend, getAllFriends } = require("./controller/friendController");



router.get("/get-all-friends", jwtMiddleware, getAllFriends)
router.post("/create-friend", jwtMiddleware, createFriend);

module.exports = router;