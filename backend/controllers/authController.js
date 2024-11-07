import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { username, password, instrument, role } = req.body;

  // Password validation regex: At least 6 characters, one uppercase, one lowercase, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  try {
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists)
        return res.status(400).json({ message: "An admin already exists" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      instrument: role === "admin" ? null : instrument,
      role,
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res
      .status(201)
      .json({
        message: "User registered successfully",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          instrument: user.instrument,
        },
      });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        instrument: user.instrument,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginWithToken = async (
  req,
  res,
  _next,
  validateAdmin = false
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (validateAdmin) {
      if (user.role !== "admin")
        return res.status(403).json({ message: "Access denied, not an admin" });
    }
    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        instrument: user.instrument,
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
