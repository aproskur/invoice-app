
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const FALLBACK_EMAILS = [
  process.env.DEFAULT_USER_EMAIL,
  'trigonotarb@am.am',
  'anna@example.com',
].filter(Boolean) as string[];

async function findPreferredUser() {
  for (const email of FALLBACK_EMAILS) {
    const candidate = await prisma.user.findUnique({ where: { email } });
    if (candidate) {
      return candidate;
    }
  }

  return prisma.user.findFirst();
}

export async function GET() {
  const user = await findPreferredUser();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
