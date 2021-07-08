const jwtMiddleware = require("../../utils/jwtMiddleware");
const Friend = require("../model/Friend");
const User = require("../../user/model/User.js");

const getAllFriends = async (req, res) => {
  try {
    const { decodedJwt } = res.locals;
    let payload = await User.findOne({ email: decodedJwt.email })
      .populate({
        path: "friends",
        model: Friend,
        select: "-__v",
      })
      .select("-email -password -firstName -lastName -__v -_id -username");
    res.json(payload);
  } catch (e) {
    res.status(500).json({ e: e, message: e.message });
  }
};

const createFriend = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber } = req.body;
    const newFriend = new Friend({
      firstName,
      lastName,
      mobileNumber,
    });
    const savedNewFriend = await newFriend.save();
    //when you saved a friend - an ID is created from the databse
    const { decodedJwt } = res.locals;
    console.log(res.locals);
    //now we have to find the user ID
    const foundTargetUser = await User.findOne({ email: decodedJwt.email });
    foundTargetUser.friends.push(savedNewFriend._id);
    await foundTargetUser.save();
    res.json(savedNewFriend);
  } catch (e) {
    res.status(500).json({ e: e, message: e.message });
  }
};

const editFriend = () => {};

const deleteFriend = () => {};

module.exports = {
  getAllFriends,
  createFriend,
  editFriend,
  deleteFriend,
};