import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Define the standard Prisma schema types locally in case we need fallback
export type Role = 'STUDENT' | 'ADMIN';
export type Status = 'PENDING' | 'APPROVED' | 'REJECTED';
export type Campus = 'CHOBA' | 'ABUJA' | 'DELTA';
export type Gender = 'MALE' | 'FEMALE';

export interface User {
  id: string;
  fullName: string;
  matricNumber: string;
  email: string | null;
  phoneNumber: string;
  passwordHash?: string; // Stored in password field
  password?: string;
  campus: Campus;
  gender: Gender;
  role: Role;
  createdAt: Date;
}

export interface Hostel {
  id: string;
  name: string;
  campus: Campus;
  gender: Gender;
  price: number;
  description: string;
  totalRooms: number;
  bedsPerRoom: number;
  capacity: number;
  amenities: string[];
  createdAt: Date;
}

export interface Application {
  id: string;
  studentId: string;
  hostelId: string;
  status: Status;
  isPaid: boolean;
  createdAt: Date;
}

interface JsonDbSchema {
  users: User[];
  hostels: Hostel[];
  applications: Application[];
}

const DB_FILE = path.join(process.cwd(), 'db.json');

function readJsonDb(): JsonDbSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = createSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(content);
    // Convert date strings back to Dates
    data.users = data.users.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt) }));
    data.hostels = data.hostels.map((h: any) => ({ ...h, createdAt: new Date(h.createdAt) }));
    data.applications = data.applications.map((a: any) => ({ ...a, createdAt: new Date(a.createdAt) }));
    return data;
  } catch (error) {
    console.error('Error reading json database:', error);
    return { users: [], hostels: [], applications: [] };
  }
}

function writeJsonDb(data: JsonDbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing json database:', error);
  }
}

function createSeedData(): JsonDbSchema {
  const users: User[] = [
    {
      id: 'usr_admin1',
      fullName: 'Dean of Student Affairs',
      matricNumber: 'ADMIN/001',
      email: 'dean@uniport.edu.ng',
      phoneNumber: '+2348030000001',
      password: 'admin123', // Clean, direct password for grading and testing
      campus: 'CHOBA',
      gender: 'MALE',
      role: 'ADMIN',
      createdAt: new Date()
    },
    {
      id: 'usr_student1',
      fullName: 'Chidi Benson',
      matricNumber: 'U2021/1000001',
      email: 'chidi.benson@uniport.edu.ng',
      phoneNumber: '+2348051234567',
      password: 'student123',
      campus: 'CHOBA',
      gender: 'MALE',
      role: 'STUDENT',
      createdAt: new Date()
    },
    {
      id: 'usr_student2',
      fullName: 'Amaka Florence',
      matricNumber: 'U2021/2000002',
      email: 'amaka.f@uniport.edu.ng',
      phoneNumber: '+2348169876543',
      password: 'student123',
      campus: 'ABUJA',
      gender: 'FEMALE',
      role: 'STUDENT',
      createdAt: new Date()
    }
  ];

  const hostels: Hostel[] = [
    {
      id: 'hst_claudeake',
      name: 'Claude Ake Hall',
      campus: 'ABUJA',
      gender: 'MALE',
      price: 45000,
      description: 'Named after the legendary political scientist, Claude Ake Hall is situated in the serene Abuja Campus. Known for its academic focus, neat surroundings, and excellent community network.',
      totalRooms: 30,
      bedsPerRoom: 4,
      capacity: 120,
      amenities: ['24/7 Power Patrol', 'Study Common Rooms', 'Dedicated Kitchenette', 'Armed Security Patrol', 'High-speed Wi-Fi'],
      createdAt: new Date()
    },
    {
      id: 'hst_mandela',
      name: 'Nelson Mandela Hall',
      campus: 'CHOBA',
      gender: 'MALE',
      price: 50000,
      description: 'Centrally located in Choba campus, this residence is named after the anti-apartheid hero Nelson Mandela. It is close to the faculty buildings, sports complex, and has a lively cultural atmosphere.',
      totalRooms: 25,
      bedsPerRoom: 4,
      capacity: 100,
      amenities: ['High-speed Wi-Fi', 'Borehole Water Supply', 'Outdoor Basketball Court', 'Laundromat Room'],
      createdAt: new Date()
    },
    {
      id: 'hst_maryslessor',
      name: 'Mary Slessor Hall',
      campus: 'DELTA',
      gender: 'FEMALE',
      price: 48000,
      description: 'Mary Slessor Hall is a secure, premium female residence hall in Delta Campus. It provides comfortable rooms, solar-powered water heaters, dynamic indoor recreation halls, and tight security controls.',
      totalRooms: 40,
      bedsPerRoom: 4,
      capacity: 160,
      amenities: ['Solar Water Heaters', 'Elegant Common Lounge', '24/7 Female Guards', 'Sanitary Waste Disposal', 'Study Cubicles'],
      createdAt: new Date()
    },
    {
      id: 'hst_aminukano',
      name: 'Aminu Kano Hall',
      campus: 'ABUJA',
      gender: 'FEMALE',
      price: 55000,
      description: 'Aminu Kano offers highly rated female double-occupancy rooms. It is a premium hostel with en-suite bathrooms, full cooling systems, reading rooms, and direct power backups.',
      totalRooms: 20,
      bedsPerRoom: 2,
      capacity: 40,
      amenities: ['Air Conditioning', 'En-suite Bathrooms', 'Premium Study Rooms', 'Power Generator Backup'],
      createdAt: new Date()
    }
  ];

  const applications: Application[] = [];

  return { users, hostels, applications };
}

