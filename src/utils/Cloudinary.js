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

        const response = await cloudinary.v2.uploader.upload(file_path);

        fs.unlink(file_path);
        return response;

    } catch (error) {
        fs.unlink(file_path);
        console.log("Error uploading file on cloudinary");
        return null;
    }
}
