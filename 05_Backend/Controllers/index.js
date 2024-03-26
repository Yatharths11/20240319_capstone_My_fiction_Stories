const { login, logout } = require("./authControllers");
const {
  register,
  profile,
  updateProfile,
  deleteUser
} = require("./usersControllers");
const { all, story, create, add } = require("./storyContollers");
module.exports = {
  register,
  login,
  profile,
  updateProfile,
  deleteUser,
  all,
  story,
  create,
  add,
  logout
};
