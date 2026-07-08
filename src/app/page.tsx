'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, MapPin, Users, ShieldCheck, Search, FileText, CheckCircle,
  School, Building2
} from 'lucide-react';

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

const getHostelImage = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('ake') || n.includes('independence') || n.includes('kano')) {
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600';
  }
  if (n.includes('mary') || n.includes('slessor') || n.includes('nuh')) {
    return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600';
  }
  if (n.includes('mandela') || n.includes('tetfund') || n.includes('delta')) {
    return 'https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?auto=format&fit=crop&q=80&w=600';
  }
  return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600';
};

export default function LandingPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHostels() {
      try {
        const res = await fetch('/api/hostels');
        const data = await res.json();
        if (data.hostels) {
          setHostels(data.hostels.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load hostels:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHostels();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">

      {/* ─── HEADER ─── */}
      <header id="header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-[#0a2540] flex items-center justify-center text-white font-semibold text-base">
              U
            </div>
            <div>
              <span className="font-semibold text-[#0a2540] text-base tracking-tight block leading-tight">UNIPORT Portal</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block -mt-0.5">Hostel Allocation</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-500">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#hostels" className="hover:text-slate-900 transition-colors">Hostels</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link 
              id="login-btn-header"
              href="/login" 
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              id="register-btn-header"
              href="/register" 
              className="text-xs font-semibold bg-[#0a2540] hover:bg-[#0d3154] text-white px-5 py-2.5 rounded-md shadow-xs hover:shadow-sm transition-all"
            >
              Register Now
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative py-24 lg:py-32 bg-[#0a2540] text-white overflow-hidden">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-blue-200 text-xs font-semibold tracking-wide">
              <School className="w-3.5 h-3.5" />
              <span>Official University of Port Harcourt Portal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-white">
              Secure Your <span className="text-blue-300">Campus Home</span> with Ease
            </h1>
            <p className="text-base text-blue-100/80 max-w-2xl leading-relaxed font-semibold">
              Skip the long physical queues. Browse comfortable, secure residence halls at Abuja, Choba, and Delta campuses — submit your application in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                id="cta-register"
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-[#0a2540] font-semibold rounded-md shadow-xs hover:bg-slate-50 transition-all text-sm group"
              >
                Apply for Hostel Room
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                id="cta-browse"
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-md border border-white/20 transition-all text-sm"
              >
                Browse Hostels
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800" 
                alt="UNIPORT Hostel Accommodation" 
                className="rounded-md w-full object-cover aspect-video shadow-xl brightness-90"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-md p-4 shadow-lg flex items-center space-x-3 border border-slate-100">
                <div className="w-9 h-9 rounded-md bg-[#d1fae5] flex items-center justify-center text-[#065f46]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Allocation Trust</p>
                  <p className="text-xs font-semibold text-slate-800">100% Secure & Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ROW ─── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Residence Halls', value: '6+' },
            { label: 'Campus Locations', value: '3' },
            { label: 'Bed Spaces', value: '700+' },
            { label: 'Students Allocated', value: '1,400+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-2xl font-semibold text-[#0a2540]">{stat.value}</p>
              <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simple Process</p>
            <h2 className="text-3xl font-semibold text-[#0a2540] tracking-tight">
              How the Allocation Works
            </h2>
            <p className="text-sm text-slate-500 font-semibold">
              Three seamless steps to secure your university room allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Search className="w-6 h-6" />,
                title: 'Search & Apply',
                desc: 'Log in, filter hostels by your campus, select a residence matching your registered gender, and submit your room allocation request in seconds.',
              },
              {
                step: '02',
                icon: <FileText className="w-6 h-6" />,
                title: 'Admin Review',
                desc: 'The Student Affairs team reviews your application and approves your preferred hostel room based on availability and priority.',
              },
              {
                step: '03',
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Move In',
                desc: 'Download your official digital allocation slip and proceed to the hall warden on your campus to collect your room keys.',
              }
            ].map((item) => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-md p-6 space-y-4 shadow-xs hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-md bg-[#eef2f7] flex items-center justify-center text-[#0a2540]">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-semibold text-slate-100 select-none">{item.step}</span>
                </div>
                <h3 className="text-base font-semibold text-[#0a2540]">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AVAILABLE HOSTELS ─── */}
      <section id="hostels" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Now</p>
              <h2 className="text-3xl font-semibold text-[#0a2540] tracking-tight">Available Residence Halls</h2>
              <p className="text-sm text-slate-500 font-semibold max-w-xl">
                Real-time snapshot of student accommodation available for this academic session.
              </p>
            </div>
            <Link 
              id="view-all-btn"
              href="/login" 
              className="inline-flex items-center text-xs font-semibold text-[#0a2540] hover:text-[#0d3154] transition-colors group shrink-0"
            >
              Sign in to browse all
              <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-50 rounded-md border border-slate-200 animate-pulse overflow-hidden">
                  <div className="bg-slate-200 h-44 w-full" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded-md w-2/3" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    <div className="h-8 bg-slate-200 rounded-md w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hostels.map((hostel) => {
                const spacesLeft = (hostel.capacity ?? 0) - (hostel.occupied ?? 0);
                const tagText = hostel.gender === 'MALE' ? 'Male Only' : 'Female Only';
                const statusText = spacesLeft <= 0 ? 'Full' : spacesLeft < 15 ? 'Few Rooms Left' : 'Available';

                return (
                  <div key={hostel.id} className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-44 bg-slate-100 shrink-0">
                      <img 
                        src={getHostelImage(hostel.name)} 
                        alt={hostel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                          tagText.includes('Male') ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#fce7f3] text-[#9d174d]'
                        }`}>
                          {tagText}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                          statusText === 'Available' ? 'bg-[#d1fae5] text-[#065f46]' : statusText === 'Few Rooms Left' ? 'bg-[#ffedd5] text-[#c2410c]' : 'bg-[#fee2e2] text-[#991b1b]'
                        }`}>
                          {statusText}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-semibold text-[#0a2540]">{hostel.name}</h3>
                        <div className="flex items-center text-xs font-semibold text-slate-400 gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{hostel.campus.charAt(0) + hostel.campus.slice(1).toLowerCase()} Campus</span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2 mt-1">{hostel.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-base font-semibold text-[#0a2540]">₦{hostel.price.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-semibold">/ session</span>
                        </div>
                        <Link
                          id={`apply-hostel-${hostel.id}`}
                          href="/login"
                          className="bg-[#0a2540] hover:bg-[#0d3154] text-white text-xs font-semibold py-2.5 px-5 rounded-md transition-all"
                        >
                          Sign In to Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 mx-auto rounded-md bg-[#eef2f7] flex items-center justify-center text-[#0a2540]">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold text-[#0a2540] tracking-tight">
            Ready to secure your hostel space?
          </h2>
          <p className="text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            Create your student account, browse available halls by campus, and submit your allocation request before spaces run out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0a2540] hover:bg-[#0d3154] text-white font-semibold rounded-md text-sm transition-all shadow-xs group"
            >
              Create Account
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-md text-sm transition-all shadow-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="footer" className="bg-[#0a2540] text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
            <div>
              <span className="text-white font-semibold text-sm block">UNIPORT Hostel Portal</span>
              <p className="text-[10px] text-slate-500 font-semibold">University of Port Harcourt</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            © {new Date().getFullYear()} University of Port Harcourt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
