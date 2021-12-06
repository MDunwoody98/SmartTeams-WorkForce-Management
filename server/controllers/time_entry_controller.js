'use strict';

const TimeEntry = require('../models/time_entry_schema');

const createTimeEntry = (req, res) => {
    TimeEntry.create(req.body)
    .then((data) => {
      console.log('New Time Entry Created!', data);
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

const readTimeEntry = (req, res) => {
    TimeEntry.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readTimeEntryById = (req, res) => {
    TimeEntry.findOne({id: req.params.id})
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  };

const updateTimeEntry = (req, res) => {
    TimeEntry.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Time Entry updated!');
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

const deleteTimeEntry = (req, res) => {
    TimeEntry.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Time Entry not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Time Entry removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createTimeEntry,
  readTimeEntry,
  readTimeEntryById,
  updateTimeEntry,
  deleteTimeEntry,
};
