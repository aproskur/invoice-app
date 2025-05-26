import Image from 'next/image';

export default async function UserAvatar() {
  const res = await fetch('http://localhost:3000/api/user', {
    cache: 'no-store',
  });
  const user = await res.json();

  if (!user || user.error) return null;

  return (
    <div className="relative w-16 h-16 md:w-full md:h-20 border-l md:border-l-0 md:border-t border-gray-400 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 z-10">
        <Image
          src={user.photoUrl ?? '/default-avatar.jpg'}
          alt="User avatar"
          width={60}
          height={60}
          className="object-cover"
        />
      </div>
    </div>
  );
}
