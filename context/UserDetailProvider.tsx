'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext, UserDetail } from './UserDeatailContext';

interface UserDetailProviderProps {
  children: ReactNode;
}

export function UserDetailProvider({ children }: UserDetailProviderProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState<UserDetail | undefined>(undefined);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserDetail({
        id: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.primaryEmailAddress?.emailAddress,
        profileImageUrl: user.imageUrl,
        sessionId: '', // You can set this based on your application logic
        userId: user.id,
        createdAt: new Date().toISOString(),
      });
    } else if (isLoaded && !isSignedIn) {
      setUserDetail(undefined);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <UserDetailContext.Provider value={userDetail}>
      {children}
    </UserDetailContext.Provider>
  );
}