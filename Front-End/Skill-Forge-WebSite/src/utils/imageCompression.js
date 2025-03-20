/**
 * Compresses an image file to reduce size before upload
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @param {number} options.quality - JPEG quality (0-1)
 * @returns {Promise<string>} - Returns a promise that resolves to a base64 string
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      // If it's not an image or null, just return null - we'll handle this elsewhere
      return resolve(null);
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // For PNG files with transparency, use PNG format
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        // Get compressed data URL
        const dataUrl = canvas.toDataURL(outputFormat, quality);

        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file for compression'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Process video file to extract first frame as thumbnail and prepare for upload
 * @param {File} file - The video file
 * @returns {Promise<{dataUrl: string, thumbnail: string}>} Video data URL and thumbnail
 */
export const processVideo = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('video/')) {
      return resolve(null);
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      // We're just converting to base64 for now - thumbnails require server-side processing
      resolve(event.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to process video'));
    };

    reader.readAsDataURL(file);
  });
};
