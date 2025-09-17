import { createContext } from "react";

// Define the UserDetail interface directly here
export interface UserDetail {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  sessionId?: string;
  userId?: string;
  createdAt?: string;
  // Add other properties as needed
}

export const UserDetailContext = createContext<UserDetail | undefined>(undefined);