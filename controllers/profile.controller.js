const User = require("../models/User")

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId).populate("followers following", "username")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params // Matches route parameter
    const user = await User.findById(id).populate("followers following", "username profilePicture")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const followUser = async (req, res) => {
  try {
    const userId = req.user._id
    const { targetUserId } = req.body

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ error: "You cannot follow yourself" })
    }

    const user = await User.findById(userId)
    const targetUser = await User.findById(targetUserId)

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ error: "You are already following this user" })
    }

    user.following.push(targetUserId)
    targetUser.followers.push(userId)

    await user.save()
    await targetUser.save()

    res.json({ message: "Successfully followed the user" })
  } catch (error) {
    console.error("Error following user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id
    const { targetUserId } = req.body

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ error: "You cannot unfollow yourself" })
    }

    const user = await User.findById(userId)
    const targetUser = await User.findById(targetUserId)

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.following.includes(targetUserId)) {
      return res.status(400).json({ error: "You are not following this user" })
    }

    user.following.pull(targetUserId)
    targetUser.followers.pull(userId)

    await user.save()
    await targetUser.save()

    res.json({ message: "Successfully unfollowed the user" })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { username, bio } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (username) user.username = username
    if (bio) user.bio = bio

    // If an image file was uploaded via Multer/Cloudinary, save its secure URL
    if (req.file) {
      user.profilePicture = req.file.path
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture
    }

    await user.save()
    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
    getProfile,
    getUserProfile,
    followUser,
    unfollowUser,
    updateProfile
}