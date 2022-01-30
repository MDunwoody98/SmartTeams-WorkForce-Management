'use strict';

const Worker = require('../models/worker_schema');
const Team = require('../models/team_schema');

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

const checkUserManagesTargetWorker = async (currentUser, targetWorker) => {
  //find all teams for which currentUser is a manager
  //get worker IDs of all members of those teams
  const managedTeams = await Team.find({managerId: currentUser})
  if (managedTeams.length == 0) return false
  const membersInManagedTeams = managedTeams.map(team => team.memberId[0])
  return membersInManagedTeams.includes(targetWorker)
}

function parseJWT (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

module.exports = {
  parseJWT,
  checkUserManagesTargetWorker,
  createWorker,
  readWorker,
  updateWorker,
  deleteWorker,
};
