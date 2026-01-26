export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const isTimeCritical = (seconds: number, threshold: number = 300): boolean => {
  return seconds <= threshold && seconds > 0;
};
