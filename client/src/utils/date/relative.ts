import { getCurrentISTDate } from './timezone';

export const getRelativeISTTime = (targetDate: Date | string | number): string => {
  if (!targetDate) return '';
  const target = new Date(targetDate);
  if (isNaN(target.getTime())) return '';
  
  const now = getCurrentISTDate();
  const diffMs = target.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / 3600000);
  
  if (diffHours === 0) {
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 0) return `${Math.abs(diffMins)}m ago`;
    return `In ${diffMins}m`;
  }
  
  if (diffHours < 0) {
    const absHours = Math.abs(diffHours);
    if (absHours > 24) {
      const days = Math.round(absHours / 24);
      return `${days}d ago`;
    }
    return `${absHours}h ago`;
  }
  
  if (diffHours > 24) {
    const days = Math.round(diffHours / 24);
    return `In ${days}d`;
  }
  
  return `In ${diffHours}h`;
};
