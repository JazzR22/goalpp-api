const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const ErrorFactory = require('../utils/ErrorFactory');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'Strict',                            
  maxAge: 1000 * 60 * 60 * 2                     
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ErrorFactory.userAlreadyExists(email);
    }

    const user = await User.create({ email, password });
    const token = signToken({ id: user._id });

    res
      .status(201)
      .cookie('token', token, COOKIE_OPTIONS)
      .json({ message: 'User registered' }); 
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const clientType = req.header('X-Client-Type');

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw ErrorFactory.userNotFound(email);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ErrorFactory.incorrectPassword();

    const token = signToken({ id: user._id });

    if (clientType === 'mobile') {
      return res.status(200).json({ token, message: 'Login successful' });
    } else {
      return res
        .status(200)
        .cookie('token', token, COOKIE_OPTIONS)
        .json({ message: 'Login successful' });
    }
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS)
  res.status(200).json({ message: 'Logged out' })
}

module.exports = {
  register,
  login,
  logout
};
