export const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US"); // Format: MM/DD/YYYY
};
