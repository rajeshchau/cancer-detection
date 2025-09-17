'use client';

import { useContext } from 'react';
import { UserDetailContext, UserDetail } from './UserDeatailContext';

export function useUserDetail(): UserDetail | undefined {
  const context = useContext(UserDetailContext);
  
  if (context === undefined) {
    console.warn('useUserDetail must be used within a UserDetailProvider');
  }
  
  return context;
}