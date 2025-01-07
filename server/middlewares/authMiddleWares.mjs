import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied,Login required" });
  }
  try {
    const secretKey = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secretKey);

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid User Role" });
    }
    next();
  };
