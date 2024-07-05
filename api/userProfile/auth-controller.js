const jwt = require('jsonwebtoken');
const User = require("../userProfile/user-model");
const REST_API = require("../../utils/crudHelper");

const register = async (req, res) => {
  try {
    const user = await REST_API._add(req, res, User);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserList = async (req, res) => {
  const response = await REST_API._getAll(req, res, User);
  res.status(200).json(response);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const response = await REST_API._getDataListById(req, res, User, "id", id);
  res.status(200).json(response);
};

const updateUser = async (req, res) => {
  const response = await REST_API._update(req, res, User);
  res.status(200).json(response);
};

const deleteUser = async (req, res) => {
  const response = await REST_API._delete(req, res, User);
  res.status(200).json(response);
};

module.exports = {
  register,
  login,
  getUserList,
  getUserById,
  updateUser,
  deleteUser
};