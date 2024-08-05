const User = require("../model/Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log("Received data:", req.body);

  // Validate the input
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }
  const hashedpass = await bcrypt.hash(password, 10);
  // Create a new user
  try {
    const newUser = new User({ username, email, password: hashedpass });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", password: hashedpass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2h" }, // Token expires in 2 hours
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error generating token" });
        }
        res.status(200).json({
          message: "Login Successful",
          token: token,
          userId: user._id,
          username: user.username,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const dashboard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log("No user or user ID in request");
      return res.status(400).json({ message: "Bad Request: No user ID" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User Not Found" });
    }

    console.log("User found:", user);
    res.status(200).json({
      message: "Welcome to the dashboard",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Error in dashboard controller:", err);
    res.status(500).json({ message: "Server Error in dashboard" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, newpassword, oldpassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (oldpassword && newpassword) {
      const isMatch = await bcrypt.compare(oldpassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is not correct" });
      }
      user.password = await bcrypt.hash(newpassword, 12);
      user.confirmpassword = user.password;
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, dashboard, updateUser };
