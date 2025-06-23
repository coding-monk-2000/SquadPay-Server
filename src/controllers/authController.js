
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../logger.js";


const SECRET_KEY = process.env.SECRET_KEY;


    
export const register = async (req, res, db) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const [userId] = await db('users')
  .insert({ username, password: hashedPassword })
  .returning('id');
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
  return res.status(201).json({ message: "User registered successfully", token });
    }catch(_err) {
        return res.status(500).json({error: "database entry failed"})
    }
};

// User Login
export const login = async (req, res, db) => {

  const { username, password } = req.body;

  try {
    const user = await db('users')
      .where({ username })
      .first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    logger.info('User signed in', { userId: user.id });
    // If credentials are valid, issue JWT
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });

  } catch (_err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


// Protected Route Logic
export const protectedRoute = (req, res) => {
    res.json({ message: "This is a protected route!", userId: req.userId });
};
