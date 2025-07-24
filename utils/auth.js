import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;
const expiration = "1d";

// Middleware to verify token
export function authMiddleware(req, res, next) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return res.status(401).json({ message: "You must be logged in to do that." });
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next(); 
  } catch (err) {
    console.log("Invalid token", err.message);
    return res.status(401).json({ message: "Invalid token." });
  }
}

// Function to sign JWT token
export function signToken({ username, email, _id }) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
