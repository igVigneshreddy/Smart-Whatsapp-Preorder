import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Define basic interface matching types.ts
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  inventory: number;
  popularity: number;
  isAvailable: boolean;
  imageUrl?: string;
}

interface FoodStall {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  preparationTimeEst: number;
  menu: MenuItem[];
  busySlots: string[];
}

interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  stallId: string;
  stallName: string;
  registrationNumber: string;
  items: OrderItem[];
  totalAmount: number;
  pickupTime: string;
  pickupDate: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Collected' | 'Cancelled';
  estimatedReadyTime: string;
  createdAt: string;
  paymentStatus: 'Pending' | 'Paid';
  paymentMethod: 'UPI' | 'Card' | 'Wallet';
  transactionId?: string;
  waitingTimeEstimation: number;
}

interface StudentProfile {
  registrationNumber: string;
  name: string;
  phone: string;
  balance: number;
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

interface DBState {
  stalls: FoodStall[];
  orders: Order[];
  students: StudentProfile[];
  faq: { question: string; answer: string }[];
  chats: StudentChat[];
}

// Initial Mock Data
const INITIAL_DB: DBState = {
  stalls: [
    {
      id: "stall-1",
      name: "Spice Junction",
      cuisine: "North Indian & Mughlai",
      rating: 4.6,
      preparationTimeEst: 15,
      busySlots: ["12:00 PM", "12:30 PM", "1:00 PM"],
      menu: [
        { id: "item-101", name: "Veg Biryani", price: 120, category: "Rice", description: "Fragrant basmati rice cooked with saffron, fresh vegetables, and mint, served with raita.", inventory: 15, popularity: 4.5, isAvailable: true },
        { id: "item-102", name: "Butter Chicken & Naan", price: 180, category: "Curry", description: "Tender roasted chicken cooked in creamy, spiced tomato butter gravy, served with fresh garlic naan.", inventory: 10, popularity: 4.9, isAvailable: true },
        { id: "item-103", name: "Paneer Butter Masala", price: 150, category: "Curry", description: "Soft cottage cheese cubes in rich cashew-tomato onion gravy with cream.", inventory: 12, popularity: 4.4, isAvailable: true },
        { id: "item-104", name: "Samosa (2 pcs)", price: 40, category: "Snacks", description: "Crispy fried puff pastries stuffed with mildly spiced potato and peas filler.", inventory: 30, popularity: 4.2, isAvailable: true }
      ]
    },
    {
      id: "stall-2",
      name: "The Burger Club",
      cuisine: "Fast Food & Burgers",
      rating: 4.4,
      preparationTimeEst: 10,
      busySlots: ["1:00 PM", "1:30 PM", "4:30 PM"],
      menu: [
        { id: "item-201", name: "Veg Burger", price: 80, category: "Burgers", description: "Crispy veggie patty with lettuce, tomatoes, onions, and melted cheese, topped with custom club sauce.", inventory: 20, popularity: 4.7, isAvailable: true },
        { id: "item-202", name: "Cheese Burger", price: 110, category: "Burgers", description: "Premium vegetable patty loaded with double cheddar cheese slices, spicy jalapenos, and direct mustard garlic aioli.", inventory: 15, popularity: 4.5, isAvailable: true },
        { id: "item-203", name: "Chicken Club Burger", price: 130, category: "Burgers", description: "Crumb-fried chicken patty with cheese, tomato, and sweet-chili mayonnaise.", inventory: 12, popularity: 4.6, isAvailable: true },
        { id: "item-204", name: "French Fries", price: 60, category: "Snacks", description: "Salted golden french fries, crispy on the outside and fluffy on the inside.", inventory: 25, popularity: 4.3, isAvailable: true }
      ]
    },
    {
      id: "stall-3",
      name: "Café Delights",
      cuisine: "Beverages & Desserts",
      rating: 4.5,
      preparationTimeEst: 5,
      busySlots: ["12:30 PM", "1:00 PM", "3:30 PM", "4:00 PM"],
      menu: [
        { id: "item-301", name: "Cold Coffee", price: 70, category: "Beverages", description: "Thick whipped cold coffee made with rich roast espresso and cold milk, topped with chocolate syrup.", inventory: 25, popularity: 4.8, isAvailable: true },
        { id: "item-302", name: "Masala Chai", price: 20, category: "Beverages", description: "Freshly brewed hot tea with milk, fresh ginger, cardamom, clove, and cinnamon.", inventory: 40, popularity: 4.9, isAvailable: true },
        { id: "item-303", name: "Chocolate Brownie", price: 90, category: "Dessert", description: "Fudgy, dense chocolate brownie served warm with chocolate sauce glaze.", inventory: 12, popularity: 4.6, isAvailable: true },
        { id: "item-304", name: "Paneer Patty Puff", price: 45, category: "Snacks", description: "Flaky puff pastry filled with delicious spicy cottage cheese scrambles.", inventory: 15, popularity: 4.1, isAvailable: true }
      ]
    },
    {
      id: "stall-4",
      name: "Green Bowl",
      cuisine: "Salads & Healthy Food",
      rating: 4.7,
      preparationTimeEst: 8,
      busySlots: ["12:00 PM", "1:00 PM"],
      menu: [
        { id: "item-401", name: "Paneer Salad", price: 130, category: "Salads", description: "High protein fresh salad made of grilled herbed paneer, cucumber, tomatoes, bell peppers, olives, and vinaigrette.", inventory: 10, popularity: 4.4, isAvailable: true },
        { id: "item-402", name: "Fruit Platter", price: 100, category: "Fruits", description: "Freshly chopped seasonal fruits including pineapple, papaya, watermelon, apple, kiwi, and pomegranate seeds.", inventory: 15, popularity: 4.5, isAvailable: true },
        { id: "item-403", name: "Detox Green Juice", price: 80, category: "Beverages", description: "Freshly cold-pressed juice from spinach, celery, green apple, cucumber, mint, and lemon.", inventory: 20, popularity: 4.2, isAvailable: true }
      ]
    }
  ],
  orders: [
    {
      id: "ORD-12345",
      stallId: "stall-2",
      stallName: "The Burger Club",
      registrationNumber: "12201948",
      items: [
        { itemId: "item-201", name: "Veg Burger", price: 80, quantity: 1 },
        { itemId: "item-301", name: "Cold Coffee", price: 70, quantity: 1 }
      ],
      totalAmount: 150,
      pickupTime: "1:00 PM",
      pickupDate: new Date().toISOString().split('T')[0],
      status: "Collected",
      estimatedReadyTime: "12:55 PM",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      paymentStatus: "Paid",
      paymentMethod: "Wallet",
      transactionId: "TXN-WAL-99482",
      waitingTimeEstimation: 15
    },
    {
      id: "ORD-54321",
      stallId: "stall-1",
      stallName: "Spice Junction",
      registrationNumber: "12202025",
      items: [
        { itemId: "item-101", name: "Veg Biryani", price: 120, quantity: 1 }
      ],
      totalAmount: 120,
      pickupTime: "12:30 PM",
      pickupDate: new Date().toISOString().split('T')[0],
      status: "Preparing",
      estimatedReadyTime: "12:20 PM",
      createdAt: new Date(Date.now() - 600000).toISOString(),
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      transactionId: "TXN-UPI-87201",
      waitingTimeEstimation: 12
    }
  ],
  students: [
    { registrationNumber: "12201948", name: "Vignesh Reddy", phone: "+91 9876543210", balance: 500.00 },
    { registrationNumber: "12202025", name: "Aarav Sharma", phone: "+91 9123456789", balance: 150.00 },
    { registrationNumber: "12204432", name: "Priya Patel", phone: "+91 8877665544", balance: 75.00 }
  ],
  faq: [
    { question: "How can I modify or cancel my order?", answer: "You can modify or cancel your pre-booked order through WhatsApp or our dashboard up to 20 minutes before your scheduled pickup time. Cancellations will refund the money instantly to your wallet." },
    { question: "What is the pre-booking window?", answer: "Students can schedule meals up to 24 hours in advance. Orders must be scheduled at least 15 minutes before the break time to allow vendors sufficient preparation time." },
    { question: "How does waiting time estimation work?", answer: "Our system analyzes the queue size (the number of orders currently 'Preparing' at that stall) and the stall's default preparation speed to estimate exactly when your food will be ready." },
    { question: "How do I pick up my food?", answer: "Once your order status changes to 'Ready' on your WhatsApp or Dashboard, proceed directly to the selected Stall's Express Counter and show your Order ID to collect your hot meal instantly without standing in lines!" },
    { question: "Are my payments secure?", answer: "Yes, our integrated payment gateways utilize bank-grade encryption with multi-factor authentication (UPI/NetBanking/Card support) for immediate order confirmations." }
  ],
  chats: []
};

// Database helper functions (Synchronous file writing for absolute safety)
function backupToMySQL(state: DBState) {
  try {
    const backupFile = path.join(process.cwd(), "backup.sql");
    let sql = `-- MySQL Backup Dump\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`;
    sql += `CREATE DATABASE IF NOT EXISTS campus_food_prebooking;\n`;
    sql += `USE campus_food_prebooking;\n\n`;

    // Drop tables in reverse order of foreign keys
    sql += `DROP TABLE IF EXISTS chat_messages;\n`;
    sql += `DROP TABLE IF EXISTS order_items;\n`;
    sql += `DROP TABLE IF EXISTS orders;\n`;
    sql += `DROP TABLE IF EXISTS students;\n`;
    sql += `DROP TABLE IF EXISTS menu_items;\n`;
    sql += `DROP TABLE IF EXISTS stalls;\n\n`;

    // stalls table
    sql += `CREATE TABLE stalls (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  name VARCHAR(100) NOT NULL,\n`;
    sql += `  cuisine VARCHAR(100) NOT NULL,\n`;
    sql += `  rating DECIMAL(3, 2),\n`;
    sql += `  preparation_time_est INT,\n`;
    sql += `  busy_slots TEXT\n`;
    sql += `);\n\n`;

    // menu_items table
    sql += `CREATE TABLE menu_items (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  stall_id VARCHAR(50),\n`;
    sql += `  name VARCHAR(100) NOT NULL,\n`;
    sql += `  price DECIMAL(10, 2) NOT NULL,\n`;
    sql += `  category VARCHAR(50),\n`;
    sql += `  description TEXT,\n`;
    sql += `  inventory INT,\n`;
    sql += `  popularity DECIMAL(3, 2),\n`;
    sql += `  is_available BOOLEAN,\n`;
    sql += `  FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE CASCADE\n`;
    sql += `);\n\n`;

    // students table
    sql += `CREATE TABLE students (\n`;
    sql += `  registration_number VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  name VARCHAR(100) NOT NULL,\n`;
    sql += `  phone VARCHAR(20) NOT NULL,\n`;
    sql += `  balance DECIMAL(10, 2) DEFAULT 0.00\n`;
    sql += `);\n\n`;

    // orders table
    sql += `CREATE TABLE orders (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  stall_id VARCHAR(50),\n`;
    sql += `  stall_name VARCHAR(100) NOT NULL,\n`;
    sql += `  registration_number VARCHAR(50),\n`;
    sql += `  total_amount DECIMAL(10, 2) NOT NULL,\n`;
    sql += `  pickup_time VARCHAR(20) NOT NULL,\n`;
    sql += `  pickup_date DATE NOT NULL,\n`;
    sql += `  status VARCHAR(20) NOT NULL,\n`;
    sql += `  estimated_ready_time VARCHAR(20),\n`;
    sql += `  created_at VARCHAR(50) NOT NULL,\n`;
    sql += `  payment_status VARCHAR(20) NOT NULL,\n`;
    sql += `  payment_method VARCHAR(20) NOT NULL,\n`;
    sql += `  transaction_id VARCHAR(50),\n`;
    sql += `  waiting_time_estimation INT,\n`;
    sql += `  FOREIGN KEY (stall_id) REFERENCES stalls(id),\n`;
    sql += `  FOREIGN KEY (registration_number) REFERENCES students(registration_number)\n`;
    sql += `);\n\n`;

    // order_items table
    sql += `CREATE TABLE order_items (\n`;
    sql += `  id INT AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `  order_id VARCHAR(50),\n`;
    sql += `  item_id VARCHAR(50),\n`;
    sql += `  name VARCHAR(100) NOT NULL,\n`;
    sql += `  price DECIMAL(10, 2) NOT NULL,\n`;
    sql += `  quantity INT NOT NULL,\n`;
    sql += `  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE\n`;
    sql += `);\n\n`;

    // chat_messages table
    sql += `CREATE TABLE chat_messages (\n`;
    sql += `  id VARCHAR(100) PRIMARY KEY,\n`;
    sql += `  registration_number VARCHAR(50),\n`;
    sql += `  sender VARCHAR(20) NOT NULL,\n`;
    sql += `  text TEXT NOT NULL,\n`;
    sql += `  timestamp VARCHAR(20) NOT NULL,\n`;
    sql += `  metadata TEXT\n`;
    sql += `);\n\n`;

    // Escape string helper to prevent SQL injection in dump
    const escapeSQL = (val: any) => {
      if (val === null || val === undefined) return "NULL";
      if (typeof val === "boolean") return val ? "1" : "0";
      if (typeof val === "number") return val.toString();
      const escaped = String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      return `'${escaped}'`;
    };

    // Insert stalls
    if (state.stalls && state.stalls.length > 0) {
      sql += `-- Inserting food stalls\n`;
      state.stalls.forEach(stall => {
        const busySlotsStr = stall.busySlots ? stall.busySlots.join(",") : "";
        sql += `INSERT INTO stalls (id, name, cuisine, rating, preparation_time_est, busy_slots) VALUES (${escapeSQL(stall.id)}, ${escapeSQL(stall.name)}, ${escapeSQL(stall.cuisine)}, ${escapeSQL(stall.rating)}, ${escapeSQL(stall.preparationTimeEst)}, ${escapeSQL(busySlotsStr)});\n`;
      });
      sql += `\n`;

      // Insert menu items
      sql += `-- Inserting menu items\n`;
      state.stalls.forEach(stall => {
        if (stall.menu && stall.menu.length > 0) {
          stall.menu.forEach(item => {
            sql += `INSERT INTO menu_items (id, stall_id, name, price, category, description, inventory, popularity, is_available) VALUES (${escapeSQL(item.id)}, ${escapeSQL(stall.id)}, ${escapeSQL(item.name)}, ${escapeSQL(item.price)}, ${escapeSQL(item.category)}, ${escapeSQL(item.description)}, ${escapeSQL(item.inventory)}, ${escapeSQL(item.popularity)}, ${escapeSQL(item.isAvailable)});\n`;
          });
        }
      });
      sql += `\n`;
    }

    // Insert students
    if (state.students && state.students.length > 0) {
      sql += `-- Inserting students\n`;
      state.students.forEach(student => {
        sql += `INSERT INTO students (registration_number, name, phone, balance) VALUES (${escapeSQL(student.registrationNumber)}, ${escapeSQL(student.name)}, ${escapeSQL(student.phone)}, ${escapeSQL(student.balance)});\n`;
      });
      sql += `\n`;
    }

    // Insert orders and order items
    if (state.orders && state.orders.length > 0) {
      sql += `-- Inserting orders and order items\n`;
      state.orders.forEach(order => {
        sql += `INSERT INTO orders (id, stall_id, stall_name, registration_number, total_amount, pickup_time, pickup_date, status, estimated_ready_time, created_at, payment_status, payment_method, transaction_id, waiting_time_estimation) VALUES (${escapeSQL(order.id)}, ${escapeSQL(order.stallId)}, ${escapeSQL(order.stallName)}, ${escapeSQL(order.registrationNumber)}, ${escapeSQL(order.totalAmount)}, ${escapeSQL(order.pickupTime)}, ${escapeSQL(order.pickupDate)}, ${escapeSQL(order.status)}, ${escapeSQL(order.estimatedReadyTime)}, ${escapeSQL(order.createdAt)}, ${escapeSQL(order.paymentStatus)}, ${escapeSQL(order.paymentMethod)}, ${escapeSQL(order.transactionId)}, ${escapeSQL(order.waitingTimeEstimation)});\n`;
        
        if (order.items && order.items.length > 0) {
          order.items.forEach(it => {
            sql += `INSERT INTO order_items (order_id, item_id, name, price, quantity) VALUES (${escapeSQL(order.id)}, ${escapeSQL(it.itemId)}, ${escapeSQL(it.name)}, ${escapeSQL(it.price)}, ${escapeSQL(it.quantity)});\n`;
          });
        }
      });
      sql += `\n`;
    }

    // Insert chat history
    if (state.chats && state.chats.length > 0) {
      sql += `-- Inserting chat messages\n`;
      state.chats.forEach(chat => {
        if (chat.messages && chat.messages.length > 0) {
          chat.messages.forEach(msg => {
            const metaStr = msg.metadata ? JSON.stringify(msg.metadata) : "";
            sql += `INSERT INTO chat_messages (id, registration_number, sender, text, timestamp, metadata) VALUES (${escapeSQL(msg.id)}, ${escapeSQL(chat.registrationNumber)}, ${escapeSQL(msg.sender)}, ${escapeSQL(msg.text)}, ${escapeSQL(msg.timestamp)}, ${escapeSQL(metaStr)});\n`;
          });
        }
      });
      sql += `\n`;
    }

    fs.writeFileSync(backupFile, sql, "utf8");
  } catch (err) {
    console.error("Failed to generate MySQL backup:", err);
  }
}

function getDBState(): DBState {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf8");
      backupToMySQL(INITIAL_DB);
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const backupFile = path.join(process.cwd(), "backup.sql");
    if (!fs.existsSync(backupFile)) {
      backupToMySQL(parsed);
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file, returning default memory:", err);
    return INITIAL_DB;
  }
}

function saveDBState(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf8");
    backupToMySQL(state);
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

function logChatMessage(reg: string, sender: 'student' | 'chatbot', text: string, metadata?: any) {
  try {
    const state = getDBState();
    if (!state.chats) {
      state.chats = [];
    }
    const student = state.students.find(s => s.registrationNumber === reg);
    const studentName = student ? student.name : "Guest Student";
    const regKey = reg || "guest";
    
    let chat = state.chats.find(c => c.registrationNumber === regKey);
    if (!chat) {
      chat = {
        registrationNumber: regKey,
        studentName,
        messages: [],
        lastMessageAt: new Date().toISOString()
      };
      state.chats.push(chat);
    }
    
    chat.messages.push({
      id: `${sender}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata
    });
    chat.lastMessageAt = new Date().toISOString();
    
    // Cap messages per chat to 50 to avoid bloated db.json
    if (chat.messages.length > 50) {
      chat.messages.shift();
    }
    
    saveDBState(state);
  } catch (err) {
    console.error("Error logging chat message to db:", err);
  }
}

