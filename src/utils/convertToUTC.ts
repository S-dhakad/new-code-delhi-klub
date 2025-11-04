// Helper function to convert date and time to UTC
export const convertToUTC = (
  dateStr: string,
  timeRange: string,
): Date | null => {
  try {
    const startTime = timeRange.split(' - ')[0];
    if (!startTime) return null;

    let day: string, month: string, year: string;
    let monthIndex: number;

    // Check if date is in YYYY-MM-DD format (from HTML5 date input)
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [yearPart, monthPart, dayPart] = dateStr.split('-');
      year = yearPart;
      month = monthPart;
      day = dayPart;
      monthIndex = parseInt(month) - 1; // Month is 0-indexed in JavaScript Date
    } else {
      // Parse the date string (assuming format like "Wednesday, 10 June 2025")
      const datePart = dateStr.replace(/^\w+,\s*/, ''); // Remove day name
      [day, month, year] = datePart.split(' ');

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      monthIndex = monthNames.indexOf(month);
      if (monthIndex === -1) return null;
    }

    // Parse time
    const [timePart, period] = startTime.trim().split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour24 = hours;

    if (period?.toUpperCase() === 'PM' && hours !== 12) {
      hour24 += 12;
    } else if (period?.toUpperCase() === 'AM' && hours === 12) {
      hour24 = 0;
    }

    // Create date object and convert to UTC
    const date = new Date(
      parseInt(year),
      monthIndex,
      parseInt(day),
      hour24,
      minutes || 0,
    );
    return date;
  } catch (error) {
    console.error('Error converting to UTC:', error);
    return null;
  }
};
