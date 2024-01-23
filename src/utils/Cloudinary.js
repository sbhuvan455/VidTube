import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: "dszd78iy9", 
  api_key: "117799385546888", 
  api_secret: "oyvB0Nv0rsMIJ9pTF5M3H--o47g"
});

export const uploadOnCloudinary = async (file_path) => {
    try {
        if(!file_path) return null;

        const response = await cloudinary.uploader.upload(file_path, {resource_type: "auto"});

        fs.unlinkSync(file_path);
        return response;

    } catch (error) {
        fs.unlinkSync(file_path);
        console.log("Error uploading file on cloudinary");
        console.log(error);
        return null;
    }
}

export const deleteFromCloudinary = async (file_path) => {
    try {

        const imageNameArray = file_path.split('/');
        const imageName = imageNameArray[imageNameArray.length - 1].split('.')[0];

        const rescourcetype = (imageNameArray[imageNameArray.length - 1].split('.')[1] == 'png') ? 'image' : 'video';

        const response = await cloudinary.uploader.destroy(imageName, {resource_type: rescourcetype})
        console.log(response);

    } catch (error) {
        console.log("Error deleting file from cloudinary", error)
    }
}