// Lazy Gemini API Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please define it in the Secrets panel in Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// Middleware
app.use(express.json());

// API: Get all food stalls and menus
app.get("/api/stalls", (req, res) => {
  const state = getDBState();
  res.json(state.stalls);
});

// API: Manage stalls (Admin - Add/Update item)
app.post("/api/stalls/items", (req, res) => {
  const { stallId, item } = req.body;
  if (!stallId || !item) {
    return res.status(400).json({ error: "Missing stallId or item data" });
  }

  const state = getDBState();
  const stallIndex = state.stalls.findIndex(s => s.id === stallId);
  if (stallIndex === -1) {
    return res.status(404).json({ error: "Stall not found" });
  }

  const stall = state.stalls[stallIndex];
  const itemIndex = stall.menu.findIndex(m => m.id === item.id);

  if (itemIndex > -1) {
    // Update existing item
    stall.menu[itemIndex] = { ...stall.menu[itemIndex], ...item };
  } else {
    // Add new item
    const newItem: MenuItem = {
      id: item.id || `item-${Date.now()}`,
      name: item.name,
      price: Number(item.price),
      category: item.category || "General",
      description: item.description || "",
      inventory: Number(item.inventory) || 10,
      popularity: item.popularity || 4.0,
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true
    };
    stall.menu.push(newItem);
  }

  saveDBState(state);
  res.json({ success: true, stalls: state.stalls });
});

// API: Delete menu item (Admin)
app.delete("/api/stalls/items/:stallId/:itemId", (req, res) => {
  const { stallId, itemId } = req.params;
  const state = getDBState();
  const stall = state.stalls.find(s => s.id === stallId);
  if (!stall) {
    return res.status(404).json({ error: "Stall not found" });
  }

  const itemIndex = stall.menu.findIndex(m => m.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Menu item not found" });
  }

  stall.menu.splice(itemIndex, 1);
  saveDBState(state);
  res.json({ success: true, stalls: state.stalls });
});

// API: Get student profile
app.get("/api/students/:reg", (req, res) => {
  const reg = req.params.reg;
  const state = getDBState();
  const student = state.students.find(s => s.registrationNumber === reg);
  if (!student) {
    return res.status(404).json({ error: "Student profile not found" });
  }
  res.json(student);
});

// API: Register student
app.post("/api/students", (req, res) => {
  const { registrationNumber, name, phone } = req.body;
  if (!registrationNumber || !name) {
    return res.status(400).json({ error: "Registration number and name are required." });
  }

  const state = getDBState();
  const existing = state.students.find(s => s.registrationNumber === registrationNumber);
  if (existing) {
    return res.json(existing);
  }

  const newStudent: StudentProfile = {
    registrationNumber,
    name,
    phone: phone || "+91 9999999999",
    balance: 200.00 // Welcome credits
  };

  state.students.push(newStudent);
  saveDBState(state);
  res.status(201).json(newStudent);
});

// API: Add/Deduct balance
app.post("/api/students/balance", (req, res) => {
  const { registrationNumber, amount } = req.body;
  const state = getDBState();
  const student = state.students.find(s => s.registrationNumber === registrationNumber);
  if (!student) {
    return res.status(404).json({ error: "Student profile not found" });
  }

  student.balance = Number((student.balance + Number(amount)).toFixed(2));
  saveDBState(state);
  res.json(student);
});

// API: Get orders
app.get("/api/orders", (req, res) => {
  const state = getDBState();
  const reg = req.query.reg as string;
  if (reg) {
    const studentOrders = state.orders.filter(o => o.registrationNumber === reg);
    return res.json(studentOrders);
  }
  res.json(state.orders);
});

// API: Get chat histories
app.get("/api/chats", (req, res) => {
  const state = getDBState();
  res.json(state.chats || []);
});

// Helper: Estimate waiting time based on active queue size
function calculateWaitingTime(state: DBState, stallId: string): number {
  const activeOrders = state.orders.filter(o => o.stallId === stallId && (o.status === "Pending" || o.status === "Preparing"));
  const queueCount = activeOrders.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const stall = state.stalls.find(s => s.id === stallId);
  const basePrep = stall ? stall.preparationTimeEst : 10;
  // Queue optimization: basic queue queuing estimate
  return basePrep + queueCount * 2;
}

// Helper: Estimate Ready Time string based on current time or pickup time
function estimateReadyTime(pickupTime: string, prepTimeMin: number): string {
  // Let's assume the order is ready 5-10 minutes before the pickup time, or immediately
  try {
    // Simple format parse: e.g. "12:30 PM"
    const [time, modifier] = pickupTime.split(' ');
    let [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr);
    let minutes = parseInt(minutesStr);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes - 10); // Ready 10 minutes prior for pickup

    let endHours = date.getHours();
    let endMinutes = date.getMinutes();
    const endModifier = endHours >= 12 ? "PM" : "AM";
    if (endHours > 12) endHours -= 12;
    if (endHours === 0) endHours = 12;

    return `${endHours}:${endMinutes.toString().padStart(2, '0')} ${endModifier}`;
  } catch (e) {
    return pickupTime;
  }
}

// API: Create pre-booked order
app.post("/api/orders", (req, res) => {
  const { registrationNumber, stallId, items, pickupTime, paymentMethod } = req.body;
  if (!registrationNumber || !stallId || !items || !items.length || !pickupTime) {
    return res.status(400).json({ error: "Missing required booking details" });
  }

  const state = getDBState();
  const stall = state.stalls.find(s => s.id === stallId);
  if (!stall) {
    return res.status(404).json({ error: "Stall not found" });
  }

  const student = state.students.find(s => s.registrationNumber === registrationNumber);
  if (!student) {
    return res.status(404).json({ error: "Student not registered. Please register first." });
  }

  // Validate inventory
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const requestedItem of items) {
    const menuItem = stall.menu.find(m => m.id === requestedItem.itemId);
    if (!menuItem) {
      return res.status(400).json({ error: `Menu item ${requestedItem.name || requestedItem.itemId} not found` });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ error: `${menuItem.name} is currently out of stock` });
    }
    if (menuItem.inventory < requestedItem.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${menuItem.name}. Available: ${menuItem.inventory}` });
    }

    orderItems.push({
      itemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: requestedItem.quantity
    });

    totalAmount += menuItem.price * requestedItem.quantity;
  }

  // Process payment if paying via Wallet
  let paymentStatus: 'Pending' | 'Paid' = 'Pending';
  let transactionId = "";
  if (paymentMethod === "Wallet") {
    if (student.balance < totalAmount) {
      return res.status(400).json({ error: `Insufficient Wallet balance. Your balance: ₹${student.balance}, Order total: ₹${totalAmount}. Please recharge or choose another payment method.` });
    }
    student.balance = Number((student.balance - totalAmount).toFixed(2));
    paymentStatus = 'Paid';
    transactionId = `TXN-WAL-${Math.floor(10000 + Math.random() * 90000)}`;
  } else {
    // UPI or Card simulation (Immediate success for demo, but starting as Pending to allow mock gateway triggers)
    paymentStatus = 'Paid'; // Let's mark as paid instantly for smooth simulation
    transactionId = `TXN-${paymentMethod}-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  // Deduct inventory
  for (const requestedItem of items) {
    const menuItem = stall.menu.find(m => m.id === requestedItem.itemId)!;
    menuItem.inventory -= requestedItem.quantity;
  }

  const waitingTime = calculateWaitingTime(state, stallId);
  const readyEst = estimateReadyTime(pickupTime, waitingTime);

  const newOrder: Order = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    stallId,
    stallName: stall.name,
    registrationNumber,
    items: orderItems,
    totalAmount,
    pickupTime,
    pickupDate: new Date().toISOString().split('T')[0],
    status: "Pending",
    estimatedReadyTime: readyEst,
    createdAt: new Date().toISOString(),
    paymentStatus,
    paymentMethod,
    transactionId,
    waitingTimeEstimation: waitingTime
  };

  state.orders.unshift(newOrder);
  saveDBState(state);
  res.status(201).json({ success: true, order: newOrder, balance: student.balance });
});

