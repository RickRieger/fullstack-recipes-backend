const bcrypt = require("bcryptjs");
const User = require("../model/User");

const jwt = require("jsonwebtoken");

async function signup(req, res, next) {
  console.log("request here man!")
  const { userName, email, password, firstName, lastName } = req.body;

  const { errorObj } = res.locals;

  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  }

  try {
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, salt);
    
    const createdUser = new User({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
    });
  
    let savedUser = await createdUser.save();
    console.log('dude....');
    res.json({ message: "success"});
  } catch (e) {
    // console.log(e);
    // console.log(e.message);
    // res.status(500).json({ message: "error", error: e });
    next(e);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email);
  const { errorObj } = res.locals;

  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  }

  try {
    let foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      res.status(400).json({
        message: "failure",
        payload: "Please check your email and password",
      });
    } else {
      //password = 1, foundUser.password = $2a$12$tauL3AEb5gvKdcQdDKNWLeIYv422jNq2aRsaNWF5J4TdcWEdhq4CO
      let comparedPassword = await bcrypt.compare(password, foundUser.password);

      if (!comparedPassword) {
        res.status(400).json({
          message: "failure",
          payload: "Please check your email and password",
        });
      } else {
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
          },
          process.env.PRIVATE_JWT_KEY,
          {
            expiresIn: "1d",
          }
        );

        res.json({ message: "success", payload: jwtToken });
      }
    }
  } catch (e) {
    res.json({ message: "error", error: e });
  }
}


async function fetchUserInfo(req, res, next) {
  try {
    let userInfo = await User.findOne({
      email: res.locals.decodedJwt.email,
    }).select("-password -__v");
    res.json({ message: "success", payload: userInfo });
  } catch (e) {
    next(e);
  }
}

async function updateUser(req, res, next) {
  console.log(req.body);
  if (req.body.password) {
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }
  try {
    let updatedUser = await User.findOneAndUpdate(
      { email: res.locals.decodedJwt.email },
      req.body,
      { new: true }
    );
    if (req.body.password) {
      res.status(202).json({ message: "success", payload: updatedUser });
    } else {
      res.json({ message: "success", payload: updatedUser });
    }
  } catch (e) {
    next(e);
  }
}

module.exports = { signup, login, fetchUserInfo, updateUser };
