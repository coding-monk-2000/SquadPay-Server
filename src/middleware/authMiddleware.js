const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // Use an environment variable in production

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticate;
