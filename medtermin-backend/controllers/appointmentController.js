const db = require('../config/db');

// Pacijent zakazuje termin
const createAppointment = async (req, res) => {
    try {
        const patient_id = req.user.id; // uzimamo iz JWT tokena, ne iz body-ja (sigurnije)
        const { doctor_id, appointment_date, appointment_time, reason } = req.body;

        if (!doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ error: 'Lekar, datum i vreme su obavezni' });
        }

        // Provera da termin nije već zauzet
        const [existing] = await db.query(
            `SELECT id FROM appointments 
             WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? 
             AND status IN ('pending', 'confirmed')`,
            [doctor_id, appointment_date, appointment_time]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Ovaj termin je već zauzet' });
        }

        const [result] = await db.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) 
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [patient_id, doctor_id, appointment_date, appointment_time, reason || null]
        );

        res.status(201).json({ message: 'Termin uspešno zakazan', appointmentId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri zakazivanju termina' });
    }
};

// Pacijent - lista svojih termina
const getMyAppointments = async (req, res) => {
    try {
        const patient_id = req.user.id;

        const [appointments] = await db.query(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason, a.doctor_notes,
                    u.first_name AS doctor_first_name, u.last_name AS doctor_last_name,
                    s.name AS specialization_name
             FROM appointments a
             JOIN doctors d ON a.doctor_id = d.id
             JOIN users u ON d.user_id = u.id
             JOIN specializations s ON d.specialization_id = s.id
             WHERE a.patient_id = ?
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
            [patient_id]
        );

        res.json(appointments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju termina' });
    }
};

// Pacijent otkazuje termin
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const patient_id = req.user.id;

        // Provera da termin pripada ovom pacijentu
        const [appointments] = await db.query(
            'SELECT * FROM appointments WHERE id = ? AND patient_id = ?',
            [id, patient_id]
        );

        if (appointments.length === 0) {
            return res.status(404).json({ error: 'Termin nije pronađen' });
        }

        await db.query('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', id]);

        res.json({ message: 'Termin je otkazan' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri otkazivanju termina' });
    }
};

// Lekar - lista svojih termina
const getDoctorAppointments = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Prvo nalazimo doctor_id na osnovu user_id iz tokena
        const [doctorRows] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [user_id]);

        if (doctorRows.length === 0) {
            return res.status(404).json({ error: 'Lekar nije pronađen' });
        }

        const doctor_id = doctorRows[0].id;

        const [appointments] = await db.query(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason, a.doctor_notes,
                    u.first_name AS patient_first_name, u.last_name AS patient_last_name,
                    u.phone AS patient_phone
             FROM appointments a
             JOIN users u ON a.patient_id = u.id
             WHERE a.doctor_id = ?
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
            [doctor_id]
        );

        res.json(appointments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju termina' });
    }
};

// Lekar potvrđuje termin
const confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE appointments SET status = ? WHERE id = ?', ['confirmed', id]);
        res.json({ message: 'Termin je potvrđen' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri potvrđivanju termina' });
    }
};

// Lekar završava pregled i unosi napomenu
const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctor_notes } = req.body;

        await db.query(
            'UPDATE appointments SET status = ?, doctor_notes = ? WHERE id = ?',
            ['completed', doctor_notes || null, id]
        );

        res.json({ message: 'Pregled je završen' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri završavanju pregleda' });
    }
};

module.exports = {
    createAppointment,
    getMyAppointments,
    cancelAppointment,
    getDoctorAppointments,
    confirmAppointment,
    completeAppointment
};