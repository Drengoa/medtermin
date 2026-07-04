const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registracija novog korisnika (pacijenta)
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone } = req.body;

        // Provera da li su sva polja poslata
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: 'Sva obavezna polja moraju biti popunjena' });
        }

        // Provera da li email već postoji
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Korisnik sa ovim emailom već postoji' });
        }

        // Heširanje lozinke
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upis korisnika u bazu (role je uvek 'patient' pri registraciji)
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, 'patient', phone || null]
        );

        res.status(201).json({ message: 'Uspešna registracija', userId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri registraciji' });
    }
};

// Login korisnika
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email i lozinka su obavezni' });
        }

        // Pronalaženje korisnika po emailu
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
        }

        const user = users[0];

        // Provera lozinke (poređenje unete lozinke sa heširanom iz baze)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
        }

        // Generisanje JWT tokena
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Vraćamo token i osnovne podatke o korisniku (bez lozinke)
        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška pri prijavljivanju' });
    }
};

module.exports = { register, login };