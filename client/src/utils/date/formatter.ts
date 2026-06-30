import { TIMEZONE_IST } from './constants';

export const formatISTDate = (date: Date | string | number): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE_IST,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(d);
};

export const formatISTTime = (date: Date | string | number): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE_IST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d);
};

export const formatISTDateTime = (date: Date | string | number): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE_IST,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d);
};

export const getISTWeekday = (date: Date | string | number): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE_IST,
    weekday: 'long'
  }).format(d);
};
