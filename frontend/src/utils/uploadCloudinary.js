const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
const cloudname = import.meta.env.VITE_CLOUD_NAME


const uploadImageToCloudinary = async file =>{
    const uploadData = new FormData();

    uploadData.append('file',file)
    uploadData.append('upload_preset',upload_preset)
    uploadData.append('cloudname',cloudname);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
        {
            method:"post",
            body:uploadData,
        }
    )
    const data = await res.json();

    return data;
}

export default uploadImageToCloudinary;