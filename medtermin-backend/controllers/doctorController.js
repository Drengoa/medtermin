const db = require('../config/db');

// Lista svih lekara (sa mogućnošću filtriranja po specijalizaciji)
const getAllDoctors = async (req, res) => {
    try {
        const { specialization_id } = req.query;

        let query = `
            SELECT d.id, u.first_name, u.last_name, d.bio,
                   s.id AS specialization_id, s.name AS specialization_name,
                   o.name AS office_name, o.address AS office_address
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            JOIN specializations s ON d.specialization_id = s.id
            LEFT JOIN offices o ON d.office_id = o.id
        `;

        const params = [];

        if (specialization_id) {
            query += ' WHERE d.specialization_id = ?';
            params.push(specialization_id);
        }

        const [doctors] = await db.query(query, params);
        res.json(doctors);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju lekara' });
    }
};

// Detalji jednog lekara
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
    SELECT d.id, u.first_name, u.last_name, u.email, u.phone, d.bio,
           s.id AS specialization_id, s.name AS specialization_name,
           o.id AS office_id, o.name AS office_name, o.address AS office_address
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    JOIN specializations s ON d.specialization_id = s.id
    LEFT JOIN offices o ON d.office_id = o.id
    WHERE d.id = ?
`;

        const [doctors] = await db.query(query, [id]);

        if (doctors.length === 0) {
            return res.status(404).json({ error: 'Lekar nije pronađen' });
        }

        res.json(doctors[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju lekara' });
    }
};

// Dostupni termini za lekara na određeni datum
const getDoctorAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Datum je obavezan parametar' });
        }

        const dayOfWeek = new Date(date).getDay();

        const [availabilityRows] = await db.query(
            'SELECT * FROM availability WHERE doctor_id = ? AND day_of_week = ?',
            [id, dayOfWeek]
        );

        if (availabilityRows.length === 0) {
            return res.json([]);
        }

        const availability = availabilityRows[0];

        const slots = [];
        let current = new Date(`${date}T${availability.start_time}`);
        const end = new Date(`${date}T${availability.end_time}`);

        while (current < end) {
            const timeString = current.toTimeString().slice(0, 8);
            slots.push(timeString);
            current = new Date(current.getTime() + availability.slot_duration * 60000);
        }

        const [bookedRows] = await db.query(
            `SELECT appointment_time FROM appointments 
             WHERE doctor_id = ? AND appointment_date = ? AND status IN ('pending', 'confirmed')`,
            [id, date]
        );

        const bookedTimes = bookedRows.map(row => row.appointment_time);
        const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

        res.json(availableSlots);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju dostupnih termina' });
    }
};

// Lista svih specijalizacija (koristi se za filter na frontend-u)
const getAllSpecializations = async (req, res) => {
    try {
        const [specializations] = await db.query('SELECT * FROM specializations');
        res.json(specializations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju specijalizacija' });
    }
};

// Lista svih ordinacija (koristi se u admin formi za dodavanje lekara)
const getAllOffices = async (req, res) => {
    try {
        const [offices] = await db.query('SELECT * FROM offices');
        res.json(offices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju ordinacija' });
    }
};

module.exports = { getAllDoctors, getDoctorById, getDoctorAvailability, getAllSpecializations, getAllOffices };