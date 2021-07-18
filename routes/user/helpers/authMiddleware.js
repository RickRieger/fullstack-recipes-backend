const {
  checkIsEmail,
  checkIsAlpha,
  checkIsAlphanumeric,
} = require("../../utils/authMethods");

function checkIsEmailFunc(req, res, next) {
  const { errorObj } = res.locals;

  if (!checkIsEmail(req.body.email)) {
    errorObj.wrongEmailFormat = "Must be in email format!";
  }
  console.log('made it this far1');
  next();
}

function checkIsAlphaFunc(req, res, next) {
  const { errorObj } = res.locals;
  const inComingData = req.body;
  for (key in inComingData) {
    if (key === "firstName" || key === "lastName") {
      if (!checkIsAlpha(inComingData[key])) {
        errorObj[`${key}`] = `${key} can only have characters`;
      }
    }
  }
  console.log('made it this far2');
  next();
}

function checkIsAlphanumericFunc(req, res, next) {
  console.log('made it this far3');
  const { errorObj } = res.locals;
  if (!checkIsAlphanumeric(req.body.userName)) {
    errorObj.usernameError = "username can only have characters and numbers";
  }
  console.log('made it this far4');
  next();
}

module.exports = {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
};
