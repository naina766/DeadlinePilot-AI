export const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

export const sendError = (res, message = 'An error occurred', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    error: message,
    details: details || undefined
  });
};
