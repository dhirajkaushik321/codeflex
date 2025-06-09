export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'supersecret_jwt_key_change_me',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}; 