'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('CHOBA');
  const [gender, setGender] = useState('MALE');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !matricNumber || !phoneNumber || !password) {
      setError('Please fill out all required fields.');
      return;
    }

    const matricRegex = /^U\d{4}\/\d{7}$/i;
    if (!matricRegex.test(matricNumber.trim())) {
      setError('Invalid Matric Number format. Expected format: UYYYY/XXXXXXX (e.g., U2023/1234567)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          matricNumber: matricNumber.trim(),
          email: email || undefined,
          phoneNumber,
          password,
          campus,
          gender
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Account registered successfully! Redirecting...');
      
      localStorage.setItem('uniport_user', JSON.stringify(data.user));
      
      setTimeout(() => {
        router.push('/student');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-[#1E293B]">
      {/* Left Column - Image & Overlay */}
      <div 
        className="w-full md:w-[60%] relative flex flex-col justify-end p-8 md:p-16 min-h-[360px] md:min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/images/hostel.png')` }}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10 z-0"></div>

        {/* Content on Image */}
        <div className="relative z-10 text-white max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Begin Your Journey
          </h1>
          <p className="text-sm md:text-base text-slate-200/90 leading-relaxed mb-8">
            Access premium student accommodation at the University of Port Harcourt. Register today to secure your place in our world-class campus hostels.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/20 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Verified Housing
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Secure Allocation
            </span>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full md:w-[40%] flex flex-col justify-between p-8 md:p-12 bg-[#F8FAFC] overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-[#00204A] flex items-center justify-center text-white shadow-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wider text-[#00204A] uppercase">UNIPORT</span>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Student Registration</h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Enter your details to create your portal account.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-xs font-semibold text-[#334155]">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Emmanuel"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#00204A] transition-colors"
                />
              </div>
            </div>

            {/* Matric Number */}
            <div className="space-y-1">
              <label htmlFor="matricNumber" className="block text-xs font-semibold text-[#334155]">
                Matric Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <input
                  id="matricNumber"
                  type="text"
                  placeholder="U2023/1234567"
                  required
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#00204A] transition-colors"
                />
              </div>
            </div>

            {/* Campus dropdown */}
            <div className="space-y-1">
              <label htmlFor="campus" className="block text-xs font-semibold text-[#334155]">
                Campus
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <select
                  id="campus"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] focus:outline-none focus:border-[#00204A] appearance-none transition-colors font-medium"
                >
                  <option value="CHOBA">Choba Campus</option>
                  <option value="ABUJA">Abuja Campus</option>
                  <option value="DELTA">Delta Campus</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label htmlFor="phoneNumber" className="block text-xs font-semibold text-[#334155]">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+234 000 000 0000"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#00204A] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-[#334155]">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#00204A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#00204A] hover:bg-[#001736] text-white text-sm font-semibold rounded-md shadow-sm flex items-center justify-center gap-2 transition-colors pt-3"
            >
              {loading ? 'Creating Account...' : (
                <>
                  <span>Create Account</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Already have an account? Sign In */}
          <p className="text-center text-xs text-[#475569] font-medium">
            Already have an account? <Link href="/login" className="font-bold text-[#00204A] hover:underline">Sign In</Link>
          </p>
        </div>

        {/* Footer Support Info */}
        <div className="w-full border-t border-[#E2E8F0] pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#64748B] gap-4">
          <p>© 2024 University of Port Harcourt</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

