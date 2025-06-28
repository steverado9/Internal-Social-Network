import cloudinary from "./cloudinary";

const imageUrl = cloudinary.url('cld-sample-5', {
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
console.log(imageUrl);

export default imageUrl;