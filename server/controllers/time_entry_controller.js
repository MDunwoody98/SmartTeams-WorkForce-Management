'use strict';

const TimeEntry = require('../models/time_entry_schema');
const TimeCode = require('../models/time_code_schema');
const WorkerController = require('./worker_controller');

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

const retrieveTimeEntriesForDay = async (req, res) => {
  //Router has already validated JWT at this point
  //We must validate that the worker sending this HTTP request is the same worker in the request body
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.body.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = WorkerController.checkUserManagesTargetWorker(currentUser, requestedWorker)

  if (req.body.workerId != payload.user && !currentUserIsAdmin && !currentUserManagesRequestedWorker) {
    res.status(401).json(`You are requesting time entries for worker ${requestedWorker} but are logged in as worker ${currentUser}`)
    return
  } 
  await TimeEntry.find({date: req.body.date, workerId: requestedWorker})
  .then( async (data) => {
    const timeCodes = data.map(timeEntry => timeEntry.timeCodeId)
    const timeCodeIdNameMap = {}
    //Also want the time code name for each entry when returning data
    for await (const timeCode of timeCodes) {
      const linkedTimeCode = await TimeCode.findById(timeCode);
      timeCodeIdNameMap[timeCode] = linkedTimeCode.timeCodeName;
    }
    const entriesToReturn = []
    for await (let timeEntry of data) {
      let jsonEntry = JSON.parse(JSON.stringify(timeEntry))
      jsonEntry ={...jsonEntry , timeCodeName: timeCodeIdNameMap[timeEntry.timeCodeId]} 
      entriesToReturn.push(jsonEntry)
    }
    return res.status(200).json(JSON.stringify(entriesToReturn));
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
}

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

const approveTimeEntry = async (req, res) => {
  // Are you an admin or the manager of the worker ??
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.body.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = WorkerController.checkUserManagesTargetWorker(currentUser, requestedWorker)
  const timeEntryId = req.params.id
  let allowRequest = true
  let errorMessage = ""

  //Also need to check if currrentUser is project manager of time code of time entry
  if (!currentUserIsAdmin && !currentUserManagesRequestedWorker) {
    allowRequest = false
    errorMessage = `You are requesting time entries for worker ${requestedWorker} but are logged in as worker ${currentUser}`
  }
  const timeEntry = await TimeEntry.findById(timeEntryId)
  //Only approve if it is submitted
  if (timeEntry.rejected) {
    res.status(500).json("You cannot approve a time entry that is currently rejected as entry submission should reset rejection")
    return
  }
  if (!timeEntry.submitted) {
    res.status(500).json("You cannot approve a time entry that has not yet been submitted")
    return
  }
  //Cannot approve an approved time entry
  if (timeEntry.approved) {
    res.status(500).json("You cannot approve a time entry that has already been approved")
    return
  }
  //If allowRequest is false, check if currentUser is project manager of the project associated with the time code of the time entry
  //And the time code is project-manager-approved and not team-lead-approved
  //Only perform this check if the entry is a time entry and not a time off entry
  if (!allowRequest && !timeEntry.isTimeOff) {
    const linkedTimeCode = await TimeCode.findById(timeEntry.timeCodeId)
    if (linkedTimeCode.approvalByProjectManager) {
      console.log(linkedProject.managerId)
      const linkedProject = await Project.findById(linkedTimeCode.projectId)
      if (linkedProject.managerId == currentUser) {
        allowRequest = true
      }
    }
  }
  //If allow request is still false, send back 401 unauthorized
  if (!allowRequest) {
    res.status(401).json(errorMessage)
    return
  }
  //At this point, we are authorized
  //Rejection message to return info back to worker
  timeEntry.submitted = false
  timeEntry.approved = true
  timeEntry.approverId = currentUser
  timeEntry.approvalDate = new Date() // Upon approval, this approvalDate should be more-or-less identical to the lastUpdate on the schema timestamp
  await timeEntry.save()
  return res.status(200).json(`Time Entry ${timeEntry} approved`)
};


//Approver will approve all time Entries that the requested worker submitted within the provided date range
//Can only approve certain entries depending on time code approval type
//Only line managers can approve time off
const approveTimeEntries = async (req, res) => {

}

const rejectTimeEntry = async (req, res) => {
  // Are you an admin or the manager of the worker ??
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.body.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = WorkerController.checkUserManagesTargetWorker(currentUser, requestedWorker)
  const timeEntryId = req.params.id
  const rejectionMessage = req.body.rejectionMessage
  let allowRequest = true
  let errorMessage = ""
  
  try {
    //Also need to check if currrentUser is project manager of time code of time entry
    if (!currentUserIsAdmin && !currentUserManagesRequestedWorker) {
      allowRequest = false
      errorMessage = `You are requesting time entries for worker ${requestedWorker} but are logged in as worker ${currentUser}`
    }
    const timeEntry = await TimeEntry.findById(timeEntryId)
    //Can only reject a submitted time Entry
    if (!timeEntry.submitted) {
      res.status(500).json("You cannot reject a time entry that has not yet been submitted")
      return
    }
    //Cannot reject an approved time entry
    if (timeEntry.approved) {
      res.status(500).json("You cannot reject a time entry that has already been approved")
      return
    }
    //If allowRequest is false, check if currentUser is project manager of the project associated with the time code of the time entry
    //And the time code is project-manager-approved and not team-lead-approved
    //Only perform this check if the entry is a time entry and not a time off entry
    if (!allowRequest && !timeEntry.isTimeOff) {
      const linkedTimeCode = await TimeCode.findById(timeEntry.timeCodeId)
      if (linkedTimeCode.approvalByProjectManager) {
        const linkedProject = await Project.findById(linkedTimeCode.projectId)
        if (linkedProject.managerId == currentUser) {
          allowRequest = true
        }
      }
    }
    //If allow request is still false, send back 401 unauthorized
    if (!allowRequest) {
      res.status(401).json(errorMessage)
      return
    }
    //At this point, we are authorized
    //Set submitted to false - send back to worker
    //Rejection message to return info back to worker
    console.log('got here ' + timeEntry)
    timeEntry.submitted = false
    timeEntry.rejected = true
    timeEntry.rejectionMessage = rejectionMessage
    await timeEntry.save()
    return res.status(200).json(`Time Entry ${timeEntry} rejected`)
  } catch (err) {
    return res.status(500).json(err)
  }
  }

  const submitEntriesForDay = async (req, res) => {
    const token = req.get("Authorization").split(' ')[1]
    const payload = WorkerController.parseJWT(token)
    const currentUser = payload.user
    const requestedWorker = req.body.workerId
    if (currentUser != requestedWorker) {
      return res.status(401).json(`You are trying to submit entries for worker ${requestedWorker} but are logged in as worker ${currentUser}`)
    }
    try {
      const date = new Date(req.body.date.key)
      const entries = await TimeEntry.find({workerId: requestedWorker, date: date })
      if (entries.length == 0) {
        return res.status(200).json('No entries for date')
      }
      //Filter out any entries that are already submitted or already approved
      const entriesToSubmit = entries.filter(timeEntry => (!timeEntry.submitted && !timeEntry.approved))
      //Using counter as forEach is synchronous and executing in parallel
      var entriesProcessed = 0
      entriesToSubmit.forEach(async timeEntry => {
        timeEntry.submitted = true
        timeEntry.rejected = false
        timeEntry.rejectionMessage = null
        entriesProcessed++
        await timeEntry.save()
        if (entriesProcessed == entriesToSubmit.length) {
          return res.status(200).json("Successfully submitted time entries");
        }
      })
  } catch (err) {
    return res.status(500).json(err)
  }
};

const deleteTimeEntry = (req, res) => {
  // Validate that entry is not submitted or approved
  // And that the worker removing the time entry is the worker linked to it
    TimeEntry.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Time Entry not available');
      }
      data.remove();
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
  approveTimeEntry,
  approveTimeEntries,
  rejectTimeEntry,
  updateTimeEntry,
  submitEntriesForDay,
  deleteTimeEntry
};
