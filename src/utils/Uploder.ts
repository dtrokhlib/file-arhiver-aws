import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './tmp/');
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
