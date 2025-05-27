'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function UserAvatar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
        }
      });
  }, []);

  if (!user) return null;




  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 z-10">
      <img
        src={user.photoUrl ?? '/default-avatar.jpg'}
        alt="User avatar"
        width={60}
        height={60}
        className="object-cover"
      />
    </div>
  );
}
