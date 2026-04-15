import jwt from 'jsonwebtoken';

export const authenticate = (req) => {
  const token = req.headers.authorization || "";
  if (!token) throw new Error("Not authenticated");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
