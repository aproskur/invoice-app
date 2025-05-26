
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { email: 'trigonotarb@am.am' }, 
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
