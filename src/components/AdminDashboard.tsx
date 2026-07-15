import React, { useState } from 'react';
import { ShieldAlert, Store, User, Sparkles, RefreshCw } from 'lucide-react';
import { FoodStall, Order, StudentProfile, OrderStatus } from '../types';
import DeveloperDashboard from './DeveloperDashboard';
import VendorDashboard from './VendorDashboard';

interface AdminDashboardProps {
  stalls: FoodStall[];
  orders: Order[];
  students: StudentProfile[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateItemStock: (stallId: string, itemId: string, stock: number) => void;
  onAddItem: (stallId: string, item: any) => void;
  onDeleteItem: (stallId: string, itemId: string) => void;
  onRefreshData: () => void;
}

export default function AdminDashboard({
  stalls,
  orders,
  students,
  onUpdateOrderStatus,
  onUpdateItemStock,
  onAddItem,
  onDeleteItem,
  onRefreshData
}: AdminDashboardProps) {
  // Master role toggle state: developer vs vendor
  const [activeRole, setActiveRole] = useState<'developer' | 'vendor'>('developer');

  return (
    <div className="space-y-4 w-full">
      {/* High-Fidelity Gateway Portal Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl select-none">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-slate-200">Terminal Access Hub</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Switch between different user-roles to test complete system flows</p>
          </div>
        </div>

        {/* Beautiful Interactive Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveRole('developer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeRole === 'developer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>👤 Developer Portal</span>
          </button>
          
          <button
            onClick={() => setActiveRole('vendor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeRole === 'vendor'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>🏪 Vendor Portal</span>
          </button>
        </div>
      </div>

      {/* Dynamic Dashboard Mounting based on role */}
      <div className="transition-all duration-300">
        {activeRole === 'developer' ? (
          <DeveloperDashboard
            stalls={stalls}
            orders={orders}
            students={students}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onUpdateItemStock={onUpdateItemStock}
            onAddItem={onAddItem}
            onDeleteItem={onDeleteItem}
            onRefreshData={onRefreshData}
          />
        ) : (
          <VendorDashboard
            stalls={stalls}
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onUpdateItemStock={onUpdateItemStock}
            onRefreshData={onRefreshData}
          />
        )}
      </div>
    </div>
  );
}
