const express = require("express");
const router = express.Router();
const {UserSignup,userlogin,getAllUser,getUserProfile} = require("../controllers/authController")
const {verifyTokenAndUser,verifyToken} = require("../../middlewares/auth")
router.post("/UserSignup", UserSignup);
router.post("/userlogin",userlogin)
router.get("/getAllUser",verifyTokenAndUser,getAllUser)
router.get("/getUserProfile",verifyTokenAndUser,getUserProfile);

module.exports = router;
