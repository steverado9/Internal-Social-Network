import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const image_url = cloudinary.url('cld-sample-5', {
    transformation: [
        {
            fetch_format: 'auto',
             quality: 'auto'
        },
        {
           width: 1200,
           height: 1200,
           crop: 'fill',
           gravity: 'auto'
        }
    ]
});
console.log(image_url);

export default cloudinary;