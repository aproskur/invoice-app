
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { email: 'trigonotarb@am.am' }, 
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