// API: Update order status (Admin)
app.patch("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const state = getDBState();
  const order = state.orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (status) {
    // If order was cancelled, restore inventory
    if (status === "Cancelled" && order.status !== "Cancelled") {
      const stall = state.stalls.find(s => s.id === order.stallId);
      if (stall) {
        for (const item of order.items) {
          const menuItem = stall.menu.find(m => m.id === item.itemId);
          if (menuItem) {
            menuItem.inventory += item.quantity;
          }
        }
      }
      // Refund if paid by wallet
      if (order.paymentStatus === "Paid" && order.paymentMethod === "Wallet") {
        const student = state.students.find(s => s.registrationNumber === order.registrationNumber);
        if (student) {
          student.balance = Number((student.balance + order.totalAmount).toFixed(2));
        }
      }
    }
    order.status = status;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
    if (!order.transactionId) {
      order.transactionId = `TXN-${order.paymentMethod}-${Math.floor(10000 + Math.random() * 90000)}`;
    }
  }

  saveDBState(state);
  res.json({ success: true, order });
});

// API: Simulate payment checkout gateway
app.post("/api/pay", (req, res) => {
  const { orderId, paymentMethod } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  const state = getDBState();
  const order = state.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.paymentStatus = "Paid";
  order.paymentMethod = paymentMethod || "UPI";
  order.transactionId = `TXN-${order.paymentMethod}-${Math.floor(10000 + Math.random() * 90000)}`;

  saveDBState(state);
  res.json({ success: true, order });
});

