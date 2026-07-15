export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  inventory: number;
  popularity: number; // 1-5 scale
  isAvailable: boolean;
  imageUrl?: string;
}

export interface FoodStall {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  preparationTimeEst: number; // in minutes
  menu: MenuItem[];
  busySlots: string[]; // List of hours that are crowded (e.g., "12:00", "12:30")
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Collected' | 'Cancelled';

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  stallId: string;
  stallName: string;
  registrationNumber: string; // University ID
  items: OrderItem[];
  totalAmount: number;
  pickupTime: string; // e.g. "12:30 PM"
  pickupDate: string; // YYYY-MM-DD
  status: OrderStatus;
  estimatedReadyTime: string; // e.g. "12:20 PM"
  createdAt: string;
  paymentStatus: 'Pending' | 'Paid';
  paymentMethod: 'UPI' | 'Card' | 'Wallet';
  transactionId?: string;
  waitingTimeEstimation: number; // in minutes
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'chatbot';
  text: string;
  timestamp: string;
  metadata?: {
    type?: 'menu' | 'stalls' | 'order_summary' | 'help' | 'status_track' | 'slots';
    data?: any;
  };
}

export interface StudentProfile {
  registrationNumber: string;
  name: string;
  phone: string;
  balance: number;
}
