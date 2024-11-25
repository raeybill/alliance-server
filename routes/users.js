var express = require("express");
const UsersDatabase = require("../models/User");
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await UsersDatabase.find();
    res.status(200).json({ code: "Ok", data: users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UsersDatabase.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ code: "Ok", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
});

router.delete("/:email/delete", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UsersDatabase.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
});

router.put("/:_id/profile/update", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UsersDatabase.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.updateOne(req.body);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
});

router.put("/:_id/accounts/update", async (req, res) => {
  const { _id } = req.params;
  const { values } = req.body;
  try {
    const user = await UsersDatabase.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedAccounts = { ...user.accounts, ...values };
    await user.updateOne({ accounts: updatedAccounts });
    res.status(200).json({ message: "Accounts updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update accounts", error });
  }
});

router.get("/:_id/accounts", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UsersDatabase.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user.accounts, message: "Accounts fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch accounts", error });
  }
});

module.exports = router;
