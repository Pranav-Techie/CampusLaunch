const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.mimetype !== "application/pdf") {
    return callback(
      new Error("Only PDF resumes are allowed.")
    );
  }

  callback(null, true);
};

const uploadResume = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = uploadResume;