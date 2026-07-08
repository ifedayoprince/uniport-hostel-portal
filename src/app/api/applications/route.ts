import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('uniport_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = JSON.parse(sessionCookie);

    let applications;
    if (sessionUser.role === 'ADMIN') {
      applications = await prisma.application.findMany({
        include: {
          student: true,
          hostel: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      applications = await prisma.application.findMany({
        where: { studentId: sessionUser.id },
        include: {
          hostel: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('uniport_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const sessionUser = JSON.parse(sessionCookie);
    const body = await req.json();
    const { hostelId } = body;

    if (!hostelId) {
      return NextResponse.json({ error: 'Hostel ID is required' }, { status: 400 });
    }

    // Double check Student exists
    const student = await prisma.user.findUnique({
      where: { id: sessionUser.id }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found in database' }, { status: 404 });
    }

    // Fetch Hostel to verify restrictions and availability
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId }
    });

    if (!hostel) {
      return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
    }

    // Rule 1: Hostel gender must match student registered gender
    if (hostel.gender !== student.gender) {
      return NextResponse.json({ error: `Gender restriction mismatch. This hostel is for ${hostel.gender.toLowerCase()}s, but your profile is registered as ${student.gender.toLowerCase()}.` }, { status: 400 });
    }

    // Rule 2: Hostel must not be full
    if (hostel.occupied >= hostel.capacity) {
      return NextResponse.json({ error: 'This hostel is fully occupied. No room allocations available.' }, { status: 400 });
    }

    // Rule 3: A student may only have one active application per academic session (PENDING or APPROVED)
    const activeApplications = await prisma.application.findMany({
      where: {
        studentId: student.id,
      }
    });

    const hasActive = activeApplications.some(app => app.status === 'PENDING' || app.status === 'APPROVED');
    if (hasActive) {
      return NextResponse.json({ error: 'You already have an active application. You may only have one active application per academic session.' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        hostelId: hostel.id
      }
    });

    return NextResponse.json({ application, message: 'Hostel application submitted successfully!' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
