const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl: profileImageUrl || null,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ message: "Please enter email and password" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         _id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         profileImageUrl: user.profileImageUrl,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };
const loginUser = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    console.log("HASHED PASSWORD:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    console.log("TOKEN GENERATED");

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token,
    });

  } catch (error) {
    console.error("LOGIN ERROR FULL:", error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

// @desc    Get current user info
// @route   GET /api/v1/auth/getUser
// @access  Private
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc    Upload profile image
// @route   POST /api/v1/auth/upload-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Update user profile image
    await User.findByIdAndUpdate(req.user._id, {
      profileImageUrl: imageUrl,
    });

    res.json({ imageUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  uploadProfileImage,
};