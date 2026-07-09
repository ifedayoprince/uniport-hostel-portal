'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Search, FileText, CreditCard, Settings, LogOut, 
  MapPin, Users, CheckCircle, Clock, XCircle, Plus, HelpCircle, 
  Filter, SlidersHorizontal, User, Home, ArrowRight, Menu, X
} from 'lucide-react';

interface UserSession {
  id: string;
  fullName: string;
  matricNumber: string;
  email: string | null;
  phoneNumber: string;
  campus: string;
  gender: string;
  role: string;
  createdAt: string;
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
  hostel?: Hostel;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'applications'>('search');
  
  // Data state
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<'ALL' | 'CHOBA' | 'ABUJA' | 'DELTA'>('ALL');
  
  // Async states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedHostelDetails, setSelectedHostelDetails] = useState<Hostel | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication validation
  useEffect(() => {
    const rawUser = localStorage.getItem('uniport_user');
    if (!rawUser) {
      router.push('/login');
      return;
    }
    const sessionUser = JSON.parse(rawUser);
    if (sessionUser.role !== 'STUDENT') {
      router.push('/login');
      return;
    }
    setUser(sessionUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch hostels
      const hostelsRes = await fetch('/api/hostels');
      const hostelsData = await hostelsRes.json();
      if (hostelsData.hostels) {
        setHostels(hostelsData.hostels);
      }

      // Fetch student applications
      const appsRes = await fetch('/api/applications');
      const appsData = await appsRes.json();
      if (appsData.applications) {
        setApplications(appsData.applications);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (hostelId: string) => {
    setMessage(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostelId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setMessage({ type: 'success', text: data.message || 'Application submitted successfully!' });
      setActiveTab('applications');
      setSelectedHostelDetails(null);
      fetchData(); // reload
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('uniport_user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a2540]" />
      </div>
    );
  }

  // Get image based on hostel name
  const getHostelImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('ake') || n.includes('independence')) {
      return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600';
    }
    if (n.includes('mary') || n.includes('slessor') || n.includes('nuh')) {
      return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600';
    }
    if (n.includes('mandela') || n.includes('tetfund')) {
      return 'https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?auto=format&fit=crop&q=80&w=600';
    }
    return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600';
  };

  // Get dynamic room details subtitle
  const getRoomSubtitle = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('tetfund')) return 'Block C, Room 204';
    if (n.includes('nddc')) return 'Female Wing - Preference';
    if (n.includes('kanu')) return 'Postgraduate Suite';
    if (n.includes('nuh')) return 'Executive Wing';
    return 'Standard Room';
  };

  // Format ID to look exactly like the screenshot
  const formatAppId = (app: Application) => {
    const year = new Date(app.createdAt).getFullYear();
    const shortId = app.id.slice(-3).toUpperCase();
    return `APP-${year}-${shortId}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Top Navigation */}
      <header className="lg:hidden flex items-center justify-between bg-[#f8fafc] border-b border-slate-200/80 px-6 py-4 sticky top-0 z-40">
        <div>
          <span className="font-semibold text-[#0a2540] text-lg tracking-tight block">UNIPORT Portal</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block -mt-1">Student Access</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-all"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* ─── CONSISTENT SIDEBAR LAYOUT ─── */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#f8fafc] border-r border-slate-200/80 p-6 flex flex-col shrink-0 z-50 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8 pt-4">
          <span className="font-semibold text-[#0a2540] text-xl tracking-tight block">UNIPORT Portal</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block -mt-0.5">Student Access</span>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex flex-col space-y-1">
          <button 
            onClick={() => { setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 justify-start transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button 
            onClick={() => { setActiveTab('search'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold justify-start transition-all ${
              activeTab === 'search'
                ? 'bg-[#e2e8f0] text-[#0a2540] border-l-4 border-[#0a2540] pl-3'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            Room Search
          </button>

          <button 
            onClick={() => { setActiveTab('applications'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold justify-start transition-all ${
              activeTab === 'applications'
                ? 'bg-[#e2e8f0] text-[#0a2540] border-l-4 border-[#0a2540] pl-3'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Applications
          </button>

          <button 
            onClick={() => { setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 justify-start transition-all"
          >
            <CreditCard className="w-4 h-4" />
            Payments
          </button>

          <button 
            onClick={() => { setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 justify-start transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* New Application Action Button */}
        <button 
          onClick={() => { setActiveTab('search'); setIsSidebarOpen(false); }}
          className="bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-3.5 px-4 rounded-md mt-6 flex items-center justify-center gap-2 w-full transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>

        {/* Bottom Profile Section */}
        <div className="mt-auto pt-6 border-t border-slate-200/60 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0a2540] truncate">{user.fullName}</p>
              <p className="text-[11px] text-slate-400 font-semibold truncate">{user.matricNumber}</p>
            </div>
          </div>
          
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
      <main className="flex-1 p-4 sm:p-6 lg:p-10 lg:pl-14 space-y-8 max-w-7xl overflow-y-auto w-full">
        
        {/* ROOM SEARCH CONTENT */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-[#0a2540] tracking-tight">Available Hostels</h1>
              <p className="text-slate-500 text-sm font-semibold">
                {hostels.length} available hostels for the upcoming semester at UNIPORT.
              </p>
            </div>

            {/* Filters Block */}
            <div className="bg-white border border-slate-200/80 rounded-md p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase shrink-0">Filter by Campus:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['ALL', 'CHOBA', 'ABUJA', 'DELTA'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCampus(c)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                        selectedCampus === c 
                          ? 'bg-[#0a2540] border-[#0a2540] text-white' 
                          : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-hidden focus:border-slate-400 w-full text-slate-800 font-semibold"
                  />
                </div>
                <button className="p-2 border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50 transition-all">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hostels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hostels
                .filter(h => {
                  if (selectedCampus !== 'ALL' && h.campus !== selectedCampus) return false;
                  if (searchQuery) {
                    return h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           h.description.toLowerCase().includes(searchQuery.toLowerCase());
                  }
                  return true;
                })
                .map((hostel) => {
                  const spacesLeft = hostel.capacity - hostel.occupied;
                  const isFull = spacesLeft <= 0;
                  const tagText = hostel.gender === 'MALE' ? 'Male Only' : 'Female Only';
                  const statusText = isFull ? 'Full' : spacesLeft < 15 ? 'Few Rooms Left' : 'Available';

                  return (
                    <div key={hostel.id} className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
                      <div className="relative h-48 bg-slate-100 shrink-0">
                        <img 
                          src={getHostelImage(hostel.name)} 
                          alt={hostel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`text-[10px] font-semibold uppercase px-3 py-1 rounded-full shadow-xs ${
                            tagText.includes('Male') ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#fce7f3] text-[#9d174d]'
                          }`}>
                            {tagText}
                          </span>
                          <span className={`text-[10px] font-semibold uppercase px-3 py-1 rounded-full shadow-xs ${
                            statusText === 'Available' ? 'bg-[#d1fae5] text-[#065f46]' : statusText === 'Few Rooms Left' ? 'bg-[#ffedd5] text-[#c2410c]' : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}>
                            {statusText}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-[#0a2540]">{hostel.name}</h3>
                          <div className="flex items-center text-xs font-semibold text-slate-400 gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{hostel.campus.charAt(0) + hostel.campus.slice(1).toLowerCase()} Campus</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                          <div>
                            <span className="text-xl font-semibold text-[#0a2540]">₦{hostel.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 block -mt-1 font-semibold">/ session</span>
                          </div>
                          <button 
                            onClick={() => setSelectedHostelDetails(hostel)}
                            className="bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-2.5 px-6 rounded-md transition-all"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* APPLICATIONS CONTENT */}
        {activeTab === 'applications' && (
          <div className="space-y-8">
            
            {/* Header and Search/Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#0a2540] tracking-tight">My Applications</h1>
                <p className="text-slate-500 text-sm font-semibold">Track your current hostel allocation requests and history.</p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search applications..." 
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-xs focus:outline-hidden focus:border-slate-400 w-full text-slate-800 font-semibold shadow-2xs"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-2xs">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {/* Header Titles */}
              <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Application ID</span>
                <span>Hostel Name</span>
                <span>Date Applied</span>
                <span>Status</span>
                <span className="text-right pr-4">Actions</span>
              </div>

              {/* Dynamic Applications List from the API */}
              {applications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-md p-12 text-center space-y-4">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-semibold text-slate-800">No applications submitted yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Submit a room allocation request through the Room Search module to see your submission details here.
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="flex flex-col md:grid md:grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] md:items-center gap-4 md:gap-0 bg-white border border-slate-200/80 rounded-md p-5 shadow-xs transition-all hover:shadow-sm">
                    
                    {/* ID */}
                    <div className="flex items-center justify-between md:justify-start space-x-3 w-full md:w-auto">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Application ID</span>
                      <span className="text-xs font-semibold text-[#0a2540] font-mono">{formatAppId(app)}</span>
                    </div>

                    {/* Hostel Details */}
                    <div className="flex items-center justify-between md:justify-start space-x-3 w-full md:w-auto">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Hostel</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <Home className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#0a2540]">{app.hostel?.name || 'Unknown'}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold">{getRoomSubtitle(app.hostel?.name || '')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between md:justify-start space-x-3 w-full md:w-auto">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Date Applied</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between md:justify-start space-x-3 w-full md:w-auto">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Status</span>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide ${
                          app.status === 'APPROVED' 
                            ? 'bg-[#d1fae5] text-[#065f46]' 
                            : app.status === 'PENDING'
                            ? 'bg-[#fef3c7] text-[#92400e]'
                            : 'bg-[#fee2e2] text-[#991b1b]'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between md:justify-start md:text-right md:pr-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Actions</span>
                      <button className="text-xs font-semibold text-[#0a2540] hover:text-[#0d3154] transition-colors">
                        {app.status === 'APPROVED' ? (app.isPaid ? 'View Receipt' : 'Pay Fee') : app.status === 'PENDING' ? 'Modify' : 'Details'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Support & Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
              
              {/* Card 1: Room Swap (8 columns) */}
              <div className="md:col-span-8 bg-gradient-to-br from-[#0c2340] to-[#0e305c] rounded-md p-6 text-white flex flex-col justify-between space-y-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Need a specific hostel?</h3>
                  <p className="text-xs text-blue-200/90 leading-relaxed font-semibold">
                    Our new 'Room Swap' feature for Approved students is now live. Find a peer to trade spaces within the same hostel block.
                  </p>
                </div>
                <button className="self-start bg-white text-[#0a2540] hover:bg-slate-50 font-semibold text-xs px-5 py-3 rounded-md transition-all">
                  Explore Room Swap
                </button>
              </div>

              {/* Card 2: Support Desk (4 columns) */}
              <div className="md:col-span-4 bg-slate-100 border border-slate-200 rounded-md p-6 flex flex-col justify-between space-y-6 text-center items-center shadow-2xs">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs border border-blue-100">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-[#0a2540]">Application Issues?</h3>
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                      Contact the Student Affairs help desk for priority resolution.
                    </p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-[#0a2540] hover:text-[#0d3154] transition-all">
                  Get Support
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ─── HOSTEL DETAILS AND APPLICATION MODAL ─── */}
      {selectedHostelDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-8 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-[#0a2540]">{selectedHostelDetails.name}</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{selectedHostelDetails.campus} Campus • {selectedHostelDetails.gender} Hostel</p>
              </div>
              <button 
                onClick={() => setSelectedHostelDetails(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 text-xs leading-relaxed">{selectedHostelDetails.description}</p>
              
              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Capacity</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedHostelDetails.capacity} beds</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Amenities</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedHostelDetails.amenities.map((amenity, index) => (
                      <span key={index} className="bg-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded-md font-semibold">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md text-xs flex items-start gap-2.5 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
              }`}>
                <p className="font-semibold">{message.text}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <span className="text-2xl font-semibold text-[#0a2540]">₦{selectedHostelDetails.price.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-semibold block -mt-1">/ Academic session</span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    setSelectedHostelDetails(null);
                    setMessage(null);
                  }}
                  className="px-5 py-2.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleApply(selectedHostelDetails.id)}
                  disabled={actionLoading}
                  className="bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-2.5 px-6 rounded-md transition-all shadow-xs"
                >
                  {actionLoading ? 'Submitting...' : 'Apply for Space'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
