'use strict';

const Worker = require('../models/worker_schema');

const createWorker = (req, res) => {
    Worker.create(req.body)
    .then((data) => {
      console.log('New Worker Created!', data);
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

const readWorker = (req, res) => {
    Worker.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const updateWorker = (req, res) => {
    Worker.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Worker updated!');
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

const deleteWorker = (req, res) => {
    Worker.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Worker not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Worker removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createWorker,
  readWorker,
  updateWorker,
  deleteWorker,
};
