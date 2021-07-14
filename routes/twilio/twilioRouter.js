const express = require("express");
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const jwtMiddleware = require("../utils/jwtMiddleware");
const client = require("twilio")(accountSid, authToken);
//jwtMiddleware protects us from others using our app
router.post("/send-sms",jwtMiddleware, function (req, res) {
  console.log(req.body, 'req');
  console.log(`+1${req.body.to}`, 'this is the number');
  client.messages
    .create({
      body: req.body.message,
      from: "+19165849590",
      to: `+1${req.body.to}`,
      // to: "+18043068023"
    })
    .then((message) => res.json(message))
    .catch((error) => {
      console.log(error.message);
      res.status(error.status).json({ message: error.message, error });
    });
});
module.exports = router;