const User = require("../models/user")
const {usersignupSchema,userloginSchema} = require("../../validators/userValidator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const responseCodes = require("../../utils/responseCodes")
const responseMessage = require("../../utils/responseMessage");


exports.UserSignup = async (req, res, next) => {
    let { user_name,email, password } = req.body;
    try{
    const { error } = usersignupSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const exist = await User.exists({ email: req.body.email });
    if (exist) {
      return res.json({ responseCode: responseCodes.ALREADY_EXIST, responseMessage: responseMessage.USER_ALREADY })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      user_name ,
      email,
      password: hashedPassword,
    });
    
      const saveduser = await newuser.save();
      return res.send({ responseCode: responseCodes.SUCCESS, responseMessage: responseMessage.SIGN_UP, responseResult: saveduser })
    } catch (err) {
      res.json({ responseCode: responseCodes.SOMETHING_WRONG, responseMessage: responseMessage.SOMETHING_WRONG, responseResult: [] });
    }
  };

  exports.userlogin = async (req, res, next) => {
    const { error } = userloginSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(422).json({ message:"This email wrong"});
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(422).json({ message:"Wrong credentials"});
      } else {
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        res.status(200).json({responseCode:responseCodes.SUCCESS, message: "User is login sucessfully", token:token });
      }
    } catch (err) {
      res.status(500).json({message: "worng credentils"});
      console.log(err);
    }
  };

exports.getAllUser = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const skip = (page - 1) * 10;
      const getAllUser = await User
        .find()
        .select("-password")
        .skip(skip)
        .limit(limit);
      res.status(200).json({ message: "Find all User list",  response:getAllUser });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  }; 


  exports.getUserProfile = async (req, res) => {
    try {
      const getUser = await User.findById(req.user.id)
      res.status(200).json({
        success: true,
        message: "Find User sucessfully",
        response:getUser
      });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  }; 