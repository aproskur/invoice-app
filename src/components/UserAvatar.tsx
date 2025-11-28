'use client';

import { useEffect, useState } from 'react';

type UserProfile = {
  name?: string | null;
  email?: string | null;
  photoUrl?: string | null;
};

export default function UserAvatar() {
  const [user, setUser] = useState<UserProfile | null>(null);



  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to load user');
        const data = await res.json();
        if (!data?.error && active) {
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to load user avatar:', error);
        if (active) {
          setUser({ photoUrl: null });
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const avatarSrc =
    typeof user?.photoUrl === 'string' && user.photoUrl.trim().length > 0
      ? user.photoUrl
      : '/assets/trigonotarb.webp';

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 z-10">
      <img
        src={avatarSrc}
        alt={user?.name ? `${user.name} avatar` : 'User avatar'}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
