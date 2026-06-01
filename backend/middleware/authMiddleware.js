import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token required"
      });
    }

    const part = authHeader.split(" ");
    const JWT_SECRET = part[1];

    const decoded = jwt.verify(
      JWT_SECRET,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};

export default authMiddleware;