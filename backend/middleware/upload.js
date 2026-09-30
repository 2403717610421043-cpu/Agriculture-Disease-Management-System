const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});

const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,dir),
  filename: (req,file,cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_');
    cb(null,safe);
  }
});

const upload = multer({
  storage,
  limits:{fileSize: 5 * 1024 * 1024},
  fileFilter:(req,file,cb)=>{
    const allowed = ['image/jpeg','image/png','image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

module.exports = upload;
