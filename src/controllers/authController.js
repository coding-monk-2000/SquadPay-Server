
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const SECRET_KEY = "your_secret_key";

// User Registration
exports.register = async (req, res, db) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
        if (err) {
            return res.status(500).json({ error: "username already exists" });
        }

        // Generate JWT after registration
        const token = jwt.sign({ userId: this.lastID }, SECRET_KEY, { expiresIn: "1h" });
        res.status(201).json({ message: "User registered successfully", token });
    });
};

// User Login
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

// Protected Route Logic
exports.protectedRoute = (req, res) => {
    res.json({ message: "This is a protected route!", userId: req.userId });
};
