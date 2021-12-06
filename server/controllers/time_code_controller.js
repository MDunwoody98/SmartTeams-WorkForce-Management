'use strict';

const TimeCode = require('../models/time_code_schema');

const createTimeCode = (req, res) => {
    TimeCode.create(req.body)
    .then((data) => {
      console.log('New Time Code Created!', data);
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

const readTimeCode = (req, res) => {
    TimeCode.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readTimeCodeById = (req, res) => {
    TimeCode.findOne({id: req.params.id})
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  };

const updateTimeCode = (req, res) => {
    TimeCode.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Time Code updated!');
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

const deleteTimeCode = (req, res) => {
    TimeCode.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Time Code not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Time Code removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createTimeCode,
  readTimeCode,
  readTimeCodeById,
  updateTimeCode,
  deleteTimeCode,
};
