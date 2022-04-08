'use strict';

const Project = require('../models/project_schema');
const WorkerController = require('../controllers/worker_controller');

const createProject = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can create projects')
  }
  console.log(req.body)
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
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can retrieve all projects')
  }
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
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can update projects')
  }
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
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can delete projects')
  }
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
