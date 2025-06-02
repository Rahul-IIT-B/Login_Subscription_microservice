// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Extract token from the 'Authorization' header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using the secret from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user data to the request object for further use
    req.user = decoded;
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // Token verification failed, unauthorized access
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
