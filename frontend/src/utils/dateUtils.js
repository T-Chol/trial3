import { addDays, format, isSaturday, isSunday } from 'date-fns';

const holidays = {
  '2024-01-01': "New Year's Day",
  '2024-05-01': 'Labour Day',
  '2024-06-01': 'Madaraka Day',
  '2024-10-20': 'Mashujaa Day',
  '2024-12-12': 'Jamhuri Day',
  '2024-12-25': 'Christmas Day',
  '2024-12-26': 'Boxing Day',
  // Add other public holidays here as needed
};

export const isHoliday = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return holidays[formattedDate] || null;
};

export const addBusinessDays = (date, days) => {
  let result = date;
  let addedDays = 0;
  while (addedDays < days) {
    result = addDays(result, 1);
    if (!isSaturday(result) && !isSunday(result) && !isHoliday(result)) {
      addedDays++;
    }
  }
  return result;
};

export const formatDate = (date) => format(date, 'yyyy-MM-dd');
