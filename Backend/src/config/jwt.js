const jwt = require("jsonwebtoken");

const payload = {
  userId: "12345",
  role: "admin",
};

const secretKey = "your-secret-key";

const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

console.log("JWT Token:", token);
