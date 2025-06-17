export type UserRole = 'admin' | 'vendor' | 'buyer' | 'delivery';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
