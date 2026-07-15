import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, CheckCircle, ShieldCheck, Store, Clock, CreditCard, 
  Search, RefreshCw, Eye, EyeOff, AlertCircle, HelpCircle, ArrowUpRight 
} from 'lucide-react';
import { FoodStall, Order, OrderStatus } from '../types';

interface VendorDashboardProps {
  stalls: FoodStall[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateItemStock: (stallId: string, itemId: string, stock: number) => void;
  onRefreshData: () => void;
  preSelectedStallId?: string;
}

export default function VendorDashboard({
  stalls,
  orders,
  onUpdateOrderStatus,
  onUpdateItemStock,
  onRefreshData,
  preSelectedStallId
}: VendorDashboardProps) {
  // Active stall operator selection
  const [selectedStallId, setSelectedStallId] = useState<string>(preSelectedStallId || stalls[0]?.id || 'stall-1');
  const [activeSubTab, setActiveSubTab] = useState<'new_orders' | 'completed_orders' | 'payments' | 'menu_stock' | 'sales_metrics'>('new_orders');

  useEffect(() => {
    if (preSelectedStallId) {
      setSelectedStallId(preSelectedStallId);
    }
  }, [preSelectedStallId]);

  const currentStall = stalls.find(s => s.id === selectedStallId) || stalls[0];

  // Stall-specific orders filtering
  const stallOrders = orders.filter(o => o.stallId === selectedStallId);
  
  // New orders: Pending, Preparing, or Ready
  const newOrders = stallOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready');
  
  // Completed/Ready orders: Ready, Collected, Cancelled
  const completedOrders = stallOrders.filter(o => o.status === 'Ready' || o.status === 'Collected' || o.status === 'Cancelled');

  // Payments log: Paid status
  const paidOrders = stallOrders.filter(o => o.paymentStatus === 'Paid' && o.status !== 'Cancelled');

  // Daily / Monthly sales computations
  const todayStr = new Date().toISOString().split('T')[0];
  const dailySales = paidOrders
    .filter(o => o.pickupDate === todayStr)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const currentMonthStr = new Date().toISOString().substring(0, 7); // e.g. "2026-07"
  const monthlySales = paidOrders
    .filter(o => o.pickupDate && o.pickupDate.startsWith(currentMonthStr))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const completedTodayCount = stallOrders.filter(
    o => (o.status === 'Collected' || o.status === 'Ready') && o.pickupDate === todayStr
  ).length;

  return (
    <div className="flex flex-col h-[740px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100">
      
      {/* Canteen Vendor Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-stretch sm:items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xs tracking-wider text-slate-200 uppercase">🏪 Stall Operator Portal</h2>
            <p className="text-[10px] text-slate-400 font-semibold">Campus Canteen • Dynamic Status Tracking Terminal</p>
          </div>
        </div>

        {/* Dropdown to select Stall */}
        <div className="flex items-center gap-2.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Active Stall:</label>
          <select
            value={selectedStallId}
            onChange={(e) => setSelectedStallId(e.target.value)}
            disabled={!!preSelectedStallId}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {stalls.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
          <button 
            onClick={onRefreshData}
            className="hover:bg-slate-800 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors border border-slate-800 hover:border-slate-700"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-950/40 border-b border-slate-800/60 shrink-0">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incoming New Orders</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{newOrders.length} Pending</span>
          </div>
          <span className="text-[9px] text-slate-500 font-medium mt-1">Requires immediate attention</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
            <span className="text-xl font-black text-slate-200 mt-1 block">{completedTodayCount} Today</span>
          </div>
          <span className="text-[9px] text-slate-500 font-medium mt-1">Ready or Collected</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Sales Today</span>
            <span className="text-xl font-black text-slate-100 mt-1 block">₹{dailySales.toFixed(2)}</span>
          </div>
          <span className="text-[9px] text-emerald-500 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> Settled instantly
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Gross Sales</span>
            <span className="text-xl font-black text-slate-100 mt-1 block">₹{monthlySales.toFixed(2)}</span>
          </div>
          <span className="text-[9px] text-slate-500 font-medium mt-1">Total revenue track</span>
        </div>
      </div>

      {/* Operation Tabs Navigation */}
      <div className="bg-slate-900/40 border-b border-slate-800 px-6 py-2 flex flex-wrap gap-2 shrink-0 select-none">
        {[
          { id: 'new_orders', label: `New Orders Queue (${newOrders.length})` },
          { id: 'completed_orders', label: `Completed Log (${completedOrders.length})` },
          { id: 'payments', label: `Payments ledger` },
          { id: 'menu_stock', label: `Menu Availability` },
          { id: 'sales_metrics', label: `Sales Overview & Charts` },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveSubTab(tb.id as any)}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tb.id 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Main Container Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">

        {/* Tab 1. NEW ORDERS */}
        {activeSubTab === 'new_orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Cooking Queue</h3>
              <span className="text-[9px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                WhatsApp Live Channel Open
              </span>
            </div>

            {newOrders.length === 0 ? (
              <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-slate-700" />
                <p className="font-bold text-slate-400">No New Orders Placed</p>
                <p className="text-[11px] text-slate-600 mt-1">New student pre-bookings placed via WhatsApp show up here in real-time!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newOrders.map((order) => (
                  <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors space-y-4">
                    {/* ID & Status */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100 font-mono">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                            order.status === 'Pending' 
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1">Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">₹{order.totalAmount}</span>
                        <p className="text-[8px] text-slate-500 mt-1 font-semibold uppercase">{order.paymentMethod} • {order.paymentStatus}</p>
                      </div>
                    </div>

                    {/* Food Items Ordered */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5">
                      <p className="text-[9px] font-bold uppercase text-slate-500">Ordered Food Items:</p>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-bold text-slate-200">
                          <span>{it.name} <strong className="text-slate-500">x{it.quantity}</strong></span>
                          <span className="font-normal text-slate-400">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Scheduled Pickup Time */}
                    <div className="flex justify-between items-center text-xs font-semibold bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase">Target Pickup Slot:</span>
                      <span className="font-mono text-slate-100 font-bold text-xs">{order.pickupTime}</span>
                    </div>

                    {/* Operation Status Action Buttons */}
                    <div className="pt-2 flex gap-2">
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-950/20"
                        >
                          Accept & Prepare Food
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950/20"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Ready for Pickup
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Collected')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/20 animate-pulse"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Mark Collected
                        </button>
                      )}
                      
                      {order.status !== 'Collected' && order.status !== 'Cancelled' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')}
                          className="bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 px-3 py-2 rounded-xl text-xs transition-colors"
                          title="Cancel Order & Auto-Refund"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2. COMPLETED LOG */}
        {activeSubTab === 'completed_orders' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800/60">Historical Order logs</h3>
            
            {completedOrders.length === 0 ? (
              <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <p className="font-semibold text-slate-400">No Historical Orders</p>
                <p className="text-[11px] text-slate-600 mt-1">Completed or cancelled orders show up here once processed.</p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Ordered Food Items</th>
                      <th className="py-3 px-4">Pickup Time Slot</th>
                      <th className="py-3 px-4">Settlement Amount</th>
                      <th className="py-3 px-4 text-center">Final State Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                    {completedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold">{order.id}</td>
                        <td className="py-3 px-4">
                          {order.items.map((it, idx) => (
                            <span key={idx} className="block font-semibold text-slate-200">
                              {it.name} <strong className="text-slate-500">x{it.quantity}</strong>
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-4 font-mono">{order.pickupTime}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400 font-mono">₹{order.totalAmount}</td>
                        <td className="py-3 px-4 text-center">
                          {order.status === 'Ready' ? (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Collected')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1.5 rounded-xl text-[10px] uppercase transition-all inline-flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer animate-pulse"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Mark Collected
                            </button>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                              order.status === 'Collected'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {order.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3. PAYMENTS LEDGER */}
        {activeSubTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800/60">Revenue & Transactions Ledger</h3>
            
            {paidOrders.length === 0 ? (
              <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <p className="font-semibold text-slate-400">No Settled Payments Found</p>
                <p className="text-[11px] text-slate-600 mt-1">Paid transactions appear here automatically after student checkouts.</p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Corresponding Order</th>
                      <th className="py-3 px-4">Payment Channel</th>
                      <th className="py-3 px-4">Ledger Amount</th>
                      <th className="py-3 px-4">Settle Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                    {paidOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{order.transactionId || 'None'}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{order.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold bg-slate-850 px-2 py-1 rounded text-[10px] text-indigo-400 border border-slate-800">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-200 font-mono">₹{order.totalAmount}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Settled In Wallet
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4. MENU AVAILABILITY */}
        {activeSubTab === 'menu_stock' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Menu & Stock Updation</h3>
              <p className="text-[10px] text-slate-500 mt-1">Quickly adjust current inventory stock levels or toggle items on/off the digital menu</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStall?.menu.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                      <span className="text-[8px] bg-slate-950 text-slate-500 px-1 rounded font-mono">{item.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Category: {item.category} • Price: ₹{item.price}</p>
                    <span className={`inline-block text-[8px] font-bold uppercase mt-1 px-1.5 py-0.2 rounded ${
                      item.inventory > 0 && item.isAvailable
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                        : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                    }`}>
                      {item.inventory > 0 && item.isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stock level adjusting */}
                    <div className="text-right">
                      <label className="text-[9px] font-bold text-slate-500 block mb-1 uppercase">Adjust Stock:</label>
                      <input
                        type="number"
                        value={item.inventory}
                        onChange={(e) => onUpdateItemStock(selectedStallId, item.id, Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-center font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5. SALES ANALYTICS OVERVIEW */}
        {activeSubTab === 'sales_metrics' && (
          <div className="space-y-6 pb-6">
            <div className="pb-2 border-b border-slate-800/60 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350">Sales Analytics Hub</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time revenue metrics, goal indicators, and menu item performance statistics</p>
              </div>
              <span className="text-[9px] bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded font-bold uppercase">
                Analytics Live
              </span>
            </div>

            {/* Sales Dashboard Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Daily Sales Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Daily Sales Metric</span>
                    <h4 className="text-2xl font-black text-slate-100 font-mono mt-1">₹{dailySales.toFixed(2)}</h4>
                  </div>
                  <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Progress bar towards daily target of ₹2,000 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Daily Goal (₹2,000 Target)</span>
                    <span className="font-bold text-slate-200 font-mono">{Math.min(100, Math.round((dailySales / 2000) * 100))}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (dailySales / 2000) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Breakdown row */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/40 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-505 font-bold block uppercase">Paid Bookings</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {paidOrders.filter(o => o.pickupDate === todayStr).length} orders
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-505 font-bold block uppercase">Average Order (AOV)</span>
                    <span className="font-bold text-slate-200 font-mono">
                      ₹{(() => {
                        const todayPaid = paidOrders.filter(o => o.pickupDate === todayStr);
                        return todayPaid.length > 0 ? (dailySales / todayPaid.length).toFixed(2) : '0.00';
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Sales Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Monthly Revenue Metric</span>
                    <h4 className="text-2xl font-black text-slate-100 font-mono mt-1">₹{monthlySales.toFixed(2)}</h4>
                  </div>
                  <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                {/* Progress bar towards monthly target of ₹50,000 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Monthly Target (₹50,000 Goal)</span>
                    <span className="font-bold text-slate-200 font-mono">{Math.min(100, Math.round((monthlySales / 50000) * 100))}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-fuchsia-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (monthlySales / 50000) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Breakdown row */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/40 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-505 font-bold block uppercase">Cumulative Sales</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {paidOrders.filter(o => o.pickupDate && o.pickupDate.startsWith(currentMonthStr)).length} bookings
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-505 font-bold block uppercase">Projected Month Revenue</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ₹{(monthlySales * 1.25).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Custom SVG Graphical Chart showing peak activity distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                <span>📈 Canteen Peak Prep slots (Order Frequency Analysis)</span>
              </h4>
              
              <div className="h-44 w-full flex items-end justify-between pt-6 px-4 bg-slate-950/60 rounded-2xl border border-slate-850 relative">
                {/* SVG helper for background grid lines */}
                <div className="absolute inset-x-0 top-6 bottom-0 flex flex-col justify-between pointer-events-none px-4">
                  <div className="border-b border-slate-900/40 w-full h-0"></div>
                  <div className="border-b border-slate-900/40 w-full h-0"></div>
                  <div className="border-b border-slate-900/40 w-full h-0"></div>
                </div>

                {/* Draw custom interactive SVG bars for lunch break peak hours: 12:00 PM, 12:30 PM, 1:00 PM, 1:30 PM, 2:00 PM, Others */}
                {(() => {
                  const slots = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "Others"];
                  const slotCounts = slots.map(sl => {
                    if (sl === "Others") {
                      return paidOrders.filter(o => !slots.slice(0, 5).includes(o.pickupTime)).length;
                    }
                    return paidOrders.filter(o => o.pickupTime === sl).length;
                  });
                  const maxCount = Math.max(...slotCounts, 1);

                  return slots.map((sl, idx) => {
                    const count = slotCounts[idx];
                    const heightPercent = Math.max(8, (count / maxCount) * 80); // Min height of 8% for visibility
                    return (
                      <div key={sl} className="flex flex-col items-center flex-1 group z-10 cursor-pointer">
                        {/* Tooltip on hover */}
                        <div className="bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded shadow absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {count} Bookings
                        </div>
                        <div 
                          className="w-6 bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-teal-300 rounded-t transition-all shadow-md relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          {/* Inner glow dot */}
                          <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1 opacity-60"></div>
                        </div>
                        <span className="text-[9px] text-slate-500 group-hover:text-slate-300 font-bold mt-2 truncate max-w-[55px] font-mono">
                          {sl}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Bottom Row: Top Selling Menu Items & Category Contribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Item Leaderboard */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">🏆 Top Selling Food Items</h4>
                
                {(() => {
                  // Compute total copies sold per menu item
                  const itemStats: { [id: string]: { name: string; quantity: number; revenue: number } } = {};
                  stallOrders.forEach(o => {
                    if (o.status !== 'Cancelled') {
                      o.items.forEach(it => {
                        if (!itemStats[it.itemId]) {
                          itemStats[it.itemId] = { name: it.name, quantity: 0, revenue: 0 };
                        }
                        itemStats[it.itemId].quantity += it.quantity;
                        itemStats[it.itemId].revenue += it.price * it.quantity;
                      });
                    }
                  });

                  const sortedItems = Object.values(itemStats).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

                  if (sortedItems.length === 0) {
                    return <p className="text-xs text-slate-500 text-center py-6">No items sold yet.</p>;
                  }

                  return (
                    <div className="space-y-2">
                      {sortedItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-slate-950/45 border border-slate-850 p-2.5 rounded-xl text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 font-mono">
                              #{index + 1}
                            </span>
                            <div>
                              <span className="font-bold text-slate-200 block">{item.name}</span>
                              <span className="text-[9px] text-slate-500 font-semibold">{item.quantity} portions served</span>
                            </div>
                          </div>
                          <span className="font-bold font-mono text-emerald-400">₹{item.revenue}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Category Contribution breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">🍲 Menu Category Contribution</h4>
                
                {(() => {
                  // Category breakdown
                  const categoryRevenue: { [cat: string]: number } = {};
                  let totalRev = 0;

                  stallOrders.forEach(o => {
                    if (o.status !== 'Cancelled') {
                      o.items.forEach(it => {
                        const menuItem = currentStall?.menu.find(m => m.id === it.itemId);
                        const category = menuItem ? menuItem.category : 'General';
                        categoryRevenue[category] = (categoryRevenue[category] || 0) + (it.price * it.quantity);
                        totalRev += it.price * it.quantity;
                      });
                    }
                  });

                  if (totalRev === 0) {
                    return <p className="text-xs text-slate-500 text-center py-6">No sales data available.</p>;
                  }

                  return (
                    <div className="space-y-3">
                      {Object.entries(categoryRevenue).map(([cat, rev]) => {
                        const pct = Math.round((rev / totalRev) * 100);
                        return (
                          <div key={cat} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold text-slate-300">
                              <span>{cat}</span>
                              <span className="font-bold text-slate-200 font-mono">₹{rev.toFixed(0)} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                              <div 
                                className="bg-indigo-500 h-full rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
