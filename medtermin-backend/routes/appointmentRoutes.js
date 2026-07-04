const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getMyAppointments,
    cancelAppointment,
    getDoctorAppointments,
    confirmAppointment,
    completeAppointment
} = require('../controllers/appointmentController');
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Pacijent
router.post('/', verifyToken, checkRole('patient'), createAppointment);
router.get('/my', verifyToken, checkRole('patient'), getMyAppointments);
router.put('/:id/cancel', verifyToken, checkRole('patient'), cancelAppointment);

// Lekar
router.get('/doctor', verifyToken, checkRole('doctor'), getDoctorAppointments);
router.put('/:id/confirm', verifyToken, checkRole('doctor'), confirmAppointment);
router.put('/:id/complete', verifyToken, checkRole('doctor'), completeAppointment);

module.exports = router;