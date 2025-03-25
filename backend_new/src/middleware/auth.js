import jwt from "jsonwebtoken";

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret key
    req.user = decoded; // Attach the user info to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};
