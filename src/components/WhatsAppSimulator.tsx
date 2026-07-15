import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, CheckCheck, Landmark, PlusCircle, Search, UserCheck, MessageSquare, Mic, HelpCircle, FileText, ChevronRight, Check, Clock, ShieldCheck } from 'lucide-react';
import { ChatMessage, StudentProfile, FoodStall, Order } from '../types';

interface WhatsAppSimulatorProps {
  stalls: FoodStall[];
  orders: Order[];
  activeStudent: StudentProfile | null;
  onStudentChange: (regNum: string) => void;
  onRegisterStudent: (reg: string, name: string, phone: string) => void;
  onAddBalance: (amount: number) => void;
  onOrderPlaced: () => void;
  triggerCheckout: (orderId: string, amount: number, method: 'UPI' | 'Card' | 'Wallet', onSuccess: () => void) => void;
}

export default function WhatsAppSimulator({
  stalls,
  orders,
  activeStudent,
  onStudentChange,
  onRegisterStudent,
  onAddBalance,
  onOrderPlaced,
  triggerCheckout
}: WhatsAppSimulatorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'chatbot',
      text: "👋 Welcome to the *LPU Food Pre-Booking Assistant*!\nAvoid long canteen queues by pre-booking your favorite meals.\n\nHere are some quick actions to help you get started:\n*1.* 🍔 _Pre-book Food_\n*2.* 📋 _View Menu_\n*3.* 📦 _Track Order_\n*4.* ❓ _Help_\n\nPlease provide your *University Registration Number* (e.g., 12201948) to log in or start pre-booking!",
      timestamp: '12:00 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [regInput, setRegInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [showRegForm, setShowRegForm] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [dismissedOrderId, setDismissedOrderId] = useState<string | null>(null);

  const activeOrder = orders
    .filter(o => o.registrationNumber === activeStudent?.registrationNumber)
    .find(o => o.id !== dismissedOrderId && (o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready' || o.status === 'Collected'));

  // Reset dismissed state when a new pending/preparing/ready order starts
  useEffect(() => {
    if (activeStudent) {
      const activePending = orders
        .filter(o => o.registrationNumber === activeStudent.registrationNumber)
        .find(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready');
      if (activePending && dismissedOrderId === activePending.id) {
        setDismissedOrderId(null);
      }
    }
  }, [orders, activeStudent, dismissedOrderId]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat container whenever messages list updates, completely preventing parent window jump
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const prevStatusesRef = useRef<{ [orderId: string]: string }>({});

  // Real-time Order Status Monitor
  useEffect(() => {
    if (!activeStudent) return;
    
    const studentOrders = orders.filter(o => o.registrationNumber === activeStudent.registrationNumber);
    
    studentOrders.forEach(order => {
      const prevStatus = prevStatusesRef.current[order.id];
      if (prevStatus && prevStatus !== order.status) {
        let notificationText = "";
        if (order.status === 'Preparing') {
          notificationText = `🔔 *Order Update:* Your order *${order.id}* from *${order.stallName}* has been accepted by the kitchen and is now *PREPARING*! 🍳\n⏰ Estimated ready time: *${order.estimatedReadyTime}*.`;
        } else if (order.status === 'Ready') {
          notificationText = `🔔 *Order Update:* Great news! Your order *${order.id}* is now *READY FOR PICKUP*! 🥳\nPlease proceed directly to the Express Counter at *${order.stallName}* and show your Order ID to collect your hot meal instantly without standing in queues!`;
        } else if (order.status === 'Collected') {
          notificationText = `🔔 *Order Update:* Your order *${order.id}* has been successfully *COLLECTED*. Thank you for pre-booking with us! Enjoy your meal! 🍛✨`;
        } else if (order.status === 'Cancelled') {
          notificationText = `🔔 *Order Update:* Your order *${order.id}* has been *CANCELLED* by the canteen vendor. A full refund of *₹${order.totalAmount}* has been processed back to your student balance.`;
        }

        if (notificationText) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages(prev => [
            ...prev,
            {
              id: `notif-${order.id}-${order.status}-${Date.now()}`,
              sender: 'chatbot',
              text: notificationText,
              timestamp,
              metadata: {
                type: 'status_track',
                data: order
              }
            }
          ]);
        }
      }
      prevStatusesRef.current[order.id] = order.status;
    });

    studentOrders.forEach(order => {
      if (!prevStatusesRef.current[order.id]) {
        prevStatusesRef.current[order.id] = order.status;
      }
    });
  }, [orders, activeStudent]);

  // Handle preset quick clicks
  const handleQuickAction = async (actionText: string) => {
    setInputText(actionText);
    await sendMessage(actionText);
  };

  const handleSelectMenuItem = (itemName: string) => {
    setInputText(`I want to pre-book a ${itemName}`);
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    setInputText('');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `student-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          registrationNumber: activeStudent?.registrationNumber || '',
          history: messages.slice(-10) // Send recent history for context
        })
      });

      const data = await response.json();
      
      const chatbotMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'chatbot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: data.metadata
      };

      setMessages(prev => [...prev, chatbotMsg]);

      // If an order is simulated, notify parent to refresh active order logs
      if (data.metadata?.type === 'order_summary') {
        onOrderPlaced();
      }

    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'chatbot',
        text: "⚠️ *Network Exception*\nHaving some trouble reaching the chatbot service right now. Please verify server connectivity.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate Speech-to-Text Voice input
  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      const voicePrompts = [
        "I want to pre-book a Veg Burger and Cold Coffee for 1:30 PM",
        "Show me what is available at Spice Junction stall",
        "Check status of my latest food booking",
        "What are the canteens and stalls near me?"
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInputText(randomPrompt);
    } else {
      setIsRecording(true);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regInput || !nameInput) return;
    onRegisterStudent(regInput, nameInput, phoneInput);
    setShowRegForm(false);
    
    // Add custom automated welcome message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: `bot-reg-${Date.now()}`,
        sender: 'chatbot',
        text: `✅ *Registration Successful!*\nWelcome aboard, *${nameInput}* (Reg: ${regInput}). \n\nI have credited *₹200.00* welcome balance to your wallet! How can I satisfy your hunger today? \n\nType *'View Menu'* or *'1'* to start ordering!`,
        timestamp
      }
    ]);

    setRegInput('');
    setNameInput('');
    setPhoneInput('');
  };

  const handleSelectQuickStudent = (reg: string) => {
    onStudentChange(reg);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Clear registration input box
    setMessages(prev => [
      ...prev,
      {
        id: `bot-sw-${Date.now()}`,
        sender: 'chatbot',
        text: `🔄 *Profile Switched!* \nLogged in as student registration number *${reg}*. Ready for quick pre-booking.`,
        timestamp
      }
    ]);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[780px] max-w-md w-full relative">
      {/* Phone status bar */}
      <div className="bg-emerald-800 text-white/95 px-5 py-2 flex justify-between items-center text-xs font-mono select-none">
        <span>LPU Campus 5G</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          <span>WhatsApp Web Sim</span>
        </div>
      </div>

      {/* WhatsApp App / Contact Header */}
      <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center font-display font-bold text-emerald-800">
              LPU
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-emerald-700 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
          </div>
          <div>
            <h2 className="font-display font-bold text-sm tracking-wide">LPU Food Pre-Booking Assistant</h2>
            <p className="text-[10px] text-emerald-100 font-medium">
              {isOnline ? 'Verified WhatsApp Bot' : 'Offline Mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-emerald-100">
          <button onClick={() => setIsOnline(!isOnline)} title="Toggle Bot Connectivity">
            <Phone className="w-4 h-4 hover:text-white transition-colors" />
          </button>
          <Video className="w-4 h-4 hover:text-white transition-colors" />
          <MoreVertical className="w-4 h-4 hover:text-white transition-colors" />
        </div>
      </div>

      {/* Active Student Dashboard Panel */}
      <div className="bg-slate-800 text-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/60 text-xs">
        {activeStudent ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-white">{activeStudent.name}</span>
                <span className="text-slate-400 font-mono text-[10px] ml-1.5">({activeStudent.registrationNumber})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-700 px-2 py-0.5 rounded-md font-mono text-emerald-400 font-bold">
                ₹{activeStudent.balance.toFixed(2)}
              </span>
              <button
                onClick={() => onAddBalance(100)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded-md transition-colors"
                title="Add 100 INR to Student Wallet"
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <span className="text-amber-400 font-medium">⚠️ Guest Profile (Anonymous)</span>
            <button
              onClick={() => setShowRegForm(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors"
            >
              Log In / Register
            </button>
          </div>
        )}
      </div>

      {/* Quick Profile Selector drawer */}
      {!showRegForm && (
        <div className="bg-slate-800/80 border-b border-slate-700 px-3 py-1.5 flex gap-1.5 overflow-x-auto text-[10px] select-none scrollbar-none shrink-0">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">Simulate Profile:</span>
          <button 
            onClick={() => handleSelectQuickStudent('12201948')}
            className={`px-2 py-0.5 rounded-full transition-colors font-semibold ${activeStudent?.registrationNumber === '12201948' ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
          >
            Vignesh (12201948)
          </button>
          <button 
            onClick={() => handleSelectQuickStudent('12202025')}
            className={`px-2 py-0.5 rounded-full transition-colors font-semibold ${activeStudent?.registrationNumber === '12202025' ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
          >
            Aarav (12202025)
          </button>
          <button 
            onClick={() => handleSelectQuickStudent('12204432')}
            className={`px-2 py-0.5 rounded-full transition-colors font-semibold ${activeStudent?.registrationNumber === '12204432' ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
          >
            Priya (12204432)
          </button>
          <button 
            onClick={() => setShowRegForm(true)}
            className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 flex items-center gap-0.5"
          >
            <PlusCircle className="w-3 h-3" /> New
          </button>
        </div>
      )}

      {/* Live Order Status Tracker Bar */}
      {activeStudent && activeOrder && (
        <div className={`border-b p-3.5 text-white animate-in slide-in-from-top-2 duration-300 shrink-0 transition-colors ${
          activeOrder.status === 'Collected' 
            ? 'bg-emerald-950/90 border-emerald-800/50' 
            : 'bg-slate-950 border-emerald-900/35'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              {activeOrder.status === 'Collected' ? (
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
              ) : (
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
              )}
              {activeOrder.status === 'Collected' ? 'ORDER COMPLETED & COLLECTED' : 'REAL-TIME PRE-BOOK STATUS'}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700">
                {activeOrder.id}
              </span>
              {activeOrder.status === 'Collected' && (
                <button
                  type="button"
                  onClick={() => setDismissedOrderId(activeOrder.id)}
                  className="text-[10px] text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-emerald-400 font-bold truncate max-w-[150px]">{activeOrder.stallName}</span>
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {activeOrder.status === 'Collected' ? 'Enjoy your meal! 🎉' : `Est. Ready: ${activeOrder.estimatedReadyTime}`}
            </span>
          </div>

          {/* Progress Nodes bar */}
          <div className="relative flex items-center justify-between mt-3 px-3">
            {/* Background Line */}
            <div className="absolute left-6 right-6 h-0.5 bg-slate-800 top-2.5 z-0"></div>
            
            {/* Progress Fill Line */}
            <div 
              className="absolute left-6 h-0.5 bg-emerald-500 top-2.5 z-0 transition-all duration-500"
              style={{
                width: activeOrder.status === 'Pending' ? '0%' : activeOrder.status === 'Preparing' ? '50%' : '100%'
              }}
            ></div>

            {/* Node 1: Placed */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                activeOrder.status === 'Pending' || activeOrder.status === 'Preparing' || activeOrder.status === 'Ready' || activeOrder.status === 'Collected'
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-950/40'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                ✓
              </div>
              <span className="text-[9px] text-slate-400 font-bold mt-1">Placed</span>
            </div>

            {/* Node 2: Kitchen */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                activeOrder.status === 'Preparing' || activeOrder.status === 'Ready' || activeOrder.status === 'Collected'
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-950/40'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {activeOrder.status === 'Preparing' ? (
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                ) : (activeOrder.status === 'Ready' || activeOrder.status === 'Collected') ? '✓' : '2'}
              </div>
              <span className="text-[9px] text-slate-400 font-bold mt-1">Kitchen</span>
            </div>

            {/* Node 3: Counter */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                activeOrder.status === 'Ready'
                  ? 'bg-amber-500 text-white ring-4 ring-amber-950/40 animate-pulse'
                  : activeOrder.status === 'Collected'
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-950/40'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {activeOrder.status === 'Ready' ? '!' : activeOrder.status === 'Collected' ? '✓' : '3'}
              </div>
              <span className="text-[9px] text-slate-400 font-bold mt-1">
                {activeOrder.status === 'Collected' ? 'Collected' : 'Counter'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Registration/Login Form Overlay Drawer */}
      {showRegForm && (
        <form onSubmit={handleRegisterSubmit} className="bg-slate-800 border-b border-slate-700 p-4 space-y-3 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center border-b border-slate-700 pb-1.5 mb-1">
            <span className="font-display font-bold text-xs text-white">Student Registration & Login</span>
            <button type="button" onClick={() => setShowRegForm(false)} className="text-slate-400 hover:text-white text-xs font-semibold">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Reg Number</label>
              <input
                required
                type="text"
                value={regInput}
                onChange={(e) => setRegInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                placeholder="12201948"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Student Name</label>
              <input
                required
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                placeholder="Vignesh Reddy"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 rounded-md transition-colors"
          >
            Create Campus Account & Login
          </button>
        </form>
      )}

      {/* Conversation Thread Canvas */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundSize: 'contain',
          backgroundBlendMode: 'overlay',
          backgroundColor: '#efeae2'
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 ${msg.sender === 'student' ? 'whatsapp-bubble-out' : 'whatsapp-bubble-in'}`}>
              
              {/* Message text with bold & markdown simulator formatting */}
              <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed font-sans select-text">
                {msg.text.split('\n').map((line, idx) => {
                  let formatted = line;
                  // Bold conversion *text* -> <strong>text</strong>
                  formatted = formatted.replace(/\*(.*?)\*/g, '$1');
                  // Italic conversion _text_ -> <em>text</em>
                  formatted = formatted.replace(/_(.*?)_/g, '$1');
                  return (
                    <span key={idx} className="block">
                      {formatted}
                    </span>
                  );
                })}
              </p>

              {/* Custom metadata displays for interactive cards inside WhatsApp */}
              {msg.metadata?.type === 'menu' && (
                <div className="mt-3 border-t border-slate-100 pt-3 space-y-3">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">🛒 Tap menu to order:</p>
                  {stalls.map(stall => (
                    <div key={stall.id} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                        <span className="font-display font-bold text-xs text-slate-800">{stall.name}</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">{stall.cuisine}</span>
                      </div>
                      <div className="space-y-1.5">
                        {stall.menu.map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => handleSelectMenuItem(item.name)}
                            className="flex justify-between items-center text-xs hover:bg-emerald-50/50 p-1 rounded cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-700">{item.name}</p>
                              <p className="text-[9px] text-slate-400 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800">₹{item.price}</p>
                              <p className={`text-[9px] ${item.inventory > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {item.inventory > 0 ? `Stock: ${item.inventory}` : 'Out of Stock'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.metadata?.type === 'order_summary' && msg.metadata.data && (
                <div className="mt-3 bg-emerald-50/80 border border-emerald-100 rounded-xl p-3 space-y-2.5">
                  <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2">
                    <span className="font-display font-bold text-xs text-emerald-800">Order Placed</span>
                    <span className="font-mono font-bold text-[10px] text-emerald-700">{msg.metadata.data.id}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">{msg.metadata.data.stallName}</p>
                    {msg.metadata.data.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between font-medium">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200/60 mt-1">
                      <span>Total Amount:</span>
                      <span>₹{msg.metadata.data.totalAmount}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-[11px] space-y-1 text-slate-600 border border-emerald-100">
                    <p>⏰ *Pickup Scheduled:* {msg.metadata.data.pickupTime}</p>
                    <p>⚡ *Estimated Ready:* {msg.metadata.data.estimatedReadyTime}</p>
                    <p>⌛ *Est. Waiting Queue:* {msg.metadata.data.waitingTimeEstimation} mins</p>
                  </div>
                  {msg.metadata.data.paymentStatus === 'Pending' && (
                    <button
                      onClick={() => {
                        triggerCheckout(
                          msg.metadata.data.id,
                          msg.metadata.data.totalAmount,
                          msg.metadata.data.paymentMethod,
                          () => sendMessage(`I paid for order ${msg.metadata.data.id}`)
                        );
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                    >
                      💳 Tap to Complete Secure Payment
                    </button>
                  )}
                </div>
              )}

              {msg.metadata?.type === 'status_track' && msg.metadata.data && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="font-display font-bold text-xs text-slate-800">Real-Time Status</span>
                    <span className="font-mono font-semibold text-[10px] text-slate-500">{msg.metadata.data.id}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></span>
                        <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-slate-800">Status: {msg.metadata.data.status}</p>
                        <p className="text-[10px] text-slate-500">{msg.metadata.data.stallName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[10px] text-slate-600 border-t border-slate-200/60">
                      <div>
                        <p className="font-semibold">Schedule Pickup:</p>
                        <p className="font-mono font-bold text-slate-800">{msg.metadata.data.pickupTime}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Estimated Ready:</p>
                        <p className="font-mono font-bold text-emerald-700">{msg.metadata.data.estimatedReadyTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[9px] text-slate-400 select-none font-mono">{msg.timestamp}</span>
                {msg.sender === 'student' && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="whatsapp-bubble-in px-4 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium select-none">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></span>
              </span>
              <span>Bot typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Fast Quick Reply Shortcuts */}
      <div className="bg-slate-800/90 border-t border-slate-700/60 px-3 py-2 flex gap-2 overflow-x-auto select-none scrollbar-none shrink-0">
        <button
          onClick={() => handleQuickAction('1')}
          className="bg-slate-700/80 hover:bg-slate-700 text-slate-100 text-xs px-3 py-1 rounded-full transition-colors font-medium border border-slate-600/50 shrink-0 flex items-center gap-1"
        >
          🍔 1. Pre-book Food
        </button>
        <button
          onClick={() => handleQuickAction('2')}
          className="bg-slate-700/80 hover:bg-slate-700 text-slate-100 text-xs px-3 py-1 rounded-full transition-colors font-medium border border-slate-600/50 shrink-0 flex items-center gap-1"
        >
          📋 2. View Menu
        </button>
        <button
          onClick={() => handleQuickAction('3')}
          className="bg-slate-700/80 hover:bg-slate-700 text-slate-100 text-xs px-3 py-1 rounded-full transition-colors font-medium border border-slate-600/50 shrink-0 flex items-center gap-1"
        >
          📦 3. Track Order
        </button>
        <button
          onClick={() => handleQuickAction('4')}
          className="bg-slate-700/80 hover:bg-slate-700 text-slate-100 text-xs px-3 py-1 rounded-full transition-colors font-medium border border-slate-600/50 shrink-0 flex items-center gap-1"
        >
          ❓ 4. Help / FAQ
        </button>
      </div>

      {/* Input controls container */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-slate-800 rounded-full px-4 py-2 flex items-center gap-2 border border-slate-700/50">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm placeholder-slate-400"
            placeholder={isRecording ? "Recording voice order simulation..." : "Type WhatsApp message..."}
            disabled={isRecording}
          />
          <button 
            type="button" 
            onClick={handleMicClick}
            className={`p-1.5 rounded-full transition-colors ${isRecording ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            title="Simulate WhatsApp Voice Message"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={!inputText.trim()}
          className={`p-3 rounded-full flex items-center justify-center shadow-md transition-all ${
            inputText.trim() 
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 active:scale-95' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
