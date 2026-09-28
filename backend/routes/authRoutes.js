const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
  getMyResume,
  deleteMyResume,
  getStudentResume,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

/*
|--------------------------------------------------------------------------
| Current user
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  protect,
  getMe
);

/*
|--------------------------------------------------------------------------
| Student profile
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This endpoint accepts multipart/form-data
| because the student can upload a PDF.
|
*/

router.put(
  "/profile",
  protect,
  uploadResume.single("resume"),
  updateProfile
);

/*
|--------------------------------------------------------------------------
| Student resume
|--------------------------------------------------------------------------
*/

router.get(
  "/profile/resume",
  protect,
  getMyResume
);

router.delete(
  "/profile/resume",
  protect,
  deleteMyResume
);

/*
|--------------------------------------------------------------------------
| Admin resume access
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/students/:studentId/resume",
  protect,
  adminOnly,
  getStudentResume
);

module.exports = router;