const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// REGISTER — always returns 201 with token on success
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: role === "instructor" ? "instructor" : "student",
      bio: "",
    });

    const token = generateToken(user);

    // FIXED: return 201 with full user object — no error should fire after this
    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }
    return res
      .status(500)
      .json({ message: "Registration failed. Please try again." });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(401)
        .json({ message: "No account found with this email" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};

// GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIXED: updateProfile — was failing because req.user.id was undefined on some token formats
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // set by authMiddleware
    const { name, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim(), bio: (bio || "").trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    console.error("updateProfile error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update profile. Please try again." });
  }
};