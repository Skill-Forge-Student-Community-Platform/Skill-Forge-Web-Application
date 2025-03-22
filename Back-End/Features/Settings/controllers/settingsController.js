const User = require('../models/User');

// Update user name and username
exports.updateName = async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    
    // Check if username is already taken
    if (username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, username },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user email
exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email is already taken
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's last login information
exports.getLastLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('lastLogin');
    res.json(user.lastLogin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's social links
exports.updateSocialLinks = async (req, res) => {
  try {
    const { socialLinks } = req.body;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { socialLinks },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's notification settings
exports.updateNotifications = async (req, res) => {
  try {
    const { notificationSettings } = req.body;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationSettings },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    // Delete user
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 