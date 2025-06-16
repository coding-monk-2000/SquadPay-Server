
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require('../services/emailService');

const SECRET_KEY = process.env.SECRET_KEY;
console.debug("SK", SECRET_KEY)

exports.register = async (req, res, db) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
        if (err) {
            return res.status(500).json({ error: "username already exists" });
        }

        const token = jwt.sign({ userId: this.lastID }, SECRET_KEY, { expiresIn: "1h" });
        res.status(201).json({ message: "User registered successfully", token });
    });
};

exports.login = async (req, res, db) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    });
};

exports.reset = async (req, res, db) => {
    const { username } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (!user) {
            return res.status(401).json({ error: "Invalid Username" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

        await sendPasswordResetEmail(user.id, username, token)
        res.status(200).json({ message: "Email sent", token });
    });
};

exports.resetPassword = async (req, res, db) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.get("SELECT * FROM users WHERE id = ?", [userId], async (err, user) => {
        if (!user) {
            return res.status(401).json({ error: "Invalid User" });
        }


        db.run(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId],
            function (err) {
                if (err) {
                    res.status(500).json({ message: "Error updating password" });
                } else {
                    res.status(200).json({ message: "Password update successfully" });
                }
            }
        );
    });
};



// Protected Route Logic
exports.protectedRoute = (req, res) => {
    res.json({ message: "This is a protected route!", userId: req.userId });
};
