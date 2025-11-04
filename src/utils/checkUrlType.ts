const checkUrlType = (mimetype: string): string => {
  try {
    const lowerMimetype = mimetype.toLowerCase();

    // Check for image types
    if (lowerMimetype.startsWith('image/')) {
      return 'image';
    }

    // Check for video types
    if (lowerMimetype.startsWith('video/')) {
      return 'video';
    }

    // Everything else is considered a file
    return 'file';
  } catch (error) {
    console.error('Error checking mimetype:', error);
    return 'file'; // Default to file on error
  }
};

export default checkUrlType;
