'use strict';

const User = require('../models/user_schema');
const WorkerController = require('./worker_controller');
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can create users')
  }
  const { password, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      password: hashedPassword,
      isAdmin: isAdmin,
    });
    const result = await user.save();
    res.status(200).json({
      message: "User created",
      user: { objectId: result._id, workerId: result.workerId },
    });
  } catch (err) {
    if (!err.statusCode) {
      console.error(err);
      res.status(500).json(err);
    }
  }
};

const readUser = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can retrieve all users')
  }
  User.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readUserById = (req, res) => {
  User.findOne({_id: req.params.id})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const updateUser = async (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can retrieve all users')
  }
  try {
    const linkedUser = await User.findOne({workerId: String(req.params.id)})
    if (req.body.password) {
      const encryptedPassword = await bcrypt.hash(req.body.password, 12)
      linkedUser.password = encryptedPassword
    }
    linkedUser.isAdmin = req.body.isAdmin
    await linkedUser.save()
    return res.status(200).json(`User ${linkedUser} updated`)
  } catch (ex) {
    return res.status(500).json(ex)
  }
};

const deleteUser = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can retrieve all users')
  }
  User.findOne({workerId: String(req.params.id)})
    .then((data) => {
      if (!data) {
        throw new Error('User not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('User removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createUser,
  readUser,
  readUserById,
  updateUser,
  deleteUser,
};