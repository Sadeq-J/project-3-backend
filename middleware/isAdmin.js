const User = require('../models/User')

const isAdmin = async (req, res, next) => {

  try{
    const userId = req.user._id || req.user.id
    const user = await User.findById(userId)

    if(user && user.isAdmin){
      return next()
    }

    return res.status(403).json({error: "Access denied. Admin privileges required."})
  }
  catch(error){
    return res.status(500).json({ error: "Internal server error verifying admin status" })
  }
  
};

module.exports = isAdmin
