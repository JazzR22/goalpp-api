const User = require('../models/User');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
const { signToken, verifyToken } = require('../utils/jwt');
const ErrorFactory = require('../utils/ErrorFactory');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ErrorFactory.userAlreadyExists(email);
    }
    
    const user = await User.create({ 
      email, 
      password, 
      isVerified: false 
    });

    const verificationToken = signToken({ id: user._id });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'We have sent you an email to verify your account.' });
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const { token } = req.query;

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw ErrorFactory.userNotFound('User not found');
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'This account has already been verified.' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Account verified. You can now log in.' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ErrorFactory.userNotFound(email);
    }

    if (!user.isVerified) throw ErrorFactory.emailNotVerified();

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ErrorFactory.incorrectPassword();
    }

    const token = signToken({ id: user._id });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  verify
};
