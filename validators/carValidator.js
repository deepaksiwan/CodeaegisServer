const Joi = require("joi");
const addCarSchema = Joi.object()
  .keys({
    car_name: Joi.string().required(),
    car_image: Joi.string().required,
    car_price:Joi.number().required(),
    car_description: Joi.string().required()
  })
  .required();
 
module.exports = {
    addCarSchema 
  
};