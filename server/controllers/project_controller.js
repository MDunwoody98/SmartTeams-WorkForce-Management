'use strict';

const Project = require('../models/project_schema');

const createProject = (req, res) => {
    Project.create(req.body)
    .then((data) => {
      console.log('New Project Created!', data);
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

const readProject = (req, res) => {
    Project.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readProjectById = (req, res) => {
    Project.findOne({id: req.params.id})
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  };

const updateProject = (req, res) => {
    Project.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Project updated!');
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

const deleteProject = (req, res) => {
    Project.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Project not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Project removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createProject,
  readProject,
  readProjectById,
  updateProject,
  deleteProject,
};
