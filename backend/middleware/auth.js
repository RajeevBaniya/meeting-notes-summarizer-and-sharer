import jwt from 'jsonwebtoken'

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const payload = jwt.decode(token)

    
    if (!payload.sub) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = {
      id: payload.sub,
      email: payload.email || payload.user_metadata?.email,
      name: payload.user_metadata?.name || payload.email?.split('@')[0] || null
    }

    next()
  } catch (error) {
    console.error('Auth error:', error.message)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
