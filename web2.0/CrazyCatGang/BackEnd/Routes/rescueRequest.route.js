const express = require('express')
const router = express.Router()
const {createRescueRequest, getRescueRequests, getRescueRequestById, deleteRescueRequestById} = require('../Controllers/rescueRequest.controller.js')

// Add rescue request 
router.post('/', createRescueRequest)


// Get all rescue requests
router.get('/', getRescueRequests)


// Get rescue request by ID
router.get('/:id', getRescueRequestById)


// Delete rescue request by ID
router.delete('/:id', deleteRescueRequestById)

module.exports = router