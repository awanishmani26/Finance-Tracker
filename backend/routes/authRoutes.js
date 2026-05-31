// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/uploadMiddleware");
// const { protect } = require("../middleware/authMiddleware");
// const User = require("../models/User");
// const {
//   registerUser,
//   loginUser,
//   getUserInfo,
//   uploadProfileImage,
// } = require("../controllers/authController");

// const upload = require("../middleware/uploadMiddleware");

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/getUser", protect, getUserInfo);
// router.post(
//   "/upload-profile",
//   protect,
//   upload.single("profilePic"),

//   async (req, res) => {
//     try {

//       const user = await User.findById(req.user._id);

//       user.profilePic = req.file.filename;

//       await user.save();

//       res.json({
//         message: "Profile uploaded successfully",
//         profilePic: req.file.filename,
//       });

//     } catch (error) {

//       res.status(500).json({
//         message: "Upload failed",
//       });

//     }
//   }
// );

// module.exports = router;
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const User = require("../models/User");

const {
  registerUser,
  loginUser,
  getUserInfo,
  uploadProfileImage,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);


const handleProfileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Cloudinary gives us the URL directly in req.file.path
    const imageUrl = req.file.path;
    user.profileImageUrl = imageUrl;
    await user.save();
    res.json({
      message: "Profile uploaded successfully",
      imageUrl,
      profileImageUrl: imageUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

router.post("/upload-profile", protect, upload.single("image"), handleProfileUpload);
router.post("/upload-image",   protect, upload.single("image"), handleProfileUpload);

module.exports = router;