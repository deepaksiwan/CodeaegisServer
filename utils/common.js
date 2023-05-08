const cloudinary =require('cloudinary').v2;

cloudinary.config({
    cloud_name:"pinsout-innovation-private-limited",
    api_key:"588643576117338",
    api_secret: "E-vmEnzFEuHXF7ewR3CE-_n1OUM"
})

const uploadImageInCloudinairy=async (img) => {
    let imageRes = await cloudinary.uploader.upload(img,{
      folder:"car_images"
    });
    if (imageRes) {
        return imageRes.secure_url;
    }
    else {
        console.log("Image upload error")
    }
}


module.exports=uploadImageInCloudinairy