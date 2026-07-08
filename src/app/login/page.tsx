'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!matricNumber || !password) {
      setError('Please enter your matric number and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricNumber: matricNumber.trim(),
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess('Sign in successful! Loading your dashboard...');

      localStorage.setItem('uniport_user', JSON.stringify(data.user));

      setTimeout(() => {
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/student');
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-between py-12 px-4 font-sans text-[#1E293B]">
        {/* Spacer or empty div to push content to center vertically */}
        <div className="hidden md:block"></div>

        {/* Main Container */}
        <div className="w-full max-w-[440px] flex flex-col items-center">
          {/* Header Logo & Title */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 rounded-md bg-[#00204A] flex items-center justify-center text-white mb-3 shadow-sm">
              {/* Custom SVG representing a hostel building as in the image */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#00204A] leading-tight">UNIPORT Portal</h1>
            <p className="text-xs text-[#64748B] mt-1 font-medium">University of Port Harcourt Hostel Management</p>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-md border border-[#E2E8F0] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">Welcome back</h2>
            <p className="text-xs text-[#64748B] leading-relaxed mb-6">
              Please enter your credentials to access the portal
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
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

              {/* Matric Number input */}
              <div className="space-y-1.5">
                <label htmlFor="matric" className="block text-xs font-semibold text-[#334155]">
                  Matric Number or Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    id="matric"
                    type="text"
                    placeholder="e.g. U2023/1234567"
                    required
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#00204A] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-semibold text-[#334155]">
                    Password
                  </label>
                  <Link href="#" className="text-xs font-semibold text-[#00204A] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    className="w-full pl-9 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#00204A] focus:bg-white transition-colors"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#00204A] hover:bg-[#001736] text-white text-sm font-semibold rounded-md shadow-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? 'Verifying...' : (
                  <>
                    <span>Sign In</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] bg-white px-3">
                New Student?
              </div>
            </div>

            {/* Register Link Button */}
            <Link
              href="/register"
              className="block w-full py-2.5 px-4 bg-white hover:bg-[#F8FAFC] border border-[#00204A] text-[#00204A] text-sm font-semibold rounded-md text-center transition-colors"
            >
              Register Account
            </Link>
          </div>

          {/* Footer Support Info */}
          <div className="mt-8 text-center text-xs text-[#64748B] space-y-1">
            <p>
              Need help? <Link href="#" className="font-semibold text-[#00204A] hover:underline">Contact Support</Link>
            </p>
            <p>© 2024 University of Port Harcourt. All rights reserved.</p>
          </div>
        </div>
      </div>
      {/* Floating/Bottom Right Secure Badge */}
      <div className="w-full max-w-[440px] md:max-w-none absolute bottom-8 md:right-8 flex justify-center md:justify-end mt-8 md:mt-0">
        <div className="flex items-center gap-3 bg-[#EEF2F6] border border-[#E2E8F0] rounded-md px-4 py-3 shadow-sm max-w-[260px]">
          <div className="w-8 h-8 rounded-full bg-[#D8E2EF] flex items-center justify-center text-[#00204A]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">Secure Portal</p>
            <p className="text-[10px] text-[#64748B] font-medium leading-none mt-0.5">SSL Encrypted Transaction</p>
          </div>
        </div>
      </div>
    </>
  );
}

