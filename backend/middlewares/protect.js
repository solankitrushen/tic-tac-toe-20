import { validateSignature } from "../utils/index.js";

const protect = async (req, res, next) => {
  try {
    const userAuthToken = req.cookies.token;

    if (!userAuthToken) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const isAuthorized = await validateSignature(req, userAuthToken);

    if (isAuthorized) {
      return next();
    }

    return res.status(403).json({ message: "Not Authorized" });

  } catch (error) {
    // console.error("Authorization error:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protect;
