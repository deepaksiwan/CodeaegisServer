const express = require("express");
const router = express.Router();
const {userAddCar,updateCardetail,getAllCarlist,getCarById,getAllUserCreatedCars} = require("../../car/controllers/carController")
const {verifyTokenAndUser,verifyToken} = require("../../middlewares/auth")
router.post("/userAddCar",verifyTokenAndUser,userAddCar)
router.put("/updateCardetail",verifyTokenAndUser,updateCardetail)
router.get("/getAllCarlist",getAllCarlist)
router.get("/getCarById",getCarById)
router.get("/getAllUserCreatedCars",verifyTokenAndUser,getAllUserCreatedCars)
module.exports = router;
