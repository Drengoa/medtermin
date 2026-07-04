const db = require('../config/db');
const bcrypt = require('bcrypt');

// Lista svih lekara (za admin panel - malo detaljnije nego javna verzija)
const getAllDoctorsAdmin = async (req, res) => {
    try {
        const query = `
            SELECT d.id, u.id AS user_id, u.first_name, u.last_name, u.email, u.phone, d.bio,
                   s.id AS specialization_id, s.name AS specialization_name,
                   o.id AS office_id, o.name AS office_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            JOIN specializations s ON d.specialization_id = s.id
            LEFT JOIN offices o ON d.office_id = o.id
        `;
        const [doctors] = await db.query(query);
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju lekara' });
    }
};

// Dodavanje novog lekara (kreira i user i doctor zapis)
const createDoctor = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, specialization_id, office_id, bio } = req.body;

        if (!first_name || !last_name || !email || !password || !specialization_id) {
            return res.status(400).json({ error: 'Obavezna polja nisu popunjena' });
        }

        // Provera da email ne postoji već
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Korisnik sa ovim emailom već postoji' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Prvo kreiramo user zapis sa role = 'doctor'
        const [userResult] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, 'doctor', phone || null]
        );

        const userId = userResult.insertId;

        // Zatim kreiramo doctor zapis povezan sa tim user-om
        const [doctorResult] = await db.query(
            'INSERT INTO doctors (user_id, specialization_id, office_id, bio) VALUES (?, ?, ?, ?)',
            [userId, specialization_id, office_id || null, bio || null]
        );

        res.status(201).json({ message: 'Lekar uspešno dodat', doctorId: doctorResult.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri dodavanju lekara' });
    }
};

// Izmena postojećeg lekara
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { specialization_id, office_id, bio, phone } = req.body;

        // Nalazimo user_id da bismo mogli da ažuriramo i users tabelu (phone)
        const [doctorRows] = await db.query('SELECT user_id FROM doctors WHERE id = ?', [id]);
        if (doctorRows.length === 0) {
            return res.status(404).json({ error: 'Lekar nije pronađen' });
        }

        await db.query(
            'UPDATE doctors SET specialization_id = ?, office_id = ?, bio = ? WHERE id = ?',
            [specialization_id, office_id || null, bio || null, id]
        );

        if (phone) {
            await db.query('UPDATE users SET phone = ? WHERE id = ?', [phone, doctorRows[0].user_id]);
        }

        res.json({ message: 'Lekar uspešno izmenjen' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri izmeni lekara' });
    }
};

// Brisanje lekara
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const [doctorRows] = await db.query('SELECT user_id FROM doctors WHERE id = ?', [id]);
        if (doctorRows.length === 0) {
            return res.status(404).json({ error: 'Lekar nije pronađen' });
        }

        // Brisanjem user-a se automatski briše i doctor zapis (ON DELETE CASCADE)
        await db.query('DELETE FROM users WHERE id = ?', [doctorRows[0].user_id]);

        res.json({ message: 'Lekar uspešno obrisan' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri brisanju lekara' });
    }
};

// Dodavanje nove specijalizacije
const createSpecialization = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Naziv specijalizacije je obavezan' });
        }

        const [result] = await db.query('INSERT INTO specializations (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Specijalizacija dodata', specializationId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri dodavanju specijalizacije' });
    }
};

// Podešavanje rasporeda dostupnosti lekara
const setDoctorAvailability = async (req, res) => {
    try {
        const { id } = req.params; // doctor_id
        const { availability } = req.body; // niz objekata: [{ day_of_week, start_time, end_time, slot_duration }, ...]

        if (!Array.isArray(availability)) {
            return res.status(400).json({ error: 'Availability mora biti niz' });
        }

        // Brišemo staru dostupnost i upisujemo novu (jednostavniji pristup za faks projekat)
        await db.query('DELETE FROM availability WHERE doctor_id = ?', [id]);

        for (const slot of availability) {
            await db.query(
                'INSERT INTO availability (doctor_id, day_of_week, start_time, end_time, slot_duration) VALUES (?, ?, ?, ?, ?)',
                [id, slot.day_of_week, slot.start_time, slot.end_time, slot.slot_duration || 30]
            );
        }

        res.json({ message: 'Raspored uspešno ažuriran' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri ažuriranju rasporeda' });
    }
};

// Dobijanje trenutnog rasporeda dostupnosti lekara (za edit formu)
const getDoctorAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const [availability] = await db.query(
            'SELECT day_of_week, start_time, end_time, slot_duration FROM availability WHERE doctor_id = ?',
            [id]
        );

        res.json(availability);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri učitavanju rasporeda' });
    }
};

module.exports = {
    getAllDoctorsAdmin,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createSpecialization,
    setDoctorAvailability,
    getDoctorAvailability
};