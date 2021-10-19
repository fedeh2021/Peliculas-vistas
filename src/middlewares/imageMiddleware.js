const path = require('path');
const multer = require('multer');

const multerDS = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../../public/img'));
    },
    
    filename: function(req, file, cb){
        let nameImage = Date.now() + path.extname(file.originalname);
        cb(null, nameImage);
    }
});

const uploadFile = multer({ storage: multerDS });

module.exports = uploadFile;
