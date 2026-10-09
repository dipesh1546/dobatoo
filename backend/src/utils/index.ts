// Shared utility functions module
export const formatRegistrationCode = (prefix: string, id: number | string): string => {
  return `${prefix}-${String(id).padStart(6, '0')}`;
};
