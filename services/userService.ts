export const getUserDetails = () => {
  return { name: "John Doe", email: "john@example.com" };
};

export const createOrUpdateUser = (userData: any) => {
  return { success: true, user: userData };
};
