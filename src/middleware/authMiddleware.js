const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

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

const authenticatePasswordResetLink = (req, res, next) => {
    const { userId, token } = req.params;
    if (!token) return res.status(401).json({ error: "Token not present" });
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.userId !== userId) {
  return res.status(403).json({ error: "Token does not match user" });
}
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = {authenticate, authenticatePasswordResetLink};
