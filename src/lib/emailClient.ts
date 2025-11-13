export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return false;
  return emailPattern.test(email.trim());
};

export const authorizeEmail = (email: string) => {
  const digitCode = generateFourDigitCode();
  console.log(`Authorized email: ${email}`, digitCode);

  return email;
};

export const generateFourDigitCode = (): string => {
  const code = Math.floor(Math.random() * 10000);
  return code.toString().padStart(4, "0");
};
