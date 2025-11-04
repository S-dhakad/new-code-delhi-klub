// Helper function to format UTC date strings to user-friendly format
export const formatDate = (
  dateString: string | null | undefined,
  options?: {
    locale?: string;
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
  },
): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const defaultOptions = {
      locale: 'en-US',
      year: 'numeric' as const,
      month: 'long' as const,
      day: 'numeric' as const,
    };

    const formatOptions = { ...defaultOptions, ...options };

    return date.toLocaleDateString(formatOptions.locale, {
      year: formatOptions.year,
      month: formatOptions.month,
      day: formatOptions.day,
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Helper function to format date for display in course cards
export const formatCourseDate = (
  dateString: string | null | undefined,
): string => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to format date for relative time display (e.g., "2 days ago")
export const formatRelativeDate = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

    return formatDate(dateString);
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid Date';
  }
};

// Helper function to format joined date
export const formatJoinedDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return `Joined ${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
};
