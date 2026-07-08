import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campus = searchParams.get('campus');
    const gender = searchParams.get('gender');

    const filter: any = {};
    if (campus && campus !== 'ALL') {
      filter.campus = campus;
    }
    if (gender && gender !== 'ALL') {
      filter.gender = gender;
    }

    const hostels = await prisma.hostel.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ hostels });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch hostels' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Basic verification of Admin session from cookies (MVP check)
    const sessionCookie = req.cookies.get('uniport_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const sessionUser = JSON.parse(sessionCookie);
    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await req.json();
    const { name, campus, gender, price, description, totalRooms, bedsPerRoom, amenities } = body;

    if (!name || !campus || !gender || !price || !description || !totalRooms || !bedsPerRoom) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const parsedTotalRooms = parseInt(totalRooms);
    const parsedBedsPerRoom = parseInt(bedsPerRoom);
    const capacity = parsedTotalRooms * parsedBedsPerRoom;

    const hostel = await prisma.hostel.create({
      data: {
        name: name.trim(),
        campus,
        gender,
        price: parseFloat(price),
        description: description.trim(),
        totalRooms: parsedTotalRooms,
        bedsPerRoom: parsedBedsPerRoom,
        capacity,
        amenities: amenities || []
      }
    });

    return NextResponse.json({ hostel, message: 'Hostel published successfully!' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
