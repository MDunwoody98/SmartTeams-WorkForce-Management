'use strict';

const User = require('../models/user_schema');
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
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

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('User updated!');
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const deleteUser = (req, res) => {
  User.find({workerId: String(req.params.id)})
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