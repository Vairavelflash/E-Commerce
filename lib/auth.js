import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export const hashpassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generatetoken = (user) => {
  return jwt.sign(
    { id: user.id, email: user?.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return error;
  }
};


export const isAdmin = (decoded) => decoded?.role === "admin";
