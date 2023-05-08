const Car = require ("../models/carModel")
const User = require ("../../auth/models/user")
const {addCarSchema} = require("../../validators/carValidator")
// const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const uploadImageInCloudinairy = require("../../utils/common");



// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ID,
//   secretAccessKey: process.env.AWS_SECRET,
//   Bucket: process.env.BUCKET_NAME,
//   region: process.env.region,
// });

exports.userAddCar = async (req, res) => {
    try {
      const {car_name,car_image,car_price,car_description} = req.body
      // const { error } = addCarSchema.validate(req.body);
      if (!car_image) {
      res.status(400).send(error.details[0].message);
      return;
      } else {
        const exist = await Car.exists({ car_name: car_name });
        if (exist) {
          return res.status(409).send("This car is already add!");
        } else {
          const image = await uploadImageInCloudinairy(car_image)
          console.log(image);
          const aadcar = new Car ({
            car_name:car_name,
            car_image: image,
            car_price:car_price,
            car_description:car_description,
            createdby:req.user.id
          })
          const savedata = await aadcar.save()
          if (savedata) {
            return res.status(201).json({
              status: 1,
              message: "User add car sucessfully",
              response:savedata,
            });
          } else {
            return res.status(400).json({
              status: 0,
              message: "Something went wrong!",
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
      
    }
  };

  

exports.updateCardetail = async (req, res) => {
    try {
      const data = req.body;
      const validateKey = ["car_description","car_price"];
      for (let key of validateKey) {
        if (!data[key] || data[key] == undefined) {
          return res.status(400).json({
            status: 0,
            message: key + " filed required.",
          });
        }
      }
      const updatedcar = await Car.findByIdAndUpdate(
        req.query.id,
        { $set: req.body},
        { new: true }
      );
      return res.status(200).json({
        status: 1,
        message: "update successfully.",
        response:updatedcar,
      });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  };

exports.getAllCarlist = async (req, res) => {
    try {
      const page=req.query.page || 1;
      const limit=req.query.limit || 10;
      const skip = (page - 1) * 10;
      const getAllCar = await Car
        .find()
        .skip(skip)
        .limit(limit);
      res.status(200).json({ message: "Find all car list",  response:getAllCar });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  };

exports.getCarById = async (req, res) => {
    try {
      const getOneCar = await Car.findById(req.query.id)
      if(!getOneCar){
        return res.status(404).json({
            message:"No car this id"
        })
      }else{
        res.status(200).json({
          success: true,
            message: "Find Car sucessfully",
            response:getOneCar
          });
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  }; 


exports.getAllUserCreatedCars = async (req,res)=>{
    try{
      const user=await User.findById({_id:req.user.id})
      if(!user){
        return res.status(404).json({
          message:"No user found with id"
        })
      }
    const getCarByuserId = await Car.find({createdby:user._id}).populate("createdby")
    if(getCarByuserId){
        return res.status(200).json({
          success: true,
            message:"Get car sucessfully ",
            response:getCarByuserId
        })
    }else{
        res.status(400).json({
            message: "This user not add any car",
          });
    }
    }catch(error){
        return res.status(500).json({
            status: 0,
            message: error.toString(),
          });
    }
}

// exports.updateCarPicture = async (req, res) => {
//   try {
//     let myFile = req.file.originalname.split(".");
//     const fileType = myFile[myFile.length - 1];
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `${uuidv4()}.${fileType}`,
//       Body: req.file.buffer,
//     };
//     s3.upload(params, async (error, dataResult) => {
//       if (error) {
//         return res.status(500).send(error);
//       }
//       let p = req.body.profileUrl;
//       if (p) {
//         p = p.split("/");
//         p = p[p.length - 1];
//         const params1 = {
//           Bucket: process.env.AWS_BUCKET_NAME,
//           Key: p,
//         };
//         const s3delete = function (params) {
//           return new Promise((resolve, reject) => {
//             s3.createBucket(
//               {
//                 Bucket: params.Bucket,
//               },
//               function () {
//                 s3.deleteObject(params, async function (err, data) {
//                   if (err) return res.status(500).send({ message: err });
//                   const result = await Car.findByIdAndUpdate(req.params.id, {
//                     car_image: dataResult.Location,
//                   });
//                   if (result) {
//                     return res
//                       .status(200)
//                       .send({ message: "Image updated successfully" });
//                   }
//                   return res
//                     .status(500)
//                     .send({ message: "Something bad happened" });
//                 });
//               }
//             );
//           });
//         };
//         s3delete(params1);
//       } else {
//         const result = await Car.findByIdAndUpdate(req.params.id, {
//           car_image: dataResult.Location,
//         });
//         if (result) {
//           return res.status(200).send("car_image updated sucessfully");
//         }
//         return res.status(500).send({ message: "Something went wrong" });
//       }
//     });
//   } catch (e) {
//     return res.status(500).send({ message: e.name });
//   }
// };