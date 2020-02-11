/**
 * Tests for form ###-###-#### (including hyphens)
 * @param phoneNumber - Phone number to test
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return /^([1-9]\d{2}-\d{3}-\d{4})$/.test(phoneNumber);
};