// API: Get MySQL backup status
app.get("/api/backup/status", (req, res) => {
  try {
    const backupFile = path.join(process.cwd(), "backup.sql");
    if (fs.existsSync(backupFile)) {
      const stats = fs.statSync(backupFile);
      res.json({
        exists: true,
        sizeBytes: stats.size,
        lastModified: stats.mtime.toISOString(),
        filePath: "backup.sql"
      });
    } else {
      res.json({ exists: false });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Manually trigger MySQL backup
app.post("/api/backup/trigger", (req, res) => {
  try {
    const state = getDBState();
    backupToMySQL(state);
    const backupFile = path.join(process.cwd(), "backup.sql");
    const stats = fs.statSync(backupFile);
    res.json({
      success: true,
      sizeBytes: stats.size,
      lastModified: stats.mtime.toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Function declaration for Gemini Pre-Booking orders
const createOrderDeclaration = {
  name: "createPreBookedOrder",
  description: "Places a pre-booked canteen food order for the student when they confirm they want to pre-book specific food items.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      stallId: {
        type: Type.STRING,
        description: "The ID of the food stall, e.g., 'stall-1' for Spice Junction, 'stall-2' for The Burger Club, 'stall-3' for Café Delights, 'stall-4' for Green Bowl."
      },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            itemId: { type: Type.STRING, description: "The ID of the menu item to order, e.g., 'item-201'" },
            quantity: { type: Type.INTEGER, description: "The quantity of this menu item to pre-book (default is 1)" }
          },
          required: ["itemId", "quantity"]
        },
        description: "List of items with their quantities to pre-book."
      },
      pickupTime: {
        type: Type.STRING,
        description: "The requested pickup time, e.g., '12:30 PM', '1:00 PM', '1:30 PM'."
      },
      paymentMethod: {
        type: Type.STRING,
        description: "Payment method: 'Wallet', 'UPI', or 'Card'."
      }
    },
    required: ["stallId", "items", "pickupTime"]
  }
};

// Shared helper function to handle chat sessions for both Simulator and Twilio WhatsApp Bot
const twilioSessionRegNums: { [phone: string]: string } = {};
const twilioChatHistory: { [phone: string]: { sender: 'student' | 'chatbot'; text: string }[] } = {};

async function handleChatInput(
  message: string,
  registrationNumber: string | null,
  history: any[]
): Promise<{ reply: string; metadata?: any; error?: string }> {
  // Log student's incoming message in database chats
  logChatMessage(registrationNumber || "guest", 'student', message);

  const cleanMessage = message.trim().toLowerCase();
  const dbState = getDBState();
  const currentStudent = registrationNumber ? dbState.students.find(s => s.registrationNumber === registrationNumber) : null;

  // Let's create an instant rule-based match to bypass AI completely for standard interactive taps!
  // This reduces latency from ~2-3 seconds to <5ms!
  let instantReply: string | null = null;
  let instantMetadata: any = undefined;

  const greetings = ['hi', 'hello', 'hey', 'start', 'main menu', 'menu list', 'options', 'canteen'];
  if (greetings.includes(cleanMessage) || cleanMessage === 'help') {
    instantReply = `👋 *Welcome to LPU Smart Canteen Pre-Booking!* \n\nAvoid long queues and pre-book your meals from campus stalls in seconds.\n\nReply with a number below to navigate:\n1️⃣ *Pre-book Food* (Select a stall & start booking)\n2️⃣ *Browse Menus* (View digital menus & pricing)\n3️⃣ *Track Order* (Check preparation status)\n4️⃣ *FAQs & Support* (Get answers to common questions)\n\n💡 _Or simply chat with me, like: "Suggest a healthy breakfast under ₹100!"_`;
  } else if (cleanMessage === '1' || cleanMessage.includes('pre-book food') || cleanMessage.includes('prebook food')) {
    instantReply = `🍔 *Choose a Food Stall to Pre-book from:* \n\n${dbState.stalls.map((s, idx) => `*${idx + 1}.* *${s.name}* (Prep time: ~${s.preparationTimeEst} mins)\n   _Specialty:_ ${s.cuisine}`).join('\n\n')}\n\nSimply reply with the food item name (e.g., *Veg Burger* or *Chole Bhature*) that you want to pre-book!`;
    instantMetadata = {
      type: 'menu',
      data: dbState.stalls
    };
  } else if (cleanMessage === '2' || cleanMessage === 'view menu' || cleanMessage === 'menu' || cleanMessage === 'browse') {
    instantReply = `📋 *LPU Canteen Digital Menu* is loaded below! \nBrowse items across all active stalls: *Spice Junction*, *The Burger Club*, *Café Delights*, and *Green Bowl*.\n\nTap on any item inside the interactive card below to fill your booking chat!`;
    instantMetadata = {
      type: 'menu',
      data: dbState.stalls
    };
  } else if (cleanMessage === '3' || cleanMessage === 'track order' || cleanMessage === 'track' || cleanMessage === 'status') {
    const studentOrders = dbState.orders.filter(o => o.registrationNumber === registrationNumber);
    if (studentOrders.length > 0) {
      const latestOrder = studentOrders[0];
      instantReply = `📦 *Pre-booked Order Tracker:* \n\nOrder ID: *${latestOrder.id}*\nStall: *${latestOrder.stallName}*\nTotal Amount: *₹${latestOrder.totalAmount}*\nPayment Status: *${latestOrder.paymentStatus}*\nEstimated Ready Time: *${latestOrder.estimatedReadyTime}*\nLive Status: *${latestOrder.status.toUpperCase()}*`;
      instantMetadata = {
        type: 'status_track',
        data: latestOrder
      };
    } else {
      instantReply = `📦 *No active pre-booked orders found.* \n\nYou haven't placed any orders yet. Reply with *menu* to browse available campus foods!`;
    }
  } else if (cleanMessage === '4' || cleanMessage === 'help' || cleanMessage === 'faq') {
    instantReply = `❓ *Frequently Asked Questions & Support:*\n\n${dbState.faq.slice(0, 4).map(f => `*Q:* ${f.question}\n*A:* ${f.answer}`).join('\n\n')}`;
  } else if (cleanMessage.startsWith('i paid for order') || cleanMessage.includes('paid for order')) {
    const match = cleanMessage.match(/ord-\d+/);
    if (match) {
      const orderId = match[0].toUpperCase();
      const order = dbState.orders.find(o => o.id === orderId);
      if (order) {
        order.paymentStatus = 'Paid';
        order.paymentMethod = order.paymentMethod || 'UPI';
        order.transactionId = `TXN-WAP-${Math.floor(10000 + Math.random() * 90000)}`;
        saveDBState(dbState);
        
        instantReply = `... ✅ *Payment Received Successfully!* \n\nThank you! Your payment for order *${orderId}* of *₹${order.totalAmount}* has been verified.\n\nYour order is now in the *PENDING* queue and the canteen operator at *${order.stallName}* has been notified in real-time. You will receive an automatic status update as they prepare your food!`;
        instantMetadata = {
          type: 'status_track',
          data: order
        };
      }
    }
  } else if (cleanMessage.startsWith('i want to pre-book a') || cleanMessage.startsWith('i want to pre-book')) {
    const targetItemName = message.replace(/i want to pre-book a/i, '').replace(/i want to pre-book/i, '').trim().toLowerCase();
    
    let matchedItem: any = null;
    let matchedStall: any = null;
    
    for (const stall of dbState.stalls) {
      const item = stall.menu.find(m => m.name.toLowerCase() === targetItemName || targetItemName.includes(m.name.toLowerCase()));
      if (item) {
        matchedItem = item;
        matchedStall = stall;
        break;
      }
    }

    if (matchedItem && matchedStall) {
      if (!currentStudent) {
        instantReply = `⚠️ *Account Registration Required*\n\nTo pre-book *${matchedItem.name}*, please log in or provide your University Registration Number first (e.g., *12201948*).`;
      } else {
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const pickupTime = "1:00 PM"; // Default scheduled break slot
        const waitingTime = calculateWaitingTime(dbState, matchedStall.id);
        const readyEst = estimateReadyTime(pickupTime, waitingTime);
        
        let paymentStatus: 'Pending' | 'Paid' = 'Pending';
        let paymentMethod: 'Wallet' | 'UPI' | 'Card' = 'Wallet';
        let transactionId = "";

        if (currentStudent.balance >= matchedItem.price) {
          currentStudent.balance = Number((currentStudent.balance - matchedItem.price).toFixed(2));
          paymentStatus = 'Paid';
          paymentMethod = 'Wallet';
          transactionId = `TXN-WAL-${Math.floor(10000 + Math.random() * 90000)}`;
          
          matchedItem.inventory = Math.max(0, matchedItem.inventory - 1);
          matchedItem.isAvailable = matchedItem.inventory > 0;
        } else {
          paymentStatus = 'Pending';
          paymentMethod = 'UPI';
        }

        const newOrder: Order = {
          id: orderId,
          stallId: matchedStall.id,
          stallName: matchedStall.name,
          registrationNumber: currentStudent.registrationNumber,
          items: [{
            itemId: matchedItem.id,
            name: matchedItem.name,
            price: matchedItem.price,
            quantity: 1
          }],
          totalAmount: matchedItem.price,
          pickupTime,
          pickupDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          estimatedReadyTime: readyEst,
          createdAt: new Date().toISOString(),
          paymentStatus,
          paymentMethod,
          transactionId,
          waitingTimeEstimation: waitingTime
        };

        dbState.orders.unshift(newOrder);
        saveDBState(dbState);

        if (paymentStatus === 'Paid') {
          instantReply = `🎉 *Pre-Booking Confirmed Instantly!* \n\nYour order *${orderId}* has been placed successfully!\n\n🍱 *Stall:* ${matchedStall.name}\n🍛 *Item:* ${matchedItem.name} x1\n💰 *Total:* ₹${matchedItem.price} (Paid via LPU Student Wallet)\n⏰ *Estimated Ready Time:* ${readyEst} (Wait: ~${waitingTime} mins)\n\nNo lines for you! The canteen operator has received your order on their screen and is preparing it for your pickup slot.`;
        } else {
          instantReply = `📋 *Pre-Booking Created! (Payment Pending)*\n\nYour order *${orderId}* is reserved but requires payment to initiate preparation:\n\n🍱 *Stall:* ${matchedStall.name}\n🍛 *Item:* ${matchedItem.name} x1\n💰 *Amount Due:* ₹${matchedItem.price}\n\nPlease click the button below to complete secure payment via UPI/Card to instantly send this to the stall kitchen!`;
        }

        instantMetadata = {
          type: 'order_summary',
          data: newOrder
        };
      }
    }
  }

  if (instantReply) {
    logChatMessage(registrationNumber || "guest", 'chatbot', instantReply, instantMetadata);
    return { reply: instantReply, metadata: instantMetadata };
  }

  try {
    const client = getGeminiClient();
    const dbState = getDBState();

    // Context formatting to insert as system instructions or in-context reference
    const stallsContext = dbState.stalls.map(s => {
      const menuStr = s.menu.map(m => `- ${m.name} [ID: ${m.id}]: ₹${m.price} (${m.category}) - ${m.description} [Stock: ${m.inventory}]`).join("\n");
      return `STALL: "${s.name}" (ID: ${s.id})\nCuisine: ${s.cuisine}\nRating: ${s.rating}/5\nEst Prep Time: ${s.preparationTimeEst} mins\nBusy Times to Avoid: ${s.busySlots.join(", ")}\nMenu:\n${menuStr}`;
    }).join("\n\n");

    const currentStudent = registrationNumber ? dbState.students.find(s => s.registrationNumber === registrationNumber) : null;
    const studentContext = currentStudent 
      ? `Active Student: "${currentStudent.name}" (Reg: ${currentStudent.registrationNumber}, Phone: ${currentStudent.phone}, Wallet Balance: ₹${currentStudent.balance})`
      : `No active student identified yet. Prompt them to register or login using their University Registration Number (e.g. 12201948).`;

    const recentOrders = currentStudent
      ? dbState.orders.filter(o => o.registrationNumber === currentStudent.registrationNumber).slice(0, 3)
      : [];
    
    const ordersContext = recentOrders.length > 0
      ? `Recent Orders for ${currentStudent?.name}:\n` + recentOrders.map(o => `- Order ${o.id} from ${o.stallName}: ₹${o.totalAmount} status is ${o.status}. Scheduled for: ${o.pickupTime}. Est ready: ${o.estimatedReadyTime}`).join("\n")
      : "No recent pre-booked orders found.";

    const faqContext = dbState.faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

    const systemPrompt = `You are the "LPU Food Pre-Booking Assistant", an intelligent, polite, and helpful AI Chatbot integrated inside WhatsApp for the university food stalls pre-booking system.
Your goal is to help students browse menus, pre-book meals, check wait times, track orders, and answer general FAQs.

--- CURRENT DATABASE CONTEXT ---
${studentContext}

--- AVAILABLE FOOD STALLS & MENUS ---
${stallsContext}

--- STUDENT'S RECENT ORDERS ---
${ordersContext}

--- FREQUENTLY ASKED QUESTIONS (FAQ) ---
${faqContext}

--- CHATBOT BEHAVIOR RULES ---
1. Be incredibly friendly, concise, and helpful. Use emojis like 🍔, 🍛, 🥤, ⏰, 📦, ✅ appropriately to sound like a modern WhatsApp business agent.
2. If a student wants to pre-book food:
   - Identify which food item(s) they want and from which stall.
   - If they have not provided their University Registration Number yet, politely ask for it first: "To pre-book, please provide your University Registration Number so I can locate your account."
   - If they provide a registration number that isn't in our system, guide them to register in the workspace.
   - Prompt them to select a pickup time slot (e.g., 12:30 PM, 1:00 PM, 1:30 PM) and mention if their chosen slot is crowded/busy (refer to the stall's busy slots) and suggest less crowded times.
   - Summarize the order with prices and total. Ask them to confirm.
3. You MUST use the "createPreBookedOrder" tool to place a real order in the database when a student confirms they want to pre-book items.
4. Keep answers short and formatted with clean line breaks, just like a real WhatsApp message.
5. If they ask about order status, look up their recent orders. If they have a pending or preparing order, tell them the estimated ready time and waiting time estimate.
6. When recommend food, look at what items are highly popular (popularity >= 4.5).
7. If the food item they want is OUT OF STOCK (Stock = 0) or unavailable, suggest an alternative.

Keep the tone energetic, helpful, and focused on helping students bypass long lines!`;

    // Map conversation history
    const geminiContents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        geminiContents.push({
          role: h.sender === 'student' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    // Add current user message
    geminiContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Generate content using the proper gemini-3.5-flash model with tools enabled
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        tools: [{ functionDeclarations: [createOrderDeclaration] }]
      }
    });

    // Check if Gemini invoked the createPreBookedOrder tool
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "createPreBookedOrder") {
        const args = call.args as any;
        
        const stallId = args.stallId;
        const items = args.items;
        const pickupTime = args.pickupTime;
        const paymentMethod = args.paymentMethod || "Wallet";

        const state = getDBState();
        const stall = state.stalls.find(s => s.id === stallId);
        const student = state.students.find(s => s.registrationNumber === registrationNumber);

        if (!student) {
          const replyText = `⚠️ *Account Registration Required*\n\nPlease log in or provide your University Registration Number first (e.g., *12201948*) before pre-booking items!`;
          logChatMessage(registrationNumber || "guest", 'chatbot', replyText);
          return { reply: replyText };
        }

        if (stall) {
          const orderItems: any[] = [];
          let totalAmount = 0;
          let stockError = false;

          for (const reqItem of items) {
            const menuItem = stall.menu.find(m => m.id === reqItem.itemId);
            if (menuItem && menuItem.inventory >= reqItem.quantity && menuItem.isAvailable) {
              orderItems.push({
                itemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: reqItem.quantity
              });
              totalAmount += menuItem.price * reqItem.quantity;
            } else {
              stockError = true;
            }
          }

          if (stockError || orderItems.length === 0) {
            const replyText = `⚠️ *Stock Alert!* Some items in your selection are currently out of stock or unavailable. Please view the digital menu to select another item!`;
            const metadata = { type: 'menu', data: state.stalls };
            logChatMessage(registrationNumber || "guest", 'chatbot', replyText, metadata);
            return { reply: replyText, metadata };
          }

          let paymentStatus: 'Pending' | 'Paid' = 'Pending';
          let transactionId = "";
          let canPlace = true;

          if (paymentMethod === "Wallet") {
            if (student.balance >= totalAmount) {
              student.balance = Number((student.balance - totalAmount).toFixed(2));
              paymentStatus = 'Paid';
              transactionId = `TXN-WAL-${Math.floor(10000 + Math.random() * 90000)}`;
            } else {
              canPlace = false;
            }
          } else {
            paymentStatus = 'Paid'; // Immediate UPI/Card simulation
            transactionId = `TXN-${paymentMethod}-${Math.floor(10000 + Math.random() * 90000)}`;
          }

          if (!canPlace) {
            paymentStatus = 'Pending';
          }

          // Deduct stock
          for (const reqItem of items) {
            const menuItem = stall.menu.find(m => m.id === reqItem.itemId);
            if (menuItem) {
              menuItem.inventory = Math.max(0, menuItem.inventory - reqItem.quantity);
              menuItem.isAvailable = menuItem.inventory > 0;
            }
          }

          const waitingTime = calculateWaitingTime(state, stallId);
          const readyEst = estimateReadyTime(pickupTime, waitingTime);

          const newOrder: Order = {
            id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
            stallId,
            stallName: stall.name,
            registrationNumber: registrationNumber!,
            items: orderItems,
            totalAmount,
            pickupTime,
            pickupDate: new Date().toISOString().split('T')[0],
            status: "Pending",
            estimatedReadyTime: readyEst,
            createdAt: new Date().toISOString(),
            paymentStatus,
            paymentMethod,
            transactionId,
            waitingTimeEstimation: waitingTime
          };

          state.orders.unshift(newOrder);
          saveDBState(state);

          let replyText = "";
          if (paymentStatus === 'Paid') {
            replyText = `🎉 *Pre-Booking Placed Successfully!* \n\nYour order *${newOrder.id}* has been sent to *${stall.name}* kitchen.\n\n🍱 *Stall:* ${stall.name}\n🍛 *Items:* \n${orderItems.map(it => `- ${it.name} x${it.quantity}`).join('\n')}\n💰 *Total Amount:* ₹${totalAmount} (Paid via Wallet)\n⏰ *Estimated Ready:* ${readyEst} (Wait: ~${waitingTime} mins)\n\nYou can track the real-time preparation status directly at the top of your chat! Enjoy!`;
          } else {
            replyText = `📋 *Pre-Booking Order Created! (Payment Pending)* \n\nYour pre-booking *${newOrder.id}* is reserved. Please pay *₹${totalAmount}* to send the order to the kitchen:\n\n🍱 *Stall:* ${stall.name}\n🍛 *Items:* \n${orderItems.map(it => `- ${it.name} x${it.quantity}`).join('\n')}\n💰 *Amount:* ₹${totalAmount}\n\nTap the button below to complete secure checkout!`;
          }

          const metadata = {
            type: 'order_summary',
            data: newOrder
          };
          logChatMessage(registrationNumber || "guest", 'chatbot', replyText, metadata);
          return { reply: replyText, metadata };
        }
      }
    }

    const aiText = response.text || "I apologize, I'm having trouble processing that request right now. Please select an option from our menu!";
    let metadata: any = undefined;
    const lowerText = aiText.toLowerCase();

    if (lowerText.includes("pre-booked") || lowerText.includes("successfully pre-booked") || lowerText.includes("order id:")) {
      const latestOrder = dbState.orders[0];
      if (latestOrder && latestOrder.registrationNumber === registrationNumber) {
        metadata = {
          type: 'order_summary',
          data: latestOrder
        };
      }
    } else if (lowerText.includes("menu") || lowerText.includes("browse") || lowerText.includes("price")) {
      metadata = {
        type: 'menu',
        data: dbState.stalls
      };
    } else if (lowerText.includes("pickup time") || lowerText.includes("select a pickup time") || lowerText.includes("time slot")) {
      metadata = {
        type: 'slots',
        data: { slots: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"] }
      };
    } else if (lowerText.includes("track") || lowerText.includes("order status") || lowerText.includes("estimated ready time")) {
      const activeOrder = dbState.orders.find(o => o.registrationNumber === registrationNumber);
      if (activeOrder) {
        metadata = {
          type: 'status_track',
          data: activeOrder
        };
      }
    }

    logChatMessage(registrationNumber || "guest", 'chatbot', aiText, metadata);
    return { reply: aiText, metadata };

  } catch (error: any) {
    console.error("Gemini API error in handleChatInput:", error);
    const replyText = `⚠️ *Assistant Status: Offline mode*\n\nI am currently operating in offline mode because the Gemini API Key is not configured yet. \n\n*How to enable the AI Chatbot:*\nGo to the **Settings > Secrets** panel in AI Studio and make sure your \`GEMINI_API_KEY\` is provided! \n\nIn the meantime, you can use the quick-actions buttons or manually simulate food bookings from the web dashboard panel!`;
    logChatMessage(registrationNumber || "guest", 'chatbot', replyText);
    return { reply: replyText, error: error.message };
  }
}

// 1. Web Simulator Chat API (uses the handleChatInput helper)
app.post("/api/chat", async (req, res) => {
  const { message, registrationNumber, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const result = await handleChatInput(message, registrationNumber, history);
  res.json(result);
});

// 2. Twilio WhatsApp Webhook Gateway Endpoint
app.post("/webhook/twilio", express.urlencoded({ extended: false }), async (req, res) => {
  const incomingNumber = req.body.From; // e.g., "whatsapp:+919876543210"
  const messageText = req.body.Body; // e.g., "12201948" or "menu"

  if (!incomingNumber || !messageText) {
    res.type('text/xml');
    res.send(`<Response><Message>⚠️ Invalid Webhook Request: Missing parameters.</Message></Response>`);
    return;
  }

  // Normalize phone number to digits only (e.g., "919876543210")
  const rawPhone = incomingNumber.replace("whatsapp:", "").replace(/\D/g, "");

  const dbState = getDBState();
  let regNum = twilioSessionRegNums[rawPhone] || "";

  // A. Link student profile phone number by matching 8-digit registration input
  const regMatch = messageText.trim().match(/^\d{8}$/);
  if (regMatch) {
    const targetReg = regMatch[0];
    const student = dbState.students.find(s => s.registrationNumber === targetReg);
    if (student) {
      // Link the phone number to this student profile in the database
      student.phone = "+" + rawPhone;
      saveDBState(dbState);
      twilioSessionRegNums[rawPhone] = targetReg;

      res.type('text/xml');
      res.send(`
        <Response>
          <Message>✅ *WhatsApp Account Linked Successfully!*\n\nHello *${student.name}*, your WhatsApp is now linked to your student profile (Reg: *${targetReg}*).\nYour balance is *₹${student.balance}*.\n\nReply with a number below to navigate:\n1️⃣ *Pre-book Food*\n2️⃣ *Browse Menus*\n3️⃣ *Track Order*\n4️⃣ *FAQs & Support*</Message>
        </Response>
      `);
      return;
    }
  }

  // B. Look up registration number in db.json if not in session cache
  if (!regNum && dbState.students) {
    const student = dbState.students.find(s => {
      const cleanDbPhone = s.phone.replace(/\D/g, "");
      return rawPhone.endsWith(cleanDbPhone);
    });
    if (student) {
      regNum = student.registrationNumber;
      twilioSessionRegNums[rawPhone] = regNum;
    }
  }

  // C. Process chatbot message using the shared helper
  const history = twilioChatHistory[rawPhone] || [];
  const result = await handleChatInput(messageText, regNum || null, history);

  // Update history session
  if (!twilioChatHistory[rawPhone]) {
    twilioChatHistory[rawPhone] = [];
  }
  twilioChatHistory[rawPhone].push({ sender: 'student', text: messageText });
  twilioChatHistory[rawPhone].push({ sender: 'chatbot', text: result.reply });

  // Cap history at 10 items
  if (twilioChatHistory[rawPhone].length > 10) {
    twilioChatHistory[rawPhone] = twilioChatHistory[rawPhone].slice(-10);
  }

  // Respond with TwiML XML
  res.type('text/xml');
  res.send(`
    <Response>
      <Message>${result.reply}</Message>
    </Response>
  `);
});

// Setup Vite Dev server or Serve build in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Food Pre-Booking Backend listening at http://localhost:${PORT}`);
  });
}

startServer();
