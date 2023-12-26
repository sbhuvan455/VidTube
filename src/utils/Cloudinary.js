import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

export const uploadOnCloudinary = async (file_path) => {
    try {
        if(!file_path) return null;

        const response = await cloudinary.uploader.upload(file_path);

        fs.unlinkSync(file_path);
        return response;

    } catch (error) {
        fs.unlinkSync(file_path);
        console.log("Error uploading file on cloudinary");
        console.log(error);
        return null;
    }
}
