// src/constants/userRoles.ts
// Define roles used in your application
// Matches the roles array in User.model.ts
export enum ENUM_USER_ROLE {
  USER = 'user',
  EXPERT = 'expert',
  ADMIN = 'admin',
  // Add other roles if needed
}

export const USER_ROLES_LIST = Object.values(ENUM_USER_ROLE);
