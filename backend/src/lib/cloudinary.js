import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "course-data",
    });
    console.log("uploadResponse uploadResponse", uploadResponse);
    return uploadResponse;
  } catch (error) {
    console.log("error from uploadMedia", error);
  }
};

export const deleteMediaFromCloduinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("error from deleteMediaFromCloduinary : ", error);
  }
};

export const deleteVideoFromCloduinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log("error from deleteVideoFromCloduinary", error);
  }
};
