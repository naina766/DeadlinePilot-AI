import authService from '../services/auth.service.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  let token = '';
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
    } else {
      token = authHeader;
    }
  }

  try {
    const user = await authService.verifyIdToken(token);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    // Silent fallback to mock user for offline hackathon ease of run
    req.user = {
      uid: 'mock_user_123',
      email: 'pilot@deadline.ai',
      name: 'Vibe Pilot'
    };
    next();
  }
};

export default authMiddleware;
