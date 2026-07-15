import React, { useState, useEffect } from 'react';
import { ShoppingBag, HelpCircle, ShieldAlert, Sparkles, Database, Send, BookOpen, Clock, Store, CreditCard, ChevronRight, LogOut } from 'lucide-react';
import { FoodStall, Order, StudentProfile, OrderStatus } from './types';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import AdminDashboard from './components/AdminDashboard';
import VendorDashboard from './components/VendorDashboard';
import CheckoutSimulator from './components/CheckoutSimulator';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [stalls, setStalls] = useState<FoodStall[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);

  // Authentication & session role states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'vendor' | 'developer' | null>(null);
  const [loggedInStallId, setLoggedInStallId] = useState<string | null>(null);

  // App mode config (standard, vendor, developer)
  const [appMode, setAppMode] = useState<'standard' | 'vendor' | 'developer'>('standard');

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const res = await fetch('/mode-config.json');
        if (res.ok) {
          const config = await res.json();
          if (config.mode) {
            setAppMode(config.mode);
          }
        }
      } catch (err) {
        console.error("Error fetching app mode configuration:", err);
      }
    };
    fetchMode();
  }, []);

  // Checkout Simulator states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState('');
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [checkoutMethod, setCheckoutMethod] = useState<'UPI' | 'Card' | 'Wallet'>('Wallet');
  const [checkoutSuccessCallback, setCheckoutSuccessCallback] = useState<(() => void) | null>(null);

  
  const handleLogin = (role: 'student' | 'vendor' | 'developer', details: { regNum?: string; stallId?: string }) => {
    setUserRole(role);
    if (role === 'student' && details.regNum) {
      handleStudentChange(details.regNum);
    } else if (role === 'vendor' && details.stallId) {
      setLoggedInStallId(details.stallId);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setLoggedInStallId(null);
  };

  // Fetch initial data from server-side database endpoints
  const fetchData = async () => {
    try {
      // Fetch stalls
      const stallsRes = await fetch('/api/stalls');
      if (stallsRes.ok) {
        const stallsData = await stallsRes.json();
        setStalls(stallsData);
      }

      // Fetch all orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      // Sync active student profile if loaded
      if (activeStudent) {
        const studentRes = await fetch(`/api/students/${activeStudent.registrationNumber}`);
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setActiveStudent(studentData);
          
          // Also sync in the local students list
          setStudents(prev => prev.map(s => s.registrationNumber === studentData.registrationNumber ? studentData : s));
        }
      } else {
        // Pre-fetch preset Vignesh profile on start
        const studentRes = await fetch(`/api/students/12201948`);
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setActiveStudent(studentData);
          setStudents([studentData]);
        }
      }
    } catch (err) {
      console.error("Error fetching state from Express server:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up active 1.5-second polling interval for live real-time order/database synchronization
    const timer = setInterval(() => {
      fetchData();
    }, 1500);

    return () => clearInterval(timer);
  }, [activeStudent?.registrationNumber]);

  // Handle active student profile switches
  const handleStudentChange = async (regNum: string) => {
    try {
      const res = await fetch(`/api/students/${regNum}`);
      if (res.ok) {
        const studentData = await res.json();
        setActiveStudent(studentData);
        if (!students.find(s => s.registrationNumber === regNum)) {
          setStudents(prev => [...prev, studentData]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Register a new student profile
  const handleRegisterStudent = async (reg: string, name: string, phone: string) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNumber: reg, name, phone })
      });
      if (res.ok) {
        const newStudent = await res.json();
        setActiveStudent(newStudent);
        setStudents(prev => [...prev, newStudent]);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recharge active student wallet balance
  const handleAddBalance = async (amount: number) => {
    if (!activeStudent) return;
    try {
      const res = await fetch('/api/students/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNumber: activeStudent.registrationNumber, amount })
      });
      if (res.ok) {
        const updatedStudent = await res.json();
        setActiveStudent(updatedStudent);
        setStudents(prev => prev.map(s => s.registrationNumber === updatedStudent.registrationNumber ? updatedStudent : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin updates order status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin updates menu item inventory/stock
  const handleUpdateItemStock = async (stallId: string, itemId: string, stock: number) => {
    // Locate existing item and update
    const stall = stalls.find(s => s.id === stallId);
    if (!stall) return;
    const item = stall.menu.find(m => m.id === itemId);
    if (!item) return;

    const updatedItem = { ...item, inventory: stock, isAvailable: stock > 0 };

    try {
      const res = await fetch('/api/stalls/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stallId, item: updatedItem })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin adds a brand new menu item to a stall
  const handleAddItem = async (stallId: string, itemData: any) => {
    try {
      const res = await fetch('/api/stalls/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stallId, item: itemData })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin deletes a menu item
  const handleDeleteItem = async (stallId: string, itemId: string) => {
    try {
      const res = await fetch(`/api/stalls/items/${stallId}/${itemId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Triggering payment checkout flow
  const handleTriggerCheckout = (orderId: string, amount: number, method: 'UPI' | 'Card' | 'Wallet', onSuccess: () => void) => {
    setCheckoutOrderId(orderId);
    setCheckoutAmount(amount);
    setCheckoutMethod(method);
    setCheckoutSuccessCallback(() => onSuccess);
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = async (txnId: string) => {
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: checkoutOrderId, paymentMethod: checkoutMethod })
      });
      if (res.ok) {
        if (checkoutSuccessCallback) {
          checkoutSuccessCallback();
        }
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render LoginScreen if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen
        students={students}
        stalls={stalls.map(s => ({ id: s.id, name: s.name }))}
        onLogin={handleLogin}
        appMode={appMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Upper Brand / Feature Intro Header */}
      <div className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-emerald-900/30">
              LPU
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                LPU Smart Food Pre-Booking System
              </h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Real-Time WhatsApp AI Chatbot & Secure Payment Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Current Break: Lunch [12:30 PM]</span>
            </div>
            
            {/* Display active logged in session role info */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400 font-medium">Logged in as:</span>
              <span className="font-bold text-emerald-400 capitalize">
                {userRole === 'student' ? (activeStudent ? activeStudent.name : 'Student') : userRole === 'vendor' ? 'Stall Operator' : 'System Admin'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-slate-200 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all border border-slate-800 flex items-center gap-1.5 cursor-pointer"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area (Side-by-Side simulator and dashboard) */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        
        {/* Core System Architectural Highlights Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> 1. WhatsApp API Bot
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fully interactive student portal mimicking WhatsApp Mobile & Web. Students can search stalls, view menus, choose pre-booking slots, and receive confirmations via our integrated Gemini AI assistant.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span> 2. Express DB Sync
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time synchronization across database states. Placing an order or querying via the chatbot immediately reflects on the Admin Canteen Panel, adjusting inventory and updating sales charts on the fly!
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span> 3. Payment Gateway
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Simulates direct integrations with UPI, standard credit cards with simulated 3D-Secure OTP verification, or local LPU campus student wallet with instant ledger settlements and automated tracking.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 bg-rose-400 rounded-full"></span> 4. Queue & Inventory
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Includes automated queue waiting times based on current stall preparation queues and busy schedules, with real-time stock-depletion guards and instant refund workflows upon cancellations.
            </p>
          </div>
        </div>

        {/* Dynamic Workspace Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Column: Interactive Mobile WhatsApp Chat Simulator */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400 font-display font-bold text-xs uppercase tracking-widest">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated WhatsApp Web Client</span>
            </div>
            
            {userRole === 'vendor' ? (
              <div className="w-[360px] h-[640px] bg-slate-900 border border-slate-800 rounded-[40px] p-6 flex flex-col justify-center items-center text-center space-y-4 shadow-2xl relative overflow-hidden select-none">
                <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-slate-950/80 rounded-2xl flex items-center justify-center border border-slate-800 text-emerald-400">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-200">WhatsApp Simulator Locked</h3>
                <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
                  You are currently logged in as a <strong>Canteen Operator</strong>. To simulate student chat, please switch roles.
                </p>
                <button 
                  onClick={handleLogout}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-md shadow-emerald-950/30 cursor-pointer"
                >
                  Switch to Student
                </button>
              </div>
            ) : (
              <WhatsAppSimulator
                stalls={stalls}
                orders={orders}
                activeStudent={activeStudent}
                onStudentChange={handleStudentChange}
                onRegisterStudent={handleRegisterStudent}
                onAddBalance={handleAddBalance}
                onOrderPlaced={fetchData}
                triggerCheckout={handleTriggerCheckout}
              />
            )}
          </div>

          {/* Right Column: Full Admin & Canteen Vendor Dashboard Control Room */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-display font-bold text-xs uppercase tracking-widest">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Vendor Control Room (Admin Portal)</span>
            </div>

            {userRole === 'student' ? (
              <div className="h-[740px] bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4 shadow-xl relative overflow-hidden select-none w-full">
                <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-slate-950/80 rounded-2xl flex items-center justify-center border border-slate-800 text-indigo-400">
                  <Store className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-200">Vendor Control Room Locked</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  You are currently logged in as <strong>{activeStudent?.name || "Student"}</strong>. The Campus Canteen Operator terminal is restricted.
                </p>
                <button 
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-md shadow-indigo-950/30 cursor-pointer"
                >
                  Switch to Canteen Operator
                </button>
              </div>
            ) : userRole === 'vendor' ? (
              <VendorDashboard
                stalls={stalls}
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateItemStock={handleUpdateItemStock}
                onRefreshData={fetchData}
                preSelectedStallId={loggedInStallId || undefined}
              />
            ) : (
              <AdminDashboard
                stalls={stalls}
                orders={orders}
                students={students}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateItemStock={handleUpdateItemStock}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                onRefreshData={fetchData}
              />
            )}
          </div>

        </div>
      </main>

      {/* 3D-Secure Checkout Payment Gateway Simulator Dialog */}
      <CheckoutSimulator
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        orderId={checkoutOrderId}
        amount={checkoutAmount}
        paymentMethod={checkoutMethod}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Footer Branding Area */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-medium shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center">
          <p>© 2026 LPU Campus Food Pre-Booking. Built with Google AI Studio SDKs & React 19.</p>
          <div className="flex items-center gap-4 text-slate-400 font-semibold">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-400 transition-colors">Developer Portal</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-400 transition-colors">Merchant APIs</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
