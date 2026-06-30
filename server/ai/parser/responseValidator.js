
export const responseValidator = {
  isValid: (payload) => {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    if (typeof payload.type !== 'string' || !payload.type.trim()) {
      return false;
    }
    if (typeof payload.title !== 'string' || !payload.title.trim()) {
      return false;
    }
    if (typeof payload.summary !== 'string') {
      return false;
    }
    if (!Array.isArray(payload.cards)) {
      return false;
    }
    if (!Array.isArray(payload.quickActions)) {
      return false;
    }
    return true;
  }
};
export default responseValidator;
