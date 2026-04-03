// src/controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    let filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const users = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.status(201).json(user);
};

export const updateUserRole = async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "Cannot change your own role" });
  }

  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
};

export const toggleUserStatus = async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "Cannot deactivate yourself" });
  }

  const user = await User.findById(req.params.id);

  user.isActive = !user.isActive;
  await user.save();

  res.json({ isActive: user.isActive });
};

export const deleteUser = async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};