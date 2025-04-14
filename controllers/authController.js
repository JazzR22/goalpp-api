const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const ErrorFactory = require('../utils/ErrorFactory');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ErrorFactory.userAlreadyExists(email);
    }

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id });

    res.status(201).json({ token });
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
};
