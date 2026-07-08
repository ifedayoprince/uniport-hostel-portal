import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { matricNumber, password } = await req.json();
    if (!matricNumber || !password) {
      return NextResponse.json({ error: 'Matric number and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        matricNumber: matricNumber.toUpperCase()
      }
    });

    // Check if user exists and password matches (simple plaintext/direct compare for MVP)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid matric number/credentials or password' }, { status: 401 });
    }

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      matricNumber: user.matricNumber,
      email: user.email,
      phoneNumber: user.phoneNumber,
      campus: user.campus,
      gender: user.gender,
      role: user.role,
      createdAt: user.createdAt
    };

    const response = NextResponse.json({ user: userResponse });
    
    // Simple cookie storage for session validation
    response.cookies.set('uniport_session', JSON.stringify(userResponse), {
      httpOnly: false, // Let client access it for easy syncing
      secure: false,   // Dev-friendly
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
