import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = req.cookies.get('uniport_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const sessionUser = JSON.parse(sessionCookie);
    const { id } = await params;

    const body = await req.json();
    const { status, pay } = body;

    // Fetch existing application
    const app = await prisma.application.findUnique({
      where: { id },
      include: { hostel: true }
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (pay) {
      // Student is paying
      if (app.studentId !== sessionUser.id && sessionUser.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden: You can only pay for your own applications' }, { status: 403 });
      }

      const updated = await prisma.application.update({
        where: { id },
        data: { isPaid: true }
      });

      return NextResponse.json({ application: updated, message: 'Payment simulated successfully!' });
    }

    // Otherwise, this is an Admin status update (Approve/Reject)
    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    if (!status || (status !== 'APPROVED' && status !== 'REJECTED')) {
      return NextResponse.json({ error: 'Invalid status update request' }, { status: 400 });
    }

    // Check if the status is changing to APPROVED
    if (status === 'APPROVED' && app.status !== 'APPROVED') {
      // Check capacity of the hostel before approval
      if (app.hostel.occupied >= app.hostel.capacity) {
        return NextResponse.json({ error: 'Cannot approve. Hostel has reached full capacity!' }, { status: 400 });
      }
    }

    // Update status in db
    const updated = await prisma.application.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ application: updated, message: `Application ${status.toLowerCase()} successfully!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
