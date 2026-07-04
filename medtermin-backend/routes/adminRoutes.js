const express = require('express');
const router = express.Router();
const {
    getAllDoctorsAdmin,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createSpecialization,
    setDoctorAvailability,
    getDoctorAvailability
} = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/doctors', verifyToken, checkRole('admin'), getAllDoctorsAdmin);
router.post('/doctors', verifyToken, checkRole('admin'), createDoctor);
router.put('/doctors/:id', verifyToken, checkRole('admin'), updateDoctor);
router.delete('/doctors/:id', verifyToken, checkRole('admin'), deleteDoctor);
router.put('/doctors/:id/availability', verifyToken, checkRole('admin'), setDoctorAvailability);
router.get('/doctors/:id/availability', verifyToken, checkRole('admin'), getDoctorAvailability);

router.post('/specializations', verifyToken, checkRole('admin'), createSpecialization);

module.exports = router;