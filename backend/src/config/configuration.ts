export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/codeveer',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  // App
  app: {
    name: 'codeVeer API',
    version: '1.0.0',
  },
}); 