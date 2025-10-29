export const getAdminCode = () => {
  return process.env.NEXT_PUBLIC_ADMIN_CODE ?? "";
};
