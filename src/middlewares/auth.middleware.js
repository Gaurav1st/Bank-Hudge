import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"
import TokenBlackList from "../models/blackList.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

   const isTokenBlackListed = await TokenBlackList.findOne({ token });

if (isTokenBlackListed) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized. Please log in again. This token has been blacklisted.",
  });
}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};


const authSystemMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    const isTokenBlackListed = await TokenBlackList.findOne({ token });

if (isTokenBlackListed) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized. Please log in again. This token has been blacklisted.",
  });
}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
      .select("+systemUser");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.systemUser) {
      return res.status(403).json({
        success: false,
        message: "Access denied. System user only.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};


export default { verifyToken, authSystemMiddleware }