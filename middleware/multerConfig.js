import multer from "multer";
require("dotenv").config({ path: ".env" });

const FILE_PATH = process.env.FILE_PATH || "uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${FILE_PATH}/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default { upload };
