const fs = require('fs');
const path = require('path');
// upload single image 
exports.uploadSingleImage = async (file, folder) => {
    if (!file || !folder) throw new Error('File And Folder Name Is Required');
    const imageUrl = `/public/${folder}/${file.filename}`;
    return imageUrl;
}

exports.uploadImages = async (files, folder, maxImages) => {
    if (!files || !folder || files.length === 0) throw new Error('Files And Folder Name Is Required');
    if (files.length > maxImages) throw new Error(`You Have A Maximum Files Limit Up To ${maxImages}`);
    const imagesUrls = files.map((file) => `/public/${folder}/${file.filename}`);
    return imagesUrls;
}

exports.updateSingleImage = async (file, folder, oldImageUrl) => {
    if (!file || !folder || !oldImageUrl) throw new Error('File ,Folder Name And oldUrl Is Required');
    // The path.basename() method returns the last portion of a path
    const oldImageName = path.basename(oldImageUrl);
    const oldImagePath = path.join(__dirname, `../public/${folder}/${oldImageName}`);
    try {
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    } catch (error) {
        throw new Error('Image deletion failed');
    }
    const newImageUrl = `/public/${folder}/${file.filename}`;
    return newImageUrl;
}

// Update All Product Gallery Images (Replace All Existing Images)
exports.updateImages = async (files, folder, maxImages, oldImagesUrls) => {
    if (!files || !folder || !oldImagesUrls || maxImages === 0) {
        throw new Error('Files ,Folder Name And oldUrls Is Required');
    }
    if (files.length > maxImages) {
        throw new Error(`You Have A Maximum Files Limit Up To ${maxImages}`);
    }
    oldImagesUrls.forEach((url) => {
        const oldImageName = path.basename(url);
        const oldImagesPath = path.join(__dirname, `../public/${folder}/${oldImageName}`);
        if (fs.existsSync(oldImagesPath)) {
            try {
                fs.unlinkSync(oldImagesPath);
            }
            catch (error) {
                throw new Error(`Failed to delete image: ${oldImageName}`);
            }
        }
    });
    const newImageurls = files.map((file) => {
        return `../public/${folder}/${file.filename}`;
    });
    console.log(`from imageHelper => ${newImageurls}`);
    return newImageurls;
}
//  Delete a Specific Image
exports.deleteSingleImage = async (folder, imageUrl) => {
    if (!folder || !imageUrl) throw new Error('File ,Folder Name And oldUrl Is Required');
    try {
        const imageName = path.basename(imageUrl);
        const imagePath = path.join(__dirname, `../public/${folder}/${imageName}`);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        } else {
            console.warn(`Image not found in file system: ${imagePath}`);
        }
    } catch (error) {
        throw new Error('Image is not in file system ');
    }
    return true
}

exports.deleteImages = async (folder, imagesUrls) => {
    imagesUrls.forEach((url) => {
        const imageName = path.basename(url);
        const imagePath = path.join(__dirname, `../public/${folder}/${imageName}`)
        try {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted: ${imagePath}`);
            } else {
                console.warn(`Image not found in file system: ${imagePath}`);
            }
        } catch (error) {
            throw new Error(`Failed to delete image: ${imageName}`);
        }
    })
    return true
}




