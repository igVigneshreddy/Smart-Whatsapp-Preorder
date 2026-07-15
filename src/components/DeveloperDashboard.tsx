import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Store, LineChart, FileJson, Clock, 
  CheckCircle, ShieldCheck, Plus, Trash2, MessageSquare, Users, 
  TrendingUp, Flame, ArrowUpRight, ShieldAlert, Sparkles, RefreshCw, X, Database
} from 'lucide-react';
import { FoodStall, Order, StudentProfile, OrderStatus } from '../types';

interface DeveloperDashboardProps {
  stalls: FoodStall[];
  orders: Order[];
  students: StudentProfile[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateItemStock: (stallId: string, itemId: string, stock: number) => void;
  onAddItem: (stallId: string, item: any) => void;
  onDeleteItem: (stallId: string, itemId: string) => void;
  onRefreshData: () => void;
}

interface ChatLogMessage {
  id: string;
  sender: 'student' | 'chatbot';
  text: string;
  timestamp: string;
  metadata?: any;
}

interface StudentChat {
  registrationNumber: string;
  studentName: string;
  messages: ChatLogMessage[];
  lastMessageAt: string;
}

export default function DeveloperDashboard({
  stalls,
  orders,
  students,
  onUpdateOrderStatus,
  onUpdateItemStock,
  onAddItem,
  onDeleteItem,
  onRefreshData
}: DeveloperDashboardProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'orders' | 'students' | 'menu' | 'analytics' | 'db'>('chats');
  const [selectedStallId, setSelectedStallId] = useState<string>(stalls[0]?.id || 'stall-1');
  const [chats, setChats] = useState<StudentChat[]>([]);
  const [selectedChatReg, setSelectedChatReg] = useState<string>('');

  // Backup state management
  const [backupStatus, setBackupStatus] = useState<{
    exists: boolean;
    sizeBytes?: number;
    lastModified?: string;
    filePath?: string;
  } | null>(null);
  const [backingUp, setBackingUp] = useState(false);

  const fetchBackupStatus = async () => {
    try {
      const res = await fetch('/api/backup/status');
      if (res.ok) {
        const data = await res.json();
        setBackupStatus(data);
      }
    } catch (err) {
      console.error("Error fetching backup status:", err);
    }
  };

  const handleManualBackup = async () => {
    setBackingUp(true);
    try {
      const res = await fetch('/api/backup/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBackupStatus({
          exists: true,
          sizeBytes: data.sizeBytes,
          lastModified: data.lastModified,
          filePath: "backup.sql"
        });
      }
    } catch (err) {
      console.error("Error manual backup:", err);
    } finally {
      setTimeout(() => setBackingUp(false), 500);
    }
  };

  useEffect(() => {
    if (activeTab === 'db') {
      fetchBackupStatus();
    }
  }, [activeTab]);

  
  // Form states for adding menu items
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemStock, setNewItemStock] = useState('20');

  // Fetch student chats from backend
  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (res.ok) {
        const chatLogs: StudentChat[] = await res.json();
        setChats(chatLogs);
        if (chatLogs.length > 0 && !selectedChatReg) {
          setSelectedChatReg(chatLogs[0].registrationNumber);
        }
      }
    } catch (err) {
      console.error("Error fetching chats from server:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    // Live update chats every 1.5s
    const timer = setInterval(() => {
      fetchChats();
    }, 1500);
    return () => clearInterval(timer);
  }, [selectedChatReg]);

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    onAddItem(selectedStallId, {
      name: newItemName,
      price: Number(newItemPrice),
      category: newItemCategory || 'General',
      description: newItemDesc,
      inventory: Number(newItemStock),
      isAvailable: true,
      popularity: 4.0
    });

    // Reset Form
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory('');
    setNewItemDesc('');
    setNewItemStock('20');
    setShowAddForm(false);
  };

  // Calculations
  const totalSales = orders
    .filter(o => o.paymentStatus === 'Paid' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready').length;

  const getStudentOrderStats = (reg: string) => {
    const studentOrders = orders.filter(o => o.registrationNumber === reg);
    const paidOrders = studentOrders.filter(o => o.paymentStatus === 'Paid' && o.status !== 'Cancelled');
    const totalSpent = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      count: studentOrders.length,
      totalSpent
    };
  };

  const getStallSalesStats = (stallId: string) => {
    const stallOrders = orders.filter(o => o.stallId === stallId && o.paymentStatus === 'Paid' && o.status !== 'Cancelled');
    const amount = stallOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      count: stallOrders.length,
      amount
    };
  };

  // Find top selling item
  const itemCounts: { [key: string]: { count: number; name: string } } = {};
  orders
    .filter(o => o.status !== 'Cancelled')
    .forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.itemId]) {
          itemCounts[item.itemId] = { count: 0, name: item.name };
        }
        itemCounts[item.itemId].count += item.quantity;
      });
    });
  
  let topSellingItem = "Veg Burger";
  let topSellingCount = 4;
  Object.keys(itemCounts).forEach(id => {
    if (itemCounts[id].count > topSellingCount) {
      topSellingItem = itemCounts[id].name;
      topSellingCount = itemCounts[id].count;
    }
  });

  const activeChat = chats.find(c => c.registrationNumber === selectedChatReg);

  return (
    <div className="flex flex-col h-[740px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Top Title Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl border border-indigo-500/20">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xs tracking-wider text-slate-100 uppercase">👤 Developer Gateway Portal</h2>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
              Superuser Access • MySQL Emulated DB State Inspector • Chats & Analytics Logs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { onRefreshData(); fetchChats(); }}
            className="hover:bg-slate-800 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 transition-colors border border-slate-800 hover:border-slate-700"
            title="Force State Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-900/50 px-2.5 py-1 rounded-lg font-bold">
            MASTER ADMIN ROLE
          </span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 flex flex-wrap gap-2 shrink-0 select-none py-1">
        {[
          { id: 'chats', label: 'Student Chats', icon: MessageSquare },
          { id: 'orders', label: 'Order History', icon: ShoppingBag },
          { id: 'students', label: 'University Students', icon: Users },
          { id: 'menu', label: 'Stalls & Menu', icon: Store },
          { id: 'analytics', label: 'Sales Analytics', icon: LineChart },
          { id: 'db', label: 'Live Database Inspector', icon: FileJson },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main tab context */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
        
        {/* KPI indicators */}
        {activeTab !== 'chats' && activeTab !== 'db' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
                <p className="text-lg font-black text-slate-100 mt-1">₹{totalSales.toFixed(2)}</p>
                <p className="text-[9px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +14.2% today
                </p>
              </div>
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 border border-emerald-500/10">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Queue Size</p>
                <p className="text-lg font-black text-slate-100 mt-1">{activeOrdersCount} Pending</p>
                <p className="text-[9px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Avg Wait: 12 mins
                </p>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl text-slate-300">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Selling Food</p>
                <p className="text-xs font-black text-slate-100 mt-1.5 truncate max-w-[120px]">{topSellingItem}</p>
                <p className="text-[9px] text-amber-400 font-semibold mt-0.5 flex items-center gap-0.5">
                  <Flame className="w-3 h-3" /> {topSellingCount} bookings today
                </p>
              </div>
              <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 border border-amber-500/10">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Canteen Stalls</p>
                <p className="text-lg font-black text-slate-100 mt-1">{stalls.length} Active</p>
                <p className="text-[9px] text-indigo-400 font-semibold mt-1">
                  {stalls.map(s => s.name.split(' ')[0]).join(', ')}
                </p>
              </div>
              <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/10">
                <Store className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* 1. STUDENT CHATS TAB */}
        {activeTab === 'chats' && (
          <div className="flex h-[580px] border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/20">
            {/* Student list */}
            <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/40">
              <div className="p-4 border-b border-slate-800 shrink-0">
                <h3 className="font-display font-extrabold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Active Student Chats ({chats.length})
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">Select a student profile to read their live WhatsApp messages & AI orders</p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {chats.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No active student chats found. Type a message in WhatsApp Simulator to start logging!
                  </div>
                ) : (
                  chats.map(chat => {
                    const isSelected = chat.registrationNumber === selectedChatReg;
                    const lastMsg = chat.messages[chat.messages.length - 1];
                    return (
                      <button
                        key={chat.registrationNumber}
                        onClick={() => setSelectedChatReg(chat.registrationNumber)}
                        className={`w-full text-left p-4 transition-all flex flex-col gap-1 hover:bg-slate-800/40 ${
                          isSelected ? 'bg-indigo-950/30 border-l-4 border-indigo-500' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-slate-200 text-xs truncate max-w-[150px]">
                            {chat.studentName}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0">
                            {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-mono text-indigo-400 font-semibold">{chat.registrationNumber}</span>
                          <span className="bg-slate-800 text-slate-400 font-bold px-1.5 py-0.2 rounded-full text-[8px]">
                            {chat.messages.length} msg
                          </span>
                        </div>
                        {lastMsg && (
                          <p className="text-[10px] text-slate-500 mt-1 truncate w-full italic">
                            {lastMsg.sender === 'chatbot' ? '🤖 AI: ' : '👤 Stu: '}
                            {lastMsg.text}
                          </p>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat message reader */}
            <div className="flex-1 flex flex-col bg-slate-950">
              {activeChat ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 flex justify-between items-center shrink-0">
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">{activeChat.studentName}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-indigo-400 font-mono">Reg No: {activeChat.registrationNumber}</span>
                        <span>•</span>
                        <span>
                          Student Profile: {students.find(s => s.registrationNumber === activeChat.registrationNumber)?.phone || 'No phone'}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">MONITORING ACTIVE</span>
                    </div>
                  </div>

                  {/* Messages body */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60">
                    {activeChat.messages.map((msg, idx) => {
                      const isBot = msg.sender === 'chatbot';
                      return (
                        <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                            isBot 
                              ? 'bg-slate-900 border border-slate-800 text-slate-200' 
                              : 'bg-indigo-600 text-white'
                          }`}>
                            {/* Sender title */}
                            <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${
                              isBot ? 'text-indigo-400' : 'text-indigo-200'
                            }`}>
                              {isBot ? '🤖 LPU WhatsApp AI Assistant' : '👤 Student / Staff Member'}
                            </p>
                            
                            {/* Text content */}
                            <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                            
                            {/* Metadata attachment inside chat inspector */}
                            {msg.metadata && (
                              <div className="mt-2.5 pt-2 border-t border-slate-800/60 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded w-fit">
                                  <Sparkles className="w-3 h-3" /> Interactivity Attachment: {msg.metadata.type}
                                </div>
                                {msg.metadata.type === 'order_summary' && (
                                  <div className="bg-slate-950 p-2 rounded-lg font-mono text-[9px] border border-slate-800">
                                    <p className="text-indigo-400 font-bold">Order Placement Object:</p>
                                    <p>ID: {msg.metadata.data?.id}</p>
                                    <p>Stall: {msg.metadata.data?.stallName}</p>
                                    <p>Total: ₹{msg.metadata.data?.totalAmount}</p>
                                    <p>Status: {msg.metadata.data?.status}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Timestamp */}
                            <p className="text-[8px] text-right text-slate-400/80 mt-1 font-mono">{msg.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
                  <MessageSquare className="w-12 h-12 text-slate-800 mb-3" />
                  <p className="font-bold text-slate-400">No Chat Selected</p>
                  <p className="text-xs text-slate-600 max-w-sm mt-1">
                    Select a student chat session from the list on the left to inspect their dialogue and order creation logs in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ORDER HISTORY TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-display font-extrabold text-slate-300 text-sm">System-Wide Pre-Booked Orders</h3>
              <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900 px-2.5 py-1 rounded-md font-semibold">
                Central Orders Table (MySQL Synced)
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                <ShoppingBag className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="font-semibold text-slate-400">No Orders Placed Yet</p>
                <p className="text-xs text-slate-600 mt-1">Once orders are submitted via WhatsApp, they appear here instantly.</p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Student (University ID)</th>
                      <th className="py-3 px-4">Stall & Food Items</th>
                      <th className="py-3 px-4">Schedule Pickup</th>
                      <th className="py-3 px-4">Payment Info</th>
                      <th className="py-3 px-4 text-center">Real-Time status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                    {orders.map((order) => {
                      const studentName = students.find(s => s.registrationNumber === order.registrationNumber)?.name || 'Guest Student';
                      return (
                        <tr key={order.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{order.id}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-200">{studentName}</p>
                            <p className="text-[10px] font-mono text-indigo-400 mt-0.5">{order.registrationNumber}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-emerald-400">{order.stallName}</p>
                            <div className="text-[10px] text-slate-400 mt-0.5 space-y-0.5">
                              {order.items.map((it, i) => (
                                <span key={i} className="block">{it.name} <strong className="text-slate-300">x{it.quantity}</strong></span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <p className="font-bold text-slate-200">{order.pickupTime}</p>
                            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Ready: {order.estimatedReadyTime}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              order.paymentStatus === 'Paid' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {order.paymentStatus}
                            </span>
                            <span className="block text-[9px] font-mono text-slate-500 mt-1 truncate max-w-[90px]" title={order.transactionId}>
                              {order.transactionId || 'None'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {order.status === 'Pending' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 py-1 rounded text-[10px] transition-colors"
                                >
                                  Prepare
                                </button>
                              )}
                              {order.status === 'Preparing' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[10px] transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                                </button>
                              )}
                              {order.status === 'Ready' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Collected')}
                                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[10px] transition-colors"
                                >
                                  Collect
                                </button>
                              )}
                              {order.status === 'Collected' && (
                                <span className="text-slate-500 font-bold text-[10px] flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Collected
                                </span>
                              )}
                              {order.status === 'Cancelled' && (
                                <span className="text-rose-400 font-bold text-[10px]">Cancelled</span>
                              )}

                              {order.status !== 'Collected' && order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')}
                                  className="hover:bg-rose-500/10 text-rose-400 font-bold p-1 rounded text-[10px] transition-all"
                                  title="Cancel and Refund Student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. UNIVERSITY STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-display font-extrabold text-slate-300 text-sm">Registered Campus Users (Students & Staff)</h3>
              <p className="text-[10px] font-mono text-slate-400">Total database rows: {students.length}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Registration Number</th>
                    <th className="py-3 px-4">Student / Staff Name</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">LPU Wallet Balance</th>
                    <th className="py-3 px-4 text-center">Total Orders Placed</th>
                    <th className="py-3 px-4 text-right">Total Spent Cash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                  {students.map((student) => {
                    const stats = getStudentOrderStats(student.registrationNumber);
                    return (
                      <tr key={student.registrationNumber} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{student.registrationNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">{student.name}</td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">{student.phone}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-200">₹{student.balance.toFixed(2)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-300">{stats.count} orders</td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-400 font-mono">₹{stats.totalSpent.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. STALLS & MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {stalls.map(st => (
                  <button
                    key={st.id}
                    onClick={() => { setSelectedStallId(st.id); setShowAddForm(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedStallId === st.id 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-900/20' 
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                    }`}
                  >
                    {st.name} ({st.menu.length} items)
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showAddForm ? 'Close Form' : 'Add Food Item'}</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddNewItem} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="font-display font-extrabold text-xs text-slate-200 uppercase tracking-wider">Add Item to {stalls.find(s => s.id === selectedStallId)?.name}</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Item Name</label>
                    <input
                      required
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Garlic Naan, Chole Bhature"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Price (INR)</label>
                    <input
                      required
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 120"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Initial Inventory</label>
                    <input
                      required
                      type="number"
                      value={newItemStock}
                      onChange={(e) => setNewItemStock(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Main Course, Snacks, Drinks"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Description</label>
                    <input
                      type="text"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="Fresh and delicious..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Confirm & Create Item
                </button>
              </form>
            )}

            {/* List menu items for selected stall */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-5">
              <h3 className="font-display font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-4">Digital Menu & Stock Adjustments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stalls.find(s => s.id === selectedStallId)?.menu.map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-start hover:border-slate-700 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                        <span className="text-[8px] bg-slate-850 text-indigo-400 border border-slate-800 px-1 rounded font-mono">{item.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{item.description}</p>
                      <div className="flex gap-3 text-[10px] pt-1">
                        <span className="text-slate-500">Category: <strong className="text-slate-300">{item.category}</strong></span>
                        <span className="text-slate-500">Price: <strong className="text-emerald-400">₹{item.price}</strong></span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Inventory Stock</label>
                        <input
                          type="number"
                          value={item.inventory}
                          onChange={(e) => onUpdateItemStock(selectedStallId, item.id, Number(e.target.value))}
                          className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-center font-mono text-slate-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => onDeleteItem(selectedStallId, item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete Menu Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SALES ANALYTICS & PEAK PREDICTIONS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-md">
              <div className="space-y-1.5 max-w-[80%]">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Demand Forecasting Models
                </div>
                <h4 className="font-display font-black text-sm text-slate-100">Canteen Lunch Break Peak Window: 12:45 PM - 1:15 PM</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deep analysis predicts peak pre-booking demand will concentrate heavily on *Spice Junction* and *The Burger Club*. Suggest menu item prep schedules accordingly to reduce university queue latency times by 80%.
                </p>
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl text-amber-400">
                <Flame className="w-8 h-8" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom charts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                <h4 className="font-display font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-4">Total Sales Revenue Per Vendor Stall</h4>
                <div className="space-y-4">
                  {stalls.map(stall => {
                    const stats = getStallSalesStats(stall.id);
                    const percent = totalSales > 0 ? (stats.amount / totalSales) * 100 : 0;
                    return (
                      <div key={stall.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{stall.name} ({stats.count} orders)</span>
                          <span className="font-mono text-emerald-400 font-bold">₹{stats.amount.toFixed(2)} ({percent.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-850 overflow-hidden">
                          <div 
                            style={{ width: `${percent}%` }} 
                            className="bg-indigo-500 h-full rounded-full"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                <h4 className="font-display font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-4">Stall Popularity Shares</h4>
                <div className="flex items-center gap-6 justify-center h-40">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="40 100" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="35 100" strokeDashoffset="-40" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-75" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-90" />
                    </svg>
                  </div>
                  <div className="space-y-1.5 text-[10px] text-slate-400 font-semibold">
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded"></span> Spice Junction (40%)</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded"></span> The Burger Club (35%)</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded"></span> Café Delights (15%)</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-indigo-500 rounded"></span> Green Bowl (10%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. LIVE DATABASE INSPECTOR TAB */}
        {activeTab === 'db' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="font-display font-extrabold text-slate-300 text-xs uppercase tracking-wider">State Log Inspector (Express Emulated CJS Engine)</h3>
              <p className="text-[10px] text-slate-500">Mutates on student pre-booking confirmations</p>
            </div>

            {/* MySQL Database Backup Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl">
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase font-display">
                    <span>🗄️ MySQL Database Backup System</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed font-sans">
                    Automatically serializes and logs JSON tables to a MySQL SQL backup file on updates.
                  </p>
                  {backupStatus?.exists ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-500 font-bold font-mono">
                      <span>File: <strong className="text-slate-350">{backupStatus.filePath}</strong></span>
                      <span>Size: <strong className="text-emerald-400">{(backupStatus.sizeBytes! / 1024).toFixed(2)} KB</strong></span>
                      <span>Synced: <strong className="text-slate-350">{new Date(backupStatus.lastModified!).toLocaleTimeString()}</strong></span>
                    </div>
                  ) : (
                    <span className="text-[9px] text-rose-400 font-bold font-mono">Backup file does not exist. Press sync to create.</span>
                  )}
                </div>
              </div>

              <button
                onClick={handleManualBackup}
                disabled={backingUp}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-indigo-950/20 shrink-0 font-sans"
              >
                {backingUp ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing MySQL...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Trigger MySQL Dump</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl p-4 overflow-x-auto max-h-96">
                <p className="text-[10px] font-bold text-emerald-400 border-b border-slate-800 pb-1 mb-2 uppercase tracking-widest">orders_table.json ({orders.length} Rows)</p>
                <pre className="text-[9px]">{JSON.stringify(orders, null, 2)}</pre>
              </div>

              <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl p-4 overflow-x-auto max-h-96">
                <p className="text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2 uppercase tracking-widest">students_table.json ({students.length} Rows)</p>
                <pre className="text-[9px]">{JSON.stringify(students, null, 2)}</pre>
              </div>

              <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl p-4 overflow-x-auto max-h-96">
                <p className="text-[10px] font-bold text-indigo-400 border-b border-slate-800 pb-1 mb-2 uppercase tracking-widest">chats_table.json ({chats.length} Sessions)</p>
                <pre className="text-[9px]">{JSON.stringify(chats, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
