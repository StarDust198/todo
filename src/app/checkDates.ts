export const checkDay = (date: string): boolean => {
  const currentDate = new Date();
  const dayLength = 86400000;
  const dayStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  ).getTime();
  const dayEnd = dayStart + dayLength;
  const dateNum = new Date(date).getTime();

  return dateNum >= dayStart && dateNum < dayEnd;
};

export const checkWeek = (date: string): boolean => {
  const currentDate = new Date();
  const weekLength = 604800000;
  const weekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  ).getTime();
  const weekEnd = weekStart + weekLength;
  const dateNum = new Date(date).getTime();

  return dateNum >= weekStart && dateNum < weekEnd;
};

export const checkIncoming = (date: string): boolean => {
  return new Date() < new Date(date);
};
