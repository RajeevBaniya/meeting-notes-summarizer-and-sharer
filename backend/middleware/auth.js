import jwt from 'jsonwebtoken'
import { prisma } from '../services/db.js'

export const requireAuth = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers.authorization)
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET
    
    if (!jwtSecret) {
      console.error('SUPABASE_JWT_SECRET not configured')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    const payload = jwt.decode(token)
    console.log('Token payload:', payload)
    
    if (!payload.sub) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    let user = await prisma.user.findUnique({
      where: { authUserId: payload.sub }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          authUserId: payload.sub,
          email: payload.email || payload.user_metadata?.email || 'user@example.com',
          passwordHash: 'supabase-managed',
          name: payload.user_metadata?.name || payload.email?.split('@')[0] || null
        }
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth error:', error.message)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
