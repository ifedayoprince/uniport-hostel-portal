import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { fullName, matricNumber, email, phoneNumber, password, campus, gender } = await req.json();

    if (!fullName || !matricNumber || !phoneNumber || !password || !campus || !gender) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate matric number format (e.g. U2021/1000001)
    const matricRegex = /^U\d{4}\/\d{7}$/i;
    if (!matricRegex.test(matricNumber.trim())) {
      return NextResponse.json({ error: 'Invalid Matric Number format. Expected format: UYYYY/XXXXXXX (e.g. U2021/1000001)' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        matricNumber: matricNumber.toUpperCase()
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this Matric Number already exists.' }, { status: 400 });
    }

    // Create student
    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        matricNumber: matricNumber.trim().toUpperCase(),
        email: email ? email.trim() : null,
        phoneNumber: phoneNumber.trim(),
        password: password,
        campus: campus,
        gender: gender,
        role: 'STUDENT'
      }
    });

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

    const response = NextResponse.json({ user: userResponse, message: 'Registration successful!' }, { status: 201 });
    
    // Cookie session
    response.cookies.set('uniport_session', JSON.stringify(userResponse), {
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
