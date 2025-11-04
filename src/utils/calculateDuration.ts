// Helper function to calculate duration from time range
export const calculateDuration = (timeRange: string): string => {
  try {
    const [startTime, endTime] = timeRange.split(' - ');
    if (!startTime || !endTime) return '';

    const parseTime = (time: string) => {
      const [timePart, period] = time.trim().split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      let hour24 = hours;

      if (period?.toUpperCase() === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (period?.toUpperCase() === 'AM' && hours === 12) {
        hour24 = 0;
      }

      return hour24 * 60 + (minutes || 0); // Convert to minutes
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    const durationMinutes = endMinutes - startMinutes;

    if (durationMinutes <= 0) return '';

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '';
  }
};
