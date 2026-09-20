import jwt from 'jsonwebtoken'

export function requireAuth(request, response, next) {
  const header = request.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return response.status(401).json({ message: 'Authentication required' })
  try {
    request.userId = jwt.verify(token, process.env.JWT_SECRET).userId
    next()
  } catch { response.status(401).json({ message: 'Session expired. Please log in again.' }) }
}
