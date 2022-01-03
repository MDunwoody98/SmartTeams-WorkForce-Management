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

const retrieveTimeEntriesForDay = (req, res) => {
  //Router has already validated JWT at this point
  //We must validate that the worker sending this HTTP request is the same worker in the request body
  const token = req.get("Authorization").split(' ')[1]
  console.log(token)
  const payload = parseJWT(token)
  console.log(payload)
  if (req.body.workerId != payload.user) {
    res.status(401).json(`You are requesting time entries for worker ${req.body.workerId} but are logged in as worker ${payload.user}`)
  } else {
    TimeEntry.find({date: req.body.date, workerId: req.body.workerId})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
  }
}

function parseJWT (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
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
  retrieveTimeEntriesForDay,
  updateTimeEntry,
  deleteTimeEntry,
};
