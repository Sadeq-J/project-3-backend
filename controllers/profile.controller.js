const User = require("../models/User")
const Notification = require("../models/Notifications")
const { imagekit } = require("../middleware/upload")

const getAllProfiles = async (req, res) => {
  try {
    const { q } = req.query

    const query = q
      ? {
          username: { $regex: q, $options: "i" }
        }
      : {}

    const users = await User.find(query).select("username profilePicture bio isAdmin")
    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching all profiles:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId).populate("followers following", "username")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.status(200).json(user)
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
    res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId).populate("followers", "username profilePicture")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.status(200).json(user.followers)
  } catch (error) {
    console.error("Error fetching followers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId).populate("following", "username profilePicture")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.status(200).json(user.following)
  } catch (error) {
    console.error("Error fetching following:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


const followUser = async (req, res) => {
  try {
    const userId = req.user._id
    const { id } = req.params

    if (userId.toString() === id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" })
    }

    const user = await User.findById(userId)
    const targetUser = await User.findById(id)

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" })
    }

    const alreadyFollowing = user.following.some((personId) => personId.toString() === id.toString())
    if (alreadyFollowing) {
      return res.status(400).json({ error: "You are already following this user" })
    }

    user.following.push(targetUser._id)
    targetUser.followers.push(user._id)

    await user.save()
    await targetUser.save()

    await Notification.create({
      recipient: targetUser._id,
      sender: user._id,
      type: "follow"
    })

    res.status(200).json({ message: "Successfully followed the user" })
  } catch (error) {
    console.error("Error following user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id
    const { id } = req.params

    if (userId.toString() === id.toString()) {
      return res.status(400).json({ error: "You cannot unfollow yourself" })
    }

    const user = await User.findById(userId)
    const targetUser = await User.findById(id)

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" })
    }

    const isFollowing = user.following.some((personId) => personId.toString() === id.toString())
    if (!isFollowing) {
      return res.status(400).json({ error: "You are not following this user" })
    }

    user.following = user.following.filter((personId) => personId.toString() !== id.toString())
    targetUser.followers = targetUser.followers.filter((personId) => personId.toString() !== userId.toString())

    await user.save()
    await targetUser.save()

    res.status(200).json({ message: "Successfully unfollowed the user" })
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
    if (bio !== undefined) user.bio = bio || ""

    if (req.file) {
      try {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `profile_${userId}_${Date.now()}_${req.file.originalname}`,
          folder: "/profile-pictures",
        })

        user.profilePicture = uploadResponse.url
      } catch (uploadError) {
        console.warn("Profile image upload failed:", uploadError.message)
      }
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture
    }

    await user.save()
    res.status(200).json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

async function getfriends(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("following", "username profilePicture bio");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const searchFriends = async (req, res) => {
  try {
    const userId = req.user._id
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ error: "Search query is required" })
    }

    const currentUser = await User.findById(userId)
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" })
    }

    const matchingFriends = await User.find({
      _id: { $in: currentUser.following },
      username: { $regex: query, $options: "i" }
    }).select("username profilePicture bio");

    res.json(matchingFriends);
  } catch (error) {
    console.error("Error searching friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchFollowers = async (req, res) => {
  try {
    const userId = req.user._id
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ error: "Search query is required" })
    }

    const currentUser = await User.findById(userId)
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" })
    }

    const matchingFollowers = await User.find({
      _id: { $in: currentUser.followers },
      username: { $regex: query, $options: "i" }
    }).select("username profilePicture bio");

    res.json(matchingFollowers);
  } catch (error) {
    console.error("Error searching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllProfiles,
  getProfile,
  getUserProfile,
  followUser,
  unfollowUser,
  updateProfile,
  getfriends,
  searchFriends,
  searchFollowers,
  getMyFollowers,
  getMyFollowing
}
