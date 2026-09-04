export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "Please upload a valid image file (.jpg, .png, etc.)." };
  }
  const maxSizeInMB = 10;
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return { isValid: false, error: `Image size must be less than ${maxSizeInMB}MB.` };
  }
  return { isValid: true, error: null };
};