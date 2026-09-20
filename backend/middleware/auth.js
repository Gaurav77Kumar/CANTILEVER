import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  const header = req.get('Authorization') || '';

  if (!header.startsWith('Bearer ')) 
    return res.status(401).json({ message: 'Please sign in.' });

  let payload;
  try {
    payload = jwt.verify(header.slice(7), process.env.JWT_SECRET, { algorithms: ['HS256'] });

  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
  try {
    const user = await User.findById(payload.sub);
    
    if (!user) return res.status(401).json({ message: 'Please sign in.' });
    req.user = user;
    next();
  } catch (error) { next(error); }
}
