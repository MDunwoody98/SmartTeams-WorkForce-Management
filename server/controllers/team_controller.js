'use strict';

const Team = require('../models/team_schema');

const createTeam = (req, res) => {
    Team.create(req.body)
    .then((data) => {
      console.log('New Team Created!', data);
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

const readTeam = (req, res) => {
    Team.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readTeamById = (req, res) => {
    Team.findOne({id: req.params.id})
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  };

const updateTeam = (req, res) => {
    Team.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Team updated!');
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

const deleteTeam = (req, res) => {
    Team.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Team not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Team removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createTeam,
  readTeam,
  readTeamById,
  updateTeam,
  deleteTeam,
};
