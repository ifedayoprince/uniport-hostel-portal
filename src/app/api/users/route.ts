import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Admin-only route — check session cookie
    const sessionCookie = req.cookies.get('uniport_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const sessionUser = JSON.parse(sessionCookie);
    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role   = searchParams.get('role');
    const campus = searchParams.get('campus');
    const gender = searchParams.get('gender');

    const filter: any = {};
    if (role   && role   !== 'ALL') filter.role   = role;
    if (campus && campus !== 'ALL') filter.campus = campus;
    if (gender && gender !== 'ALL') filter.gender = gender;

    const users = await prisma.user.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      select: {
        id:           true,
        fullName:     true,
        matricNumber: true,
        email:        true,
        phoneNumber:  true,
        campus:       true,
        gender:       true,
        role:         true,
        createdAt:    true,
        _count: { select: { applications: true } }
      }
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
