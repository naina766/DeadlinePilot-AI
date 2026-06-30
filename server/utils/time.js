export const parseTimeStr = (timeStr) => {
  if (!timeStr || !timeStr.includes(':')) {
    return { hours: 9, minutes: 0 };
  }
  const [h, m] = timeStr.split(':').map(Number);
  return { hours: isNaN(h) ? 9 : h, minutes: isNaN(m) ? 0 : m };
};

export const formatTimeStr = (hours, minutes) => {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
