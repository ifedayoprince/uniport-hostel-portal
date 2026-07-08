import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Clear existing data (safe order: applications first, then users/hostels) ───
  console.log('🗑️  Clearing existing records...');
  await prisma.application.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.user.deleteMany();

  // ─── Seed Users ───────────────────────────────────────────────────────────────
  console.log('👤 Seeding users...');

  const admin = await prisma.user.create({
    data: {
      fullName: 'Dean of Student Affairs',
      matricNumber: 'ADMIN/001',
      email: 'dean@uniport.edu.ng',
      phoneNumber: '+2348030000001',
      password: 'admin123',
      campus: 'CHOBA',
      gender: 'MALE',
      role: 'ADMIN',
    },
  });

  const chidi = await prisma.user.create({
    data: {
      fullName: 'Chidi Benson',
      matricNumber: 'U2021/1000001',
      email: 'chidi.benson@uniport.edu.ng',
      phoneNumber: '+2348051234567',
      password: 'student123',
      campus: 'CHOBA',
      gender: 'MALE',
      role: 'STUDENT',
    },
  });

  const amaka = await prisma.user.create({
    data: {
      fullName: 'Amaka Florence',
      matricNumber: 'U2021/2000002',
      email: 'amaka.f@uniport.edu.ng',
      phoneNumber: '+2348169876543',
      password: 'student123',
      campus: 'ABUJA',
      gender: 'FEMALE',
      role: 'STUDENT',
    },
  });

  const emeka = await prisma.user.create({
    data: {
      fullName: 'Emeka Okafor',
      matricNumber: 'U2022/3000003',
      email: 'emeka.okafor@uniport.edu.ng',
      phoneNumber: '+2348072345678',
      password: 'student123',
      campus: 'DELTA',
      gender: 'MALE',
      role: 'STUDENT',
    },
  });

  const ngozi = await prisma.user.create({
    data: {
      fullName: 'Ngozi Eze',
      matricNumber: 'U2022/4000004',
      email: 'ngozi.eze@uniport.edu.ng',
      phoneNumber: '+2348083456789',
      password: 'student123',
      campus: 'DELTA',
      gender: 'FEMALE',
      role: 'STUDENT',
    },
  });

  console.log(`   ✅ Created 5 users (1 admin, 4 students)`);

  // ─── Seed Hostels ─────────────────────────────────────────────────────────────
  console.log('🏠 Seeding hostels...');

  const claudeAke = await prisma.hostel.create({
    data: {
      name: 'Claude Ake Hall',
      campus: 'ABUJA',
      gender: 'MALE',
      price: 45000,
      description:
        'Named after the legendary political scientist, Claude Ake Hall is situated in the serene Abuja Campus. Known for its academic focus, neat surroundings, and excellent community network.',
      totalRooms: 30,
      bedsPerRoom: 4,
      capacity: 120,
      amenities: [
        '24/7 Power Patrol',
        'Study Common Rooms',
        'Dedicated Kitchenette',
        'Armed Security Patrol',
        'High-speed Wi-Fi',
      ],
    },
  });

  const mandela = await prisma.hostel.create({
    data: {
      name: 'Nelson Mandela Hall',
      campus: 'CHOBA',
      gender: 'MALE',
      price: 50000,
      description:
        'Centrally located in Choba campus, this residence is named after the anti-apartheid hero Nelson Mandela. It is close to the faculty buildings, sports complex, and has a lively cultural atmosphere.',
      totalRooms: 25,
      bedsPerRoom: 4,
      capacity: 100,
      amenities: [
        'High-speed Wi-Fi',
        'Borehole Water Supply',
        'Outdoor Basketball Court',
        'Laundromat Room',
      ],
    },
  });

  const marySlessor = await prisma.hostel.create({
    data: {
      name: 'Mary Slessor Hall',
      campus: 'DELTA',
      gender: 'FEMALE',
      price: 48000,
      description:
        'Mary Slessor Hall is a secure, premium female residence hall in Delta Campus. It provides comfortable rooms, solar-powered water heaters, dynamic indoor recreation halls, and tight security controls.',
      totalRooms: 40,
      bedsPerRoom: 4,
      capacity: 160,
      amenities: [
        'Solar Water Heaters',
        'Elegant Common Lounge',
        '24/7 Female Guards',
        'Sanitary Waste Disposal',
        'Study Cubicles',
      ],
    },
  });

  const aminuKano = await prisma.hostel.create({
    data: {
      name: 'Aminu Kano Hall',
      campus: 'ABUJA',
      gender: 'FEMALE',
      price: 55000,
      description:
        'Aminu Kano offers highly rated female double-occupancy rooms. It is a premium hostel with en-suite bathrooms, full cooling systems, reading rooms, and direct power backups.',
      totalRooms: 20,
      bedsPerRoom: 2,
      capacity: 40,
      amenities: [
        'Air Conditioning',
        'En-suite Bathrooms',
        'Premium Study Rooms',
        'Power Generator Backup',
      ],
    },
  });

  const independenceHall = await prisma.hostel.create({
    data: {
      name: 'Independence Hall',
      campus: 'CHOBA',
      gender: 'FEMALE',
      price: 42000,
      description:
        'Independence Hall is a well-established female hostel at the Choba campus, celebrated for its communal spirit and affordable pricing. Offers spacious rooms and a secure living environment.',
      totalRooms: 35,
      bedsPerRoom: 4,
      capacity: 140,
      amenities: [
        'Borehole Water Supply',
        'Common Kitchen',
        'CCTV Surveillance',
        'Recreational Hall',
      ],
    },
  });

  const deltaAnnex = await prisma.hostel.create({
    data: {
      name: 'Delta Annex Hall',
      campus: 'DELTA',
      gender: 'MALE',
      price: 38000,
      description:
        'Delta Annex Hall serves the male student population at the Delta Campus. It is an affordable, well-structured hostel with adequate facilities for student life.',
      totalRooms: 28,
      bedsPerRoom: 6,
      capacity: 168,
      amenities: [
        'Borehole Water Supply',
        'Security Patrol',
        'Common Study Hall',
        'Outdoor Sports Area',
      ],
    },
  });

  console.log(`   ✅ Created 6 hostels across all 3 campuses`);

  // ─── Seed Sample Applications ─────────────────────────────────────────────────
  console.log('📋 Seeding sample applications...');

  await prisma.application.create({
    data: {
      studentId: chidi.id,
      hostelId: mandela.id,
      status: 'APPROVED',
      isPaid: true,
    },
  });

  await prisma.application.create({
    data: {
      studentId: amaka.id,
      hostelId: aminuKano.id,
      status: 'PENDING',
      isPaid: false,
    },
  });

  await prisma.application.create({
    data: {
      studentId: ngozi.id,
      hostelId: marySlessor.id,
      status: 'APPROVED',
      isPaid: true,
    },
  });

  await prisma.application.create({
    data: {
      studentId: emeka.id,
      hostelId: deltaAnnex.id,
      status: 'REJECTED',
      isPaid: false,
    },
  });

  console.log(`   ✅ Created 4 sample applications`);

  // ─── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n✨ Seeding complete!\n');
  console.log('─────────────────────────────────────────────');
  console.log('  🔑 Admin credentials:');
  console.log('     Matric / ID : ADMIN/001');
  console.log('     Password    : admin123');
  console.log('');
  console.log('  🎓 Student credentials (all use password: student123)');
  console.log('     Matric IDs  : U2021/1000001, U2021/2000002,');
  console.log('                   U2022/3000003, U2022/4000004');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
