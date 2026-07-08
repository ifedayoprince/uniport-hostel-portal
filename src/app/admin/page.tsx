'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check, X, ClipboardList, PlusCircle, LogOut, Search, MapPin,
  HelpCircle, ShieldAlert, CheckCircle, Plus, SlidersHorizontal,
  Calendar, Upload, BookOpen,
  Settings, Building2, Users, BedDouble, DollarSign, Filter,
  UserRound, GraduationCap, Phone, Mail, ShieldCheck
} from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  matricNumber: string;
  email: string | null;
  phoneNumber: string;
  campus: string;
  gender: string;
  role: string;
}

interface Hostel {
  id: string;
  name: string;
  campus: string;
  gender: string;
  price: number;
  description: string;
  totalRooms: number;
  bedsPerRoom: number;
  capacity: number;
  occupied: number;
  amenities: string[];
}

interface Application {
  id: string;
  studentId: string;
  hostelId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isPaid: boolean;
  createdAt: string;
  student?: User;
  hostel?: Hostel;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'create-hostel' | 'view-hostels' | 'view-users'>('applications');
  const [hostelSearch, setHostelSearch] = useState('');
  const [hostelCampusFilter, setHostelCampusFilter] = useState('ALL');
  const [hostelGenderFilter, setHostelGenderFilter] = useState('ALL');

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userCampusFilter, setUserCampusFilter] = useState('ALL');
  const [userGenderFilter, setUserGenderFilter] = useState('ALL');

  // Database lists
  const [applications, setApplications] = useState<Application[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);

  // Form states for new hostel
  const [hostelName, setHostelName] = useState('');
  const [campus, setCampus] = useState('ABUJA');
  const [gender, setGender] = useState('MALE');
  const [price, setPrice] = useState('45000');
  const [description, setDescription] = useState('');
  const [totalRooms, setTotalRooms] = useState('100');
  const [bedsPerRoom, setBedsPerRoom] = useState('4');
  const [amenityInput, setAmenityInput] = useState('');
  const [amenitiesList, setAmenitiesList] = useState<string[]>(['24/7 Power', 'Water Supply', 'Reading Room']);

  // Async states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Authenticate Admin
  useEffect(() => {
    const rawUser = localStorage.getItem('uniport_user');
    if (!rawUser) {
      router.push('/login');
      return;
    }
    const sessionUser = JSON.parse(rawUser);
    if (sessionUser.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    setAdminUser(sessionUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const appRes = await fetch('/api/applications');
      const appData = await appRes.json();
      if (appData.applications) {
        setApplications(appData.applications);
      }

      const hstRes = await fetch('/api/hostels');
      const hstData = await hstRes.json();
      if (hstData.hostels) {
        setHostels(hstData.hostels);
      }

      const usrRes = await fetch('/api/users');
      const usrData = await usrRes.json();
      if (usrData.users) {
        setUsers(usrData.users);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: 'APPROVED' | 'REJECTED') => {
    setMessage(null);
    setActionLoading(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setMessage({ type: 'success', text: `Application successfully ${status.toLowerCase()}!` });
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!hostelName || !description || !totalRooms || !bedsPerRoom || !price) {
      setMessage({ type: 'error', text: 'All required fields must be filled.' });
      return;
    }

    setActionLoading(true);

    try {
      const res = await fetch('/api/hostels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hostelName,
          campus,
          gender,
          price: parseFloat(price),
          description,
          totalRooms: parseInt(totalRooms),
          bedsPerRoom: parseInt(bedsPerRoom),
          amenities: amenitiesList
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish hostel');
      }

      setMessage({ type: 'success', text: 'Hostel successfully published!' });

      // Reset form
      setHostelName('');
      setDescription('');
      setPrice('45000');
      setTotalRooms('100');
      setBedsPerRoom('4');
      setAmenitiesList(['24/7 Power', 'Water Supply', 'Reading Room']);

      setActiveTab('applications');
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const addAmenityTag = () => {
    if (amenityInput.trim() && !amenitiesList.includes(amenityInput.trim())) {
      setAmenitiesList([...amenitiesList, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const removeAmenityTag = (tag: string) => {
    setAmenitiesList(amenitiesList.filter(t => t !== tag));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('uniport_user');
    router.push('/');
  };

  // Get department based on matric number
  const getDept = (matric: string) => {
    const last = matric.charAt(matric.length - 1);
    if (last === '1' || last === '5') return 'Computer Science';
    if (last === '2' || last === '6') return 'Mechanical Eng.';
    if (last === '3' || last === '7') return 'Medicine';
    if (last === '4' || last === '8') return 'Accounting';
    return 'Economics';
  };

  // Get initials for profile badge
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format ID to look exactly like the screenshot
  const formatAppId = (id: string, date: string) => {
    const year = new Date(date).getFullYear();
    const shortId = id.slice(-3).toUpperCase();
    return `APP-${year}-${shortId}`;
  };

  // Live metrics calculations
  const totalAppsCount = applications.length;
  const pendingAppsCount = applications.filter(a => a.status === 'PENDING').length;
  const approvedAppsCount = applications.filter(a => a.status === 'APPROVED').length;
  const totalCapacity = hostels.reduce((sum, h) => sum + (h.capacity ?? 0), 0);
  const totalOccupied = hostels.reduce((sum, h) => sum + (h.occupied ?? 0), 0);
  const capacityFilledPercentage = totalCapacity > 0 && !isNaN(totalOccupied) ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const computedCapacity = (parseInt(totalRooms) || 0) * (parseInt(bedsPerRoom) || 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans">

      {/* ─── CONSISTENT SIDEBAR LAYOUT (MATCHES STUDENT LAYOUT) ─── */}
      <aside className="w-64 bg-[#f8fafc] border-r border-slate-200/80 p-6 flex flex-col shrink-0">
        <div className="mb-8 pt-4">
          <span className="font-semibold text-[#0a2540] text-xl tracking-tight block">UNIPORT Portal</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block -mt-0.5">Admin Access</span>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex flex-col space-y-1">
          <button
            onClick={() => { }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 justify-start transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('view-users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold justify-start transition-all ${activeTab === 'view-users'
                ? 'bg-[#e2e8f0] text-[#0a2540] border-l-4 border-[#0a2540] pl-3'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <UserRound className="w-4 h-4" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold justify-start transition-all ${activeTab === 'applications'
                ? 'bg-[#e2e8f0] text-[#0a2540] border-l-4 border-[#0a2540] pl-3'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <ClipboardList className="w-4 h-4" />
            Applications
          </button>

          <button
            onClick={() => setActiveTab('view-hostels')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold justify-start transition-all ${activeTab === 'view-hostels'
                ? 'bg-[#e2e8f0] text-[#0a2540] border-l-4 border-[#0a2540] pl-3'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <Building2 className="w-4 h-4" />
            Hostels
          </button>

          <button
            onClick={() => { }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 justify-start transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('create-hostel')}
          className="bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-3.5 px-4 rounded-md mt-6 flex items-center justify-center gap-2 w-full transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          New Hostel Entry
        </button>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-slate-200/60 flex flex-col space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all pl-1.5"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 p-10 pl-14 space-y-8 max-w-7xl overflow-y-auto">

        {/* REVIEW APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#0a2540] tracking-tight">Review Applications</h1>
                <p className="text-slate-500 text-sm font-semibold">
                  Manage and process student hostel accommodation requests for the 2023/2024 academic session.
                </p>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-md px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-600 shadow-2xs self-start sm:self-auto">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Session: 2023/24</span>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1: Total Applications (Solid Navy) */}
              <div className="bg-[#0c2340] rounded-md p-6 text-white flex flex-col justify-between h-32 shadow-xs">
                <span className="text-[10px] font-semibold text-blue-200/70 uppercase tracking-wider block">Total Applications</span>
                <p className="text-3xl font-semibold">{totalAppsCount.toLocaleString()}</p>
                <span className="text-[10px] text-blue-200/90 font-semibold flex items-center gap-1">
                  <span>+12% from last week</span>
                </span>
              </div>

              {/* Card 2: Pending Review */}
              <div className="bg-white border border-slate-200 rounded-md p-6 flex flex-col justify-between h-32 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Pending Review</span>
                <p className="text-3xl font-semibold text-slate-800">{pendingAppsCount.toLocaleString()}</p>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${totalAppsCount > 0 ? Math.round((pendingAppsCount / totalAppsCount) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {totalAppsCount > 0 ? Math.round((pendingAppsCount / totalAppsCount) * 100) : 0}% of total applications
                  </span>
                </div>
              </div>

              {/* Card 3: Allocated Spaces */}
              <div className="bg-white border border-slate-200 rounded-md p-6 flex flex-col justify-between h-32 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Allocated Spaces</span>
                <p className="text-3xl font-semibold text-slate-800">{approvedAppsCount.toLocaleString()}</p>
                <span className="text-[10px] text-[#065f46] bg-[#d1fae5] px-2 py-0.5 rounded-full font-semibold self-start flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{capacityFilledPercentage}% Capacity filled</span>
                </span>
              </div>

            </div>

            {/* Applications Table Card */}
            <div className="bg-white border border-slate-200 rounded-md shadow-xs">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-base font-semibold text-[#0a2540]">Recent Applications</h3>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or matric..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-hidden focus:border-slate-400 w-full text-slate-800 font-semibold"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    Filter List
                  </button>
                </div>
              </div>

              {/* Table rendering dynamic data */}
              {applications.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-semibold text-slate-800 text-sm">No applications to process</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Incoming student applications will be displayed here for your verification and approval.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/50">
                        <th className="p-4 pl-6">Student Name</th>
                        <th className="p-4">Matric Number</th>
                        <th className="p-4">Hostel Choice</th>
                        <th className="p-4">Date Applied</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {applications
                        .filter(app => {
                          if (searchQuery) {
                            const q = searchQuery.toLowerCase();
                            return app.student?.fullName.toLowerCase().includes(q) ||
                              app.student?.matricNumber.toLowerCase().includes(q);
                          }
                          return true;
                        })
                        .map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50">

                            {/* Student Name column */}
                            <td className="p-4 pl-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-[#eef2f7] text-[#0a2540] flex items-center justify-center font-semibold text-[10px] shrink-0">
                                  {getInitials(app.student?.fullName || 'ST')}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{app.student?.fullName || 'Unknown student'}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{getDept(app.student?.matricNumber || '')}</p>
                                </div>
                              </div>
                            </td>

                            {/* Matric Number column */}
                            <td className="p-4 text-slate-600 font-semibold">{app.student?.matricNumber}</td>

                            {/* Hostel Choice column */}
                            <td className="p-4 text-slate-800 font-semibold">{app.hostel?.name}</td>

                            {/* Date Applied column */}
                            <td className="p-4 text-slate-600 font-semibold">
                              {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </td>

                            {/* Status column */}
                            <td className="p-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide ${app.status === 'APPROVED'
                                  ? 'bg-[#d1fae5] text-[#065f46]'
                                  : app.status === 'PENDING'
                                    ? 'bg-[#fef3c7] text-[#92400e]'
                                    : 'bg-[#fee2e2] text-[#991b1b]'
                                }`}>
                                {app.status === 'APPROVED' ? 'APPROVED' : app.status === 'PENDING' ? 'PENDING' : 'REJECTED'}
                              </span>
                            </td>

                            {/* Actions column */}
                            <td className="p-4 pr-6 text-right">
                              {app.status === 'PENDING' ? (
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                    disabled={actionLoading}
                                    title="Approve"
                                    className="p-1 text-[#065f46] hover:bg-emerald-50 rounded-full transition-all cursor-pointer border border-[#d1fae5]"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                    disabled={actionLoading}
                                    title="Reject"
                                    className="p-1 text-[#991b1b] hover:bg-rose-50 rounded-full transition-all cursor-pointer border border-[#fee2e2]"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-semibold text-[10px]">PROCESSED</span>
                              )}
                            </td>

                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Pagination Footer */}
              <div className="p-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-400">
                <span>Showing 1 to {applications.length} of {applications.length} applications</span>

                <div className="flex items-center space-x-1">
                  <button className="p-1 border border-slate-200 rounded-md text-slate-300 hover:bg-slate-50 disabled:opacity-40" disabled>&lt;</button>
                  <button className="w-7 h-7 bg-[#0a2540] text-white rounded-md flex items-center justify-center font-semibold text-xs">1</button>
                  <button className="p-1 border border-slate-200 rounded-md text-slate-300 hover:bg-slate-50 disabled:opacity-40" disabled>&gt;</button>
                </div>
              </div>
            </div>

            {/* Bottom Support/Policy Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">

              <div className="bg-[#f4f6fa] border border-slate-200/60 rounded-md p-5 max-w-xl shadow-2xs">
                <h4 className="text-xs font-semibold text-[#0a2540] mb-1">Allocation Policy v2.4</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  Current allocation priority is given to final-year students and freshers. Maintenance checks are ongoing for Aminu Kano Hall Wing B.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Live: Portal Processing Stable
                </span>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW USERS TAB */}
        {activeTab === 'view-users' && (() => {
          const campusLabel: Record<string, string> = { ABUJA: 'Abuja', CHOBA: 'Choba', DELTA: 'Delta' };

          const filteredUsers = users.filter(u => {
            const q = userSearch.toLowerCase();
            const matchSearch = userSearch
              ? u.fullName?.toLowerCase().includes(q) ||
              u.matricNumber?.toLowerCase().includes(q) ||
              u.email?.toLowerCase().includes(q)
              : true;
            const matchRole = userRoleFilter !== 'ALL' ? u.role === userRoleFilter : true;
            const matchCampus = userCampusFilter !== 'ALL' ? u.campus === userCampusFilter : true;
            const matchGender = userGenderFilter !== 'ALL' ? u.gender === userGenderFilter : true;
            return matchSearch && matchRole && matchCampus && matchGender;
          });

          const studentCount = users.filter(u => u.role === 'STUDENT').length;
          const adminCount = users.filter(u => u.role === 'ADMIN').length;
          const maleCount = users.filter(u => u.gender === 'MALE').length;
          const femaleCount = users.filter(u => u.gender === 'FEMALE').length;

          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold text-[#0a2540] tracking-tight">All Users</h1>
                  <p className="text-slate-500 text-sm font-semibold">
                    Complete registry of all registered students and administrators on the portal.
                  </p>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-md px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-600 shadow-2xs self-start sm:self-auto">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Session: 2023/24</span>
                </div>
              </div>

              {/* KPI strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0c2340] rounded-md p-5 text-white flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-blue-200/70 uppercase tracking-wider">Total Users</span>
                  <p className="text-3xl font-semibold">{users.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Students</span>
                  <p className="text-3xl font-semibold text-slate-800">{studentCount}</p>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    {users.length > 0 ? Math.round((studentCount / users.length) * 100) : 0}% of total
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Male</span>
                  <p className="text-3xl font-semibold text-slate-800">{maleCount}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Female</span>
                  <p className="text-3xl font-semibold text-slate-800">{femaleCount}</p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs flex-wrap">
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, matric or email..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-hidden focus:border-slate-400 w-full text-slate-800 font-semibold"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-700"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <select
                    value={userCampusFilter}
                    onChange={e => setUserCampusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-700"
                  >
                    <option value="ALL">All Campuses</option>
                    <option value="ABUJA">Abuja</option>
                    <option value="CHOBA">Choba</option>
                    <option value="DELTA">Delta</option>
                  </select>
                  <select
                    value={userGenderFilter}
                    onChange={e => setUserGenderFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-700"
                  >
                    <option value="ALL">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <span className="ml-auto text-[11px] font-semibold text-slate-400 shrink-0">
                  {filteredUsers.length} of {users.length} users
                </span>
              </div>

              {/* Users Table */}
              <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-14 text-center space-y-3">
                    <UserRound className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="font-semibold text-slate-800 text-sm">No users found</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      {users.length === 0
                        ? 'No users have registered on the portal yet.'
                        : 'No users match your current search or filter criteria.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/50">
                            <th className="p-4 pl-6">User</th>
                            <th className="p-4">Matric No.</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Campus</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Applications</th>
                            <th className="p-4 pr-6">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredUsers.map(user => {
                            const appCount = user._count?.applications ?? 0;
                            const initials = (() => {
                              const parts = (user.fullName || '').split(' ');
                              return parts.length >= 2
                                ? (parts[0][0] + parts[1][0]).toUpperCase()
                                : (user.fullName || 'U').slice(0, 2).toUpperCase();
                            })();

                            return (
                              <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">

                                {/* User column */}
                                <td className="p-4 pl-6">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 ${user.role === 'ADMIN'
                                          ? 'bg-amber-100 text-amber-700'
                                          : user.gender === 'FEMALE'
                                            ? 'bg-rose-50 text-rose-600'
                                            : 'bg-[#eef2f7] text-[#0a2540]'
                                        }`}
                                    >
                                      {initials}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-slate-800">{user.fullName}</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">
                                        {user.gender === 'MALE' ? '♂ Male' : '♀ Female'}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Matric */}
                                <td className="p-4">
                                  <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                                    {user.matricNumber || '—'}
                                  </span>
                                </td>

                                {/* Contact */}
                                <td className="p-4">
                                  <div className="space-y-1">
                                    {user.email && (
                                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <span className="truncate max-w-[140px]">{user.email}</span>
                                      </div>
                                    )}
                                    {user.phoneNumber && (
                                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        <span>{user.phoneNumber}</span>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Campus */}
                                <td className="p-4">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600">
                                      {campusLabel[user.campus] ?? user.campus}
                                    </span>
                                  </div>
                                </td>

                                {/* Role */}
                                <td className="p-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-[#eef2f7] text-[#0a2540]'
                                      }`}
                                  >
                                    {user.role === 'ADMIN'
                                      ? <ShieldCheck className="w-3 h-3" />
                                      : <GraduationCap className="w-3 h-3" />}
                                    {user.role}
                                  </span>
                                </td>

                                {/* Application count */}
                                <td className="p-4">
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold ${appCount > 0
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'bg-slate-100 text-slate-400'
                                      }`}
                                  >
                                    {appCount} {appCount === 1 ? 'application' : 'applications'}
                                  </span>
                                </td>

                                {/* Joined date */}
                                <td className="p-4 pr-6 text-slate-500 font-semibold text-[11px] whitespace-nowrap">
                                  {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                      month: 'short', day: '2-digit', year: 'numeric'
                                    })
                                    : '—'}
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Table footer */}
                    <div className="p-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <span>Showing {filteredUsers.length} of {users.length} users</span>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 border border-slate-200 rounded-md text-slate-300 hover:bg-slate-50 disabled:opacity-40" disabled>&lt;</button>
                        <button className="w-7 h-7 bg-[#0a2540] text-white rounded-md flex items-center justify-center font-semibold text-xs">1</button>
                        <button className="p-1 border border-slate-200 rounded-md text-slate-300 hover:bg-slate-50 disabled:opacity-40" disabled>&gt;</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* VIEW HOSTELS TAB */}
        {activeTab === 'view-hostels' && (() => {
          const filteredHostels = hostels.filter(h => {
            const matchSearch = hostelSearch
              ? h.name.toLowerCase().includes(hostelSearch.toLowerCase())
              : true;
            const matchCampus = hostelCampusFilter !== 'ALL' ? h.campus === hostelCampusFilter : true;
            const matchGender = hostelGenderFilter !== 'ALL' ? h.gender === hostelGenderFilter : true;
            return matchSearch && matchCampus && matchGender;
          });

          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold text-[#0a2540] tracking-tight">Hostel Directory</h1>
                  <p className="text-slate-500 text-sm font-semibold">
                    Overview of all published hostel accommodations across all campuses.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('create-hostel')}
                  className="bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-3 px-5 rounded-md flex items-center gap-2 transition-all shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add New Hostel
                </button>
              </div>

              {/* Summary KPI strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0c2340] rounded-md p-5 text-white flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-blue-200/70 uppercase tracking-wider">Total Hostels</span>
                  <p className="text-3xl font-semibold">{hostels.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Capacity</span>
                  <p className="text-3xl font-semibold text-slate-800">{totalCapacity.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Occupied Beds</span>
                  <p className="text-3xl font-semibold text-slate-800">{totalOccupied.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-1 shadow-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Occupancy Rate</span>
                  <p className="text-3xl font-semibold text-indigo-600">{capacityFilledPercentage}%</p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs">
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search hostel name..."
                    value={hostelSearch}
                    onChange={e => setHostelSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-hidden focus:border-slate-400 w-full text-slate-800 font-semibold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={hostelCampusFilter}
                    onChange={e => setHostelCampusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-700"
                  >
                    <option value="ALL">All Campuses</option>
                    <option value="ABUJA">Abuja</option>
                    <option value="CHOBA">Choba</option>
                    <option value="DELTA">Delta</option>
                  </select>
                  <select
                    value={hostelGenderFilter}
                    onChange={e => setHostelGenderFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-700"
                  >
                    <option value="ALL">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <span className="ml-auto text-[11px] font-semibold text-slate-400">
                  {filteredHostels.length} of {hostels.length} hostels
                </span>
              </div>

              {/* Hostel Grid */}
              {filteredHostels.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-md p-14 text-center space-y-3 shadow-xs">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-semibold text-slate-800 text-sm">No hostels found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {hostels.length === 0
                      ? 'No hostels have been published yet. Click "Add New Hostel" to get started.'
                      : 'No hostels match your current search or filter criteria.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredHostels.map((hostel) => {
                    const occ = hostel.occupied ?? 0;
                    const cap = hostel.capacity ?? 0;
                    const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;
                    const available = cap - occ;
                    const isFull = available <= 0;
                    const campusLabel: Record<string, string> = { ABUJA: 'Abuja', CHOBA: 'Choba', DELTA: 'Delta' };

                    return (
                      <div
                        key={hostel.id}
                        className="bg-white border border-slate-200 rounded-md shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
                      >
                        {/* Card color accent bar */}
                        <div
                          className={`h-1 w-full ${hostel.gender === 'MALE' ? 'bg-blue-500' : 'bg-rose-400'
                            }`}
                        />

                        <div className="p-5 flex flex-col gap-4 flex-1">
                          {/* Top row: Name + badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-[#0a2540] leading-tight">{hostel.name}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {campusLabel[hostel.campus] ?? hostel.campus} Campus
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span
                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${hostel.gender === 'MALE'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-rose-50 text-rose-600'
                                  }`}
                              >
                                {hostel.gender === 'MALE' ? '♂ Male' : '♀ Female'}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${isFull
                                    ? 'bg-rose-50 text-rose-600'
                                    : pct >= 80
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-emerald-50 text-emerald-700'
                                  }`}
                              >
                                {isFull ? 'Full' : pct >= 80 ? 'Almost Full' : 'Available'}
                              </span>
                            </div>
                          </div>

                          {/* Occupancy bar */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                              <span>Occupancy</span>
                              <span>{occ} / {cap} beds</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isFull
                                    ? 'bg-rose-400'
                                    : pct >= 80
                                      ? 'bg-amber-400'
                                      : 'bg-emerald-400'
                                  }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">{pct}% filled · {available} beds available</span>
                          </div>

                          {/* Stats strip */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-50 border border-slate-100 rounded-md p-2.5 flex flex-col items-center gap-0.5">
                              <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-800">{hostel.totalRooms ?? '—'}</span>
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Rooms</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded-md p-2.5 flex flex-col items-center gap-0.5">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-800">{hostel.bedsPerRoom ?? '—'}</span>
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Beds/Rm</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded-md p-2.5 flex flex-col items-center gap-0.5">
                              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-800">₦{(hostel.price ?? 0).toLocaleString()}</span>
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Session</span>
                            </div>
                          </div>

                          {/* Amenities tags */}
                          {hostel.amenities && hostel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {hostel.amenities.slice(0, 4).map(a => (
                                <span
                                  key={a}
                                  className="inline-block text-[10px] font-semibold bg-[#eef2f7] text-[#0a2540] px-2.5 py-1 rounded-full"
                                >
                                  {a}
                                </span>
                              ))}
                              {hostel.amenities.length > 4 && (
                                <span className="inline-block text-[10px] font-semibold text-slate-400 px-2 py-1">
                                  +{hostel.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Description preview */}
                          {hostel.description && (
                            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed line-clamp-2 border-t border-slate-100 pt-3">
                              {hostel.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* CREATE HOSTEL ENTRY TAB */}
        {activeTab === 'create-hostel' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#0a2540] tracking-tight">Create New Hostel Entry</h1>
                <p className="text-slate-500 text-sm font-semibold">
                  Configure hostel details for the 2026/2027 Academic Session allocation cycle.
                </p>
              </div>

              <div className="bg-[#ffedd5] border border-orange-200 rounded-md px-4 py-2 flex items-center gap-2 text-xs font-semibold text-[#c2410c] shadow-2xs self-start sm:self-auto">
                <Calendar className="w-4 h-4 text-[#c2410c]" />
                <span>Session: 2026/2027</span>
              </div>
            </div>

            {/* Error or Success Alert */}
            {message && (
              <div className={`p-4 rounded-md text-xs flex items-start gap-2.5 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}>
                <p className="font-semibold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handlePublishHostel} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left Column (General info + Amenities) (8 cols) */}
              <div className="lg:col-span-8 space-y-6">

                {/* General Information Card */}
                <div className="bg-white border border-slate-200 rounded-md p-6 space-y-5 shadow-2xs">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">General Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Hostel Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Tetfund Hall Phase II"
                        value={hostelName}
                        onChange={(e) => setHostelName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Campus Location</label>
                        <select
                          value={campus}
                          onChange={(e) => setCampus(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-800"
                        >
                          <option value="ABUJA">Abuja Campus</option>
                          <option value="CHOBA">Choba Campus</option>
                          <option value="DELTA">Delta Campus</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Gender Type</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setGender('MALE')}
                            className={`flex-1 py-2 px-3 border rounded-md text-xs font-semibold transition-all ${gender === 'MALE'
                                ? 'border-[#0a2540] bg-[#eef2f7] text-[#0a2540]'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                          >
                            Male
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender('FEMALE')}
                            className={`flex-1 py-2 px-3 border rounded-md text-xs font-semibold transition-all ${gender === 'FEMALE'
                                ? 'border-[#0a2540] bg-[#eef2f7] text-[#0a2540]'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                          >
                            Female
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Price per Session (₦)</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 45000"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe the hostel facilities, security features, and general environment..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities Card */}
                <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amenities & Facilities</h3>

                  <div className="flex flex-wrap gap-2 items-center">
                    {amenitiesList.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 bg-[#eef2f7] text-[#0a2540] text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenityTag(amenity)}
                          className="text-slate-400 hover:text-slate-600 font-semibold text-[10px]"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center border border-dashed border-slate-300 rounded-full pl-3 pr-1 py-1 hover:bg-slate-50 transition-all">
                      <input
                        type="text"
                        placeholder="Add Amenity"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenityTag(); } }}
                        className="bg-transparent border-0 text-xs font-semibold text-slate-600 placeholder-slate-400 focus:outline-hidden w-20"
                      />
                      <button
                        type="button"
                        onClick={addAmenityTag}
                        className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-semibold hover:bg-slate-300 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Capacity + Media + Actions) (4 cols) */}
              <div className="lg:col-span-4 space-y-6">

                {/* Capacity Card */}
                <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Capacity</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Total Rooms</label>
                      <input
                        type="number"
                        required
                        value={totalRooms}
                        onChange={(e) => setTotalRooms(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Beds Per Room</label>
                      <input
                        type="number"
                        required
                        value={bedsPerRoom}
                        onChange={(e) => setBedsPerRoom(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:outline-hidden focus:border-slate-400 text-slate-800"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Calculated Capacity:</span>
                      <span className="text-blue-600">{computedCapacity} Students</span>
                    </div>
                  </div>
                </div>

                {/* Media Card */}
                <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hostel Media</h3>

                  <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-md p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-slate-50 transition-all">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Click to upload cover image</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">PNG, JPG UP TO 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-3.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <BookOpen className="w-4 h-4" />
                    {actionLoading ? 'Publishing...' : 'Publish Hostel Entry'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHostelName('');
                      setDescription('');
                      setPrice('45000');
                      setTotalRooms('100');
                      setBedsPerRoom('4');
                      setMessage(null);
                      setActiveTab('applications');
                    }}
                    className="w-full text-center text-xs font-semibold text-rose-500 hover:text-rose-600 transition-all py-2"
                  >
                    Discard Changes
                  </button>
                </div>

              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
}
