const mongoose = require("mongoose");
const CarSchema = new mongoose.Schema(
  {
    car_name: {
      type: String,
    },
    car_image: {
      type: String,
      require:true
    },
    car_price : {
      type: Number,
      default:"0"
    },
    car_description: {
      type: String,
      required:true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarSchema);