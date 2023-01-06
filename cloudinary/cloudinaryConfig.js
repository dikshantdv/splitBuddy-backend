const { config, uploader } = require("cloudinary");
exports.cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: "dosieicoa",
    api_key: "796596561563696",
    api_secret: "-4YjoShl3W-3kAXk5AAwVvrgCwU",
  });
  next();
};
