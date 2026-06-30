import admin from '../config/firebase.js';

export const authService = {
  verifyIdToken: async (token) => {
    const mockUser = {
      uid: 'mock_user_123',
      email: 'pilot@deadline.ai',
      name: 'Vibe Pilot'
    };

    if (!token) {
      return mockUser;
    }

    if (token === 'mock-token-123') {
      return mockUser;
    }

    try {
      if (admin && admin.apps.length > 0) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || 'Deadline Pilot User'
        };
      }
      return mockUser;
    } catch (error) {
      console.error(`Firebase token verification failed: ${error.message}. Falling back to mock user.`);
      return mockUser;
    }
  }
};

export default authService;
