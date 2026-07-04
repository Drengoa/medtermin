const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, getDoctorAvailability, getAllSpecializations, getAllOffices } = require('../controllers/doctorController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllDoctors);
router.get('/specializations', verifyToken, getAllSpecializations);
router.get('/offices', verifyToken, getAllOffices);
router.get('/:id', verifyToken, getDoctorById);
router.get('/:id/availability', verifyToken, getDoctorAvailability);

module.exports = router;