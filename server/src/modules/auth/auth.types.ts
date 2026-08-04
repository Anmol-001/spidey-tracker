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
