const User = require("../models/User")


getProfile = async (req, res) => {
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

getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).populate("followers following", "username")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

followUser = async (req, res) => {
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

unfollowUser = async (req, res) => {
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

updateProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { username, profilePicture } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user fields if provided
    if (username) user.username = username
    if (profilePicture) user.profilePicture = profilePicture

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