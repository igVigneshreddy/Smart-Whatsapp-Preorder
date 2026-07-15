import React, { useState, useEffect } from 'react';
import { User, Store, ShieldAlert, Sparkles, Eye, EyeOff, Loader2, QrCode, Monitor, CheckCircle, ChevronRight, Fingerprint, Lock } from 'lucide-react';
import { StudentProfile } from '../types';

interface LoginScreenProps {
  students: StudentProfile[];
  stalls: { id: string; name: string }[];
  onLogin: (role: 'student' | 'vendor' | 'developer', details: { regNum?: string; stallId?: string }) => void;
  appMode?: 'standard' | 'vendor' | 'developer';
}

export default function LoginScreen({ students, stalls, onLogin, appMode = 'standard' }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'vendor' | 'admin'>(
    appMode === 'vendor' ? 'vendor' : appMode === 'developer' ? 'admin' : 'student'
  );
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  // Sync tab selection with appMode changes (e.g. on async load)
  useEffect(() => {
    if (appMode === 'vendor') {
      setActiveTab('vendor');
    } else if (appMode === 'developer') {
      setActiveTab('admin');
    } else if (appMode === 'standard') {
      setActiveTab('student');
    }
  }, [appMode]);

  // Student states
  const [selectedRegNum, setSelectedRegNum] = useState('12201948'); // Default to Vignesh
  const [customRegNum, setCustomRegNum] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Vendor states
  const [selectedStallId, setSelectedStallId] = useState(stalls[0]?.id || 'stall-1');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Admin states
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [adminError, setAdminError] = useState(false);

  // Biometric scan simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            handleStudentLogin(selectedRegNum);
            return 100;
          }
          return p + 4;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScanning, selectedRegNum]);

  // Login loader steps animation
  const startLoginFlow = (loginAction: () => void) => {
    setLoading(true);
    setLoadStep(0);
    const timer = setInterval(() => {
      setLoadStep(s => {
        if (s >= 3) {
          clearInterval(timer);
          setTimeout(() => {
            loginAction();
          }, 300);
          return 3;
        }
        return s + 1;
      });
    }, 450);
  };

  const handleStudentLogin = (regNum: string) => {
    startLoginFlow(() => {
      onLogin('student', { regNum });
    });
  };

  const handleVendorLogin = () => {
    if (pin !== '1234') {
      setPinError(true);
      return;
    }
    setPinError(false);
    startLoginFlow(() => {
      onLogin('vendor', { stallId: selectedStallId });
    });
  };

  const handleAdminLogin = () => {
    if (adminUser !== 'admin' || adminPass !== 'admin123') {
      setAdminError(true);
      return;
    }
    setAdminError(false);
    startLoginFlow(() => {
      onLogin('developer', {});
    });
  };

  // Custom Keypad for Vendor PIN
  const handleKeypadPress = (val: string) => {
    setPinError(false);
    if (val === 'clear') {
      setPin('');
    } else if (val === 'delete') {
      setPin(p => p.slice(0, -1));
    } else {
      if (pin.length < 4) {
        setPin(p => p + val);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden px-4 select-none">
      
      {/* Background aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-md w-full z-10 space-y-6">
        
        {/* Branding Logo & Tagline */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 bg-emerald-600 rounded-2xl items-center justify-center font-display font-black text-xl text-white shadow-xl shadow-emerald-950/50 animate-bounce">
            LPU
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Smart Food Portal
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            WhatsApp Canteen & Booking Hub
          </p>
        </div>

        {/* Auth Box */}
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
          
          {loading ? (
            /* Futuristic authenticating loader view */
            <div className="py-12 px-4 flex flex-col items-center justify-center space-y-6">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-teal-300 absolute animate-pulse" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-200">Verifying Security Session</h3>
                
                {/* Steps logs */}
                <div className="space-y-1 text-left max-w-xs mx-auto text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className={loadStep >= 0 ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      {loadStep >= 0 ? "✓" : "○"} Connecting LPU Gateway...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={loadStep >= 1 ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      {loadStep >= 1 ? "✓" : "○"} Verifying credentials...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={loadStep >= 2 ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      {loadStep >= 2 ? "✓" : "○"} Loading Canteen DB Sync...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={loadStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      {loadStep >= 3 ? "✓" : "○"} Launching dashboard state...
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-48 bg-slate-950 h-1.5 rounded-full overflow-hidden mx-auto mt-4 border border-slate-850">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${(loadStep + 1) * 25}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs Role Selector */}
              {appMode === 'standard' && (
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-850 mb-6">
                  <button
                    onClick={() => { setActiveTab('student'); setPin(''); setAdminError(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'student'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>
                  
                  <button
                    onClick={() => { setActiveTab('vendor'); setPin(''); setAdminError(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'vendor'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Vendor</span>
                  </button>
                  
                  <button
                    onClick={() => { setActiveTab('admin'); setPin(''); setAdminError(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'admin'
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              )}

              {/* STUDENT TAB */}
              {activeTab === 'student' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Select Demo Profile</label>
                    <div className="grid grid-cols-1 gap-2">
                      {students.map((st) => (
                        <button
                          key={st.registrationNumber}
                          onClick={() => { setSelectedRegNum(st.registrationNumber); setCustomRegNum(''); }}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                            selectedRegNum === st.registrationNumber && !customRegNum
                              ? 'bg-emerald-600/10 border-emerald-500/30'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 uppercase">
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-100">{st.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">Reg: {st.registrationNumber}</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedRegNum === st.registrationNumber && !customRegNum
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-850'
                          }`}>
                            {selectedRegNum === st.registrationNumber && !customRegNum && <CheckCircle className="w-3 h-3" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Or enter credentials</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Registration Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 12201948"
                      value={customRegNum}
                      onChange={(e) => {
                        setCustomRegNum(e.target.value);
                        setSelectedRegNum(e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Dynamic Fingerprint biometric scan */}
                  {isScanning ? (
                    <div className="bg-slate-950 border border-emerald-950 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
                      <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse animate-duration-1000" />
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Biometric Scanner Reading ({scanProgress}%)</p>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${scanProgress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsScanning(true)}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs p-3 rounded-2xl flex items-center justify-center gap-1.5 flex-1 cursor-pointer transition-colors"
                      >
                        <Fingerprint className="w-4 h-4 text-emerald-400" />
                        <span>Mock Fingerprint</span>
                      </button>
                      <button
                        onClick={() => handleStudentLogin(selectedRegNum)}
                        disabled={!selectedRegNum.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs px-6 rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Access Portal</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* VENDOR TAB */}
              {activeTab === 'vendor' && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Select Your Stall</label>
                    <select
                      value={selectedStallId}
                      onChange={(e) => setSelectedStallId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-slate-200 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {stalls.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block text-center">Enter 4-Digit Pass PIN</label>
                    
                    {/* Visual PIN circles */}
                    <div className="flex justify-center gap-4 py-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <div 
                          key={idx} 
                          className={`w-3.5 h-3.5 rounded-full border transition-all ${
                            pin.length > idx 
                              ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-md shadow-indigo-500/40' 
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    {pinError && (
                      <p className="text-[10px] text-rose-400 font-bold text-center flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> PIN is '1234' for demo!
                      </p>
                    )}

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto pt-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'].map((k) => (
                        <button
                          key={k}
                          onClick={() => handleKeypadPress(k)}
                          className={`h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors cursor-pointer select-none ${
                            k === 'clear' || k === 'delete'
                              ? 'bg-slate-950 text-slate-500 hover:text-slate-350 hover:bg-slate-900 border border-slate-900'
                              : 'bg-slate-950 text-slate-300 hover:bg-slate-850 hover:text-indigo-400 border border-slate-850'
                          }`}
                        >
                          {k === 'delete' ? '⌫' : k === 'clear' ? 'C' : k}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVendorLogin}
                    disabled={pin.length !== 4}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-950/20"
                  >
                    <Store className="w-4 h-4" />
                    <span>Operator Login</span>
                  </button>
                </div>
              )}

              {/* ADMIN TAB */}
              {activeTab === 'admin' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Operator Username</label>
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => { setAdminUser(e.target.value); setAdminError(false); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Console Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={adminPass}
                        onChange={(e) => { setAdminPass(e.target.value); setAdminError(false); }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {adminError && (
                    <p className="text-[10px] text-rose-400 font-bold text-center">
                      Incorrect admin credentials! (Use admin / admin123)
                    </p>
                  )}

                  <button
                    onClick={handleAdminLogin}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-950/20"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Authenticate Console</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Help hints */}
        <div className="flex justify-between items-center px-4 text-[10px] text-slate-500 font-semibold select-none">
          <span>Demo PIN: 1234</span>
          <span>•</span>
          <span>Admin Pass: admin123</span>
          <span>•</span>
          <span>LPU Auth Gateway 3.0</span>
        </div>

      </div>
    </div>
  );
}
