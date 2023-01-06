const multer = require("multer");
const DatauriParser = require("datauri/parser");
const path = require("path");
const storage = multer.memoryStorage();

const dUri = new DatauriParser();
exports.multerUploads = multer({ storage }).single("image");

exports.dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
