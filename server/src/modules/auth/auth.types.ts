/**
 * Registration request input payload
 */
export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

/**
 * Explicitly constructed registration response representation
 */
export type RegisteredUser = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Login request input payload
 */
export type LoginInput = {
  email: string;
  password: string;
};

/**
 * Explicitly constructed login response representation
 */
export type LoginResponse = {
  accessToken: string;
  user: RegisteredUser;
};