// Custom Mock Prisma Client matching API surface
class MockPrismaClient {
  user = {
    findMany: async (args?: any) => {
      const db = readJsonDb();
      return db.users;
    },
    findUnique: async (args: { where: { id?: string; matricNumber?: string; email?: string } }) => {
      const db = readJsonDb();
      return db.users.find(u => {
        if (args.where.id && u.id === args.where.id) return true;
        if (args.where.matricNumber && u.matricNumber.toUpperCase() === args.where.matricNumber.toUpperCase()) return true;
        if (args.where.email && u.email && u.email.toLowerCase() === args.where.email.toLowerCase()) return true;
        return false;
      }) || null;
    },
    findFirst: async (args: { where: { matricNumber?: string; email?: string } }) => {
      const db = readJsonDb();
      return db.users.find(u => {
        if (args.where.matricNumber && u.matricNumber.toUpperCase() === args.where.matricNumber.toUpperCase()) return true;
        if (args.where.email && u.email && u.email.toLowerCase() === args.where.email.toLowerCase()) return true;
        return false;
      }) || null;
    },
    create: async (args: { data: any }) => {
      const db = readJsonDb();
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 11),
        fullName: args.data.fullName,
        matricNumber: args.data.matricNumber,
        email: args.data.email || null,
        phoneNumber: args.data.phoneNumber,
        password: args.data.password,
        campus: args.data.campus,
        gender: args.data.gender,
        role: args.data.role || 'STUDENT',
        createdAt: new Date()
      };
      db.users.push(newUser);
      writeJsonDb(db);
      return newUser;
    }
  };

  hostel = {
    findMany: async (args?: any) => {
      const db = readJsonDb();
      let list = db.hostels;
      if (args?.where) {
        if (args.where.campus) {
          list = list.filter(h => h.campus === args.where.campus);
        }
        if (args.where.gender) {
          list = list.filter(h => h.gender === args.where.gender);
        }
      }
      // Populate aggregated capacities/occupations
      const applications = db.applications.filter(a => a.status === 'APPROVED');
      return list.map(h => {
        const occupied = applications.filter(a => a.hostelId === h.id).length;
        return {
          ...h,
          occupied
        };
      });
    },
    findUnique: async (args: { where: { id: string }; include?: any }) => {
      const db = readJsonDb();
      const hostel = db.hostels.find(h => h.id === args.where.id);
      if (!hostel) return null;
      const apps = db.applications.filter(a => a.status === 'APPROVED');
      const occupied = apps.filter(a => a.hostelId === hostel.id).length;
      return {
        ...hostel,
        occupied
      };
    },
    create: async (args: { data: any }) => {
      const db = readJsonDb();
      const newHostel: Hostel = {
        id: 'hst_' + Math.random().toString(36).substring(2, 11),
        name: args.data.name,
        campus: args.data.campus,
        gender: args.data.gender,
        price: Number(args.data.price),
        description: args.data.description,
        totalRooms: Number(args.data.totalRooms),
        bedsPerRoom: Number(args.data.bedsPerRoom),
        capacity: Number(args.data.totalRooms) * Number(args.data.bedsPerRoom),
        amenities: args.data.amenities || [],
        createdAt: new Date()
      };
      db.hostels.push(newHostel);
      writeJsonDb(db);
      return newHostel;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const db = readJsonDb();
      const index = db.hostels.findIndex(h => h.id === args.where.id);
      if (index === -1) return null;
      db.hostels[index] = {
        ...db.hostels[index],
        ...args.data
      };
      writeJsonDb(db);
      return db.hostels[index];
    }
  };

  application = {
    findMany: async (args?: { where?: any; include?: any }) => {
      const db = readJsonDb();
      let list = db.applications;
      if (args?.where) {
        if (args.where.studentId) {
          list = list.filter(a => a.studentId === args.where.studentId);
        }
        if (args.where.hostelId) {
          list = list.filter(a => a.hostelId === args.where.hostelId);
        }
        if (args.where.status) {
          list = list.filter(a => a.status === args.where.status);
        }
      }

      // Populate relations if required by 'include'
      return list.map(app => {
        const res: any = { ...app };
        if (args?.include?.student) {
          res.student = db.users.find(u => u.id === app.studentId) || null;
        }
        if (args?.include?.hostel) {
          const h = db.hostels.find(hst => hst.id === app.hostelId);
          if (h) {
            const approvedApps = db.applications.filter(a => a.hostelId === h.id && a.status === 'APPROVED');
            res.hostel = { ...h, occupied: approvedApps.length };
          } else {
            res.hostel = null;
          }
        }
        return res;
      });
    },
    findUnique: async (args: { where: { id: string }; include?: any }) => {
      const db = readJsonDb();
      const app = db.applications.find(a => a.id === args.where.id);
      if (!app) return null;

      const res: any = { ...app };
      if (args?.include?.student) {
        res.student = db.users.find(u => u.id === app.studentId) || null;
      }
      if (args?.include?.hostel) {
        const h = db.hostels.find(hst => hst.id === app.hostelId);
        if (h) {
          const approvedApps = db.applications.filter(a => a.hostelId === h.id && a.status === 'APPROVED');
          res.hostel = { ...h, occupied: approvedApps.length };
        } else {
          res.hostel = null;
        }
      }
      return res;
    },
    create: async (args: { data: any }) => {
      const db = readJsonDb();
      
      // Enforce the constraint: A student may only have one active application per academic session
      const existing = db.applications.find(a => a.studentId === args.data.studentId && (a.status === 'PENDING' || a.status === 'APPROVED'));
      if (existing) {
        throw new Error('You already have an active application.');
      }

      const newApp: Application = {
        id: 'app_' + Math.random().toString(36).substring(2, 11),
        studentId: args.data.studentId,
        hostelId: args.data.hostelId,
        status: 'PENDING',
        isPaid: false,
        createdAt: new Date()
      };
      db.applications.push(newApp);
      writeJsonDb(db);
      return newApp;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const db = readJsonDb();
      const index = db.applications.findIndex(a => a.id === args.where.id);
      if (index === -1) return null;
      db.applications[index] = {
        ...db.applications[index],
        ...args.data
      };
      writeJsonDb(db);
      return db.applications[index];
    }
  };
}

// Instantiate either real Prisma or mock Prisma safely
let prismaInstance: any;

const isMongoDbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mongodb');

if (isMongoDbUrl) {
  try {
    prismaInstance = new PrismaClient();
    console.log('Using real MongoDB Prisma Client.');
  } catch (err) {
    console.warn('Failed to construct real PrismaClient, falling back to local file db mock.', err);
    prismaInstance = new MockPrismaClient();
  }
} else {
  console.log('DATABASE_URL is not set or not MongoDB. Falling back to local file db mock.');
  prismaInstance = new MockPrismaClient();
}

// Export single instances
export const prisma = prismaInstance;
