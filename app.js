// Smart WhatsApp Food Pre-Booking System - JavaScript Application

// Initial Seed Data from Excel Sheets (Nepali Swadh & Pakka Adda)
const defaultStalls = [
  {
    id: 'stall_nepali_swadh',
    name: 'Nepali Swadh',
    vendorId: 'vendor1',
    vendorPass: 'pass123',
    upiId: 'nepaliswadh@lpu.upi',
    bankAccount: 'SBI - Acc #392810192 (Direct Vendor)',
    qrImage: 'QR.jpeg',
    menu: [
      // Fries
      { id: 'ns_1', category: 'Fries', name: 'Salted Fries', price: 60, available: true },
      { id: 'ns_2', category: 'Fries', name: 'Peri Peri Fries', price: 60, available: true },
      { id: 'ns_3', category: 'Fries', name: 'Tandoori Fries', price: 80, available: true },
      { id: 'ns_4', category: 'Fries', name: 'Masala Fries', price: 60, available: true },
      { id: 'ns_5', category: 'Fries', name: 'Normal Cheese Fries', price: 60, available: true },
      { id: 'ns_6', category: 'Fries', name: 'Cheese Baked Fries', price: 60, available: true },
      { id: 'ns_7', category: 'Fries', name: 'Cheese Creamy Fries', price: 60, available: true },
      { id: 'ns_8', category: 'Fries', name: 'Tandoori Malai Fries', price: 60, available: true },
      { id: 'ns_9', category: 'Fries', name: 'Honey Chilly Potato', price: 80, available: true },
      { id: 'ns_10', category: 'Fries', name: 'Chilly Potato', price: 80, available: true },
      // Thukpa
      { id: 'ns_11', category: 'Thukpa', name: 'Veg Thukpa', price: 50, available: true },
      { id: 'ns_12', category: 'Thukpa', name: 'Paneer Thukpa', price: 70, available: true },
      { id: 'ns_13', category: 'Thukpa', name: 'Mushroom Thukpa', price: 70, available: true },
      { id: 'ns_14', category: 'Thukpa', name: 'Sesma Thukpa', price: 70, available: true },
      { id: 'ns_15', category: 'Thukpa', name: 'Mix Thukpa', price: 80, available: true },
      // Noodles
      { id: 'ns_16', category: 'Noodles', name: 'Veg Noodles', price: 80, available: true },
      { id: 'ns_17', category: 'Noodles', name: 'Corn Noodles', price: 70, available: true },
      { id: 'ns_18', category: 'Noodles', name: 'Keema Noodles', price: 70, available: true },
      { id: 'ns_19', category: 'Noodles', name: 'Paneer Noodles', price: 80, available: true },
      { id: 'ns_20', category: 'Noodles', name: 'Mushroom Noodles', price: 80, available: true },
      { id: 'ns_21', category: 'Noodles', name: 'Mix Noodles', price: 80, available: true },
      { id: 'ns_22', category: 'Noodles', name: 'Paneer Chilli Noodles', price: 80, available: true },
      { id: 'ns_23', category: 'Noodles', name: 'Manchurian Noodles', price: 80, available: true },
      { id: 'ns_24', category: 'Noodles', name: 'Manchurian Chilli Noodles', price: 80, available: true },
      { id: 'ns_25', category: 'Noodles', name: 'Mushroom Chilli Noodles', price: 80, available: true },
      // Garlic Bread
      { id: 'ns_26', category: 'Garlic Bread', name: 'Cheese Corn Garlic Bread', price: 70, available: true },
      { id: 'ns_27', category: 'Garlic Bread', name: 'Cheese Garlic Bread', price: 70, available: true },
      { id: 'ns_28', category: 'Garlic Bread', name: 'Paneer Garlic Bread', price: 80, available: true },
      { id: 'ns_29', category: 'Garlic Bread', name: 'Mushroom Garlic Bread', price: 80, available: true },
      { id: 'ns_30', category: 'Garlic Bread', name: 'Onion Capsicum Garlic Bread', price: 80, available: true },
      { id: 'ns_31', category: 'Garlic Bread', name: 'Paneer + Mushroom Garlic Bread', price: 90, available: true },
      { id: 'ns_32', category: 'Garlic Bread', name: 'Fully Loaded Garlic Bread', price: 110, available: true },
      { id: 'ns_33', category: 'Garlic Bread', name: 'Keema Garlic Bread', price: 80, available: true },
      // Pizza
      { id: 'ns_34', category: 'Pizza', name: 'Cheese Corn Pizza', price: 80, available: true },
      { id: 'ns_35', category: 'Pizza', name: 'Onion Capsicum Pizza', price: 100, available: true },
      { id: 'ns_36', category: 'Pizza', name: 'Margarita Pizza', price: 110, available: true },
      { id: 'ns_37', category: 'Pizza', name: 'Paneer Pizza', price: 120, available: true },
      { id: 'ns_38', category: 'Pizza', name: 'Mushrooms Pizza', price: 120, available: true },
      { id: 'ns_39', category: 'Pizza', name: 'Paneer + Mushrooms Pizza', price: 150, available: true },
      { id: 'ns_40', category: 'Pizza', name: 'Keema Pizza', price: 100, available: true },
      { id: 'ns_41', category: 'Pizza', name: 'Fully Loaded Pizza', price: 150, available: true },
      { id: 'ns_42', category: 'Pizza', name: 'Pineapple Pizza', price: 150, available: true },
      // Momo
      { id: 'ns_43', category: 'Momo', name: 'Veg Steam Momo', price: 80, available: true },
      { id: 'ns_44', category: 'Momo', name: 'Fry Momo', price: 70, available: true },
      { id: 'ns_45', category: 'Momo', name: 'Kurkure Momo', price: 80, available: true },
      { id: 'ns_46', category: 'Momo', name: 'Afghani Momo', price: 80, available: true },
      { id: 'ns_47', category: 'Momo', name: 'Tandoori Momo', price: 80, available: true },
      { id: 'ns_48', category: 'Momo', name: 'Jhol Momo', price: 70, available: true },
      { id: 'ns_49', category: 'Momo', name: 'Chilli Momo', price: 80, available: true },
      { id: 'ns_50', category: 'Momo', name: 'Jhol Keema Momo', price: 80, available: true },
      { id: 'ns_51', category: 'Momo', name: 'Malai Cheese Momo', price: 80, available: true },
      // Pasta
      { id: 'ns_52', category: 'Pasta', name: 'Red Pasta', price: 70, available: true },
      { id: 'ns_53', category: 'Pasta', name: 'Pink Pasta', price: 70, available: true },
      { id: 'ns_54', category: 'Pasta', name: 'White Pasta', price: 70, available: true },
      { id: 'ns_55', category: 'Pasta', name: 'Baked Pasta', price: 90, available: true },
      { id: 'ns_56', category: 'Pasta', name: 'Mushroom Pasta', price: 80, available: true },
      { id: 'ns_57', category: 'Pasta', name: 'Paneer Pasta', price: 80, available: true },
      { id: 'ns_58', category: 'Pasta', name: 'Fully Loaded Pasta', price: 100, available: true },
      { id: 'ns_59', category: 'Pasta', name: 'Fully Loaded Baked Pasta', price: 120, available: true },
      // Combo
      { id: 'ns_60', category: 'Combo', name: 'Noodles + Fries', price: 80, available: true },
      { id: 'ns_61', category: 'Combo', name: 'Pasta + Fries', price: 80, available: true },
      { id: 'ns_62', category: 'Combo', name: 'Pasta + Honey Chilli', price: 100, available: true },
      { id: 'ns_63', category: 'Combo', name: 'Pasta + Noodle', price: 80, available: true },
      { id: 'ns_64', category: 'Combo', name: 'Noodle + Honey Chilli', price: 80, available: true },
      { id: 'ns_65', category: 'Combo', name: 'Noodle + Garlic Bread', price: 80, available: true },
      { id: 'ns_66', category: 'Combo', name: 'Garlic Bread + Fries', price: 80, available: true },
      { id: 'ns_67', category: 'Combo', name: 'Garlic Bread + Pasta', price: 90, available: true },
      { id: 'ns_68', category: 'Combo', name: 'Garlic Bread + Honey Chilli', price: 90, available: true }
    ]
  },
  {
    id: 'stall_pakka_adda',
    name: 'Pakka Adda',
    vendorId: 'vendor2',
    vendorPass: 'pass123',
    upiId: 'pakkaadda@lpu.upi',
    bankAccount: 'HDFC - Acc #918237461 (Direct Vendor)',
    qrImage: 'QR.jpeg',
    menu: [
      // Noodles
      { id: 'pa_1', category: 'Noodles', name: 'Veg Noodles', price: 60, available: true },
      { id: 'pa_2', category: 'Noodles', name: 'Paneer Noodles', price: 70, available: true },
      { id: 'pa_3', category: 'Noodles', name: 'Mushroom Noodles', price: 80, available: true },
      { id: 'pa_4', category: 'Noodles', name: 'Manchurian Noodles', price: 70, available: true },
      { id: 'pa_5', category: 'Noodles', name: 'Chilli Garlic Noodles', price: 80, available: true },
      { id: 'pa_6', category: 'Noodles', name: 'Hakka Noodles', price: 70, available: true },
      // Burger
      { id: 'pa_7', category: 'Burger', name: 'Veggie Burger', price: 60, available: true },
      { id: 'pa_8', category: 'Burger', name: 'Paneer Burger', price: 70, available: true },
      { id: 'pa_9', category: 'Burger', name: 'Crispy Aloo Tikki Burger', price: 50, available: true },
      { id: 'pa_10', category: 'Burger', name: 'Mushroom Burger', price: 80, available: true },
      { id: 'pa_11', category: 'Burger', name: 'Pakka Double Decker Burger', price: 100, available: true },
      // Sandwich
      { id: 'pa_12', category: 'Sandwich', name: 'Veg Club Sandwich', price: 70, available: true },
      { id: 'pa_13', category: 'Sandwich', name: 'Paneer Tikka Sandwich', price: 80, available: true },
      { id: 'pa_14', category: 'Sandwich', name: 'Corn & Cheese Sandwich', price: 60, available: true },
      { id: 'pa_15', category: 'Sandwich', name: 'Bombay Sandwich', price: 70, available: true },
      { id: 'pa_16', category: 'Sandwich', name: 'Mushroom Sandwich', price: 80, available: true },
      // Pizza
      { id: 'pa_17', category: 'Pizza', name: 'Veg Pizza', price: 100, available: true },
      { id: 'pa_18', category: 'Pizza', name: 'Paneer Pizza', price: 120, available: true },
      { id: 'pa_19', category: 'Pizza', name: 'Mushroom Pizza', price: 120, available: true },
      { id: 'pa_20', category: 'Pizza', name: 'Margarita Pizza', price: 110, available: true },
      { id: 'pa_21', category: 'Pizza', name: 'Fully Loaded Veg Pizza', price: 150, available: true },
      { id: 'pa_22', category: 'Pizza', name: 'Pineapple Pizza', price: 150, available: true },
      // Roll
      { id: 'pa_23', category: 'Roll', name: 'Veg Kathi Roll', price: 50, available: true },
      { id: 'pa_24', category: 'Roll', name: 'Paneer Kathi Roll', price: 70, available: true },
      { id: 'pa_25', category: 'Roll', name: 'Mushroom Roll', price: 70, available: true },
      { id: 'pa_26', category: 'Roll', name: 'Chilli Paneer Roll', price: 80, available: true },
      { id: 'pa_27', category: 'Roll', name: 'Manchurian Roll', price: 70, available: true },
      // Toppings
      { id: 'pa_28', category: 'Toppings', name: 'Extra Cheese', price: 20, available: true },
      { id: 'pa_29', category: 'Toppings', name: 'Extra Veggies', price: 20, available: true },
      { id: 'pa_30', category: 'Toppings', name: 'Paneer Topping', price: 30, available: true },
      { id: 'pa_31', category: 'Toppings', name: 'Mushroom Topping', price: 30, available: true }
    ]
  }
];

// Local Storage data loader
let stalls = JSON.parse(localStorage.getItem('campus_stalls')) || defaultStalls;
let orders = JSON.parse(localStorage.getItem('campus_orders')) || [];
let currentVendor = JSON.parse(localStorage.getItem('current_vendor')) || null;

// Timeframe Filter States
let vendorTimeframe = 'daily';
let adminTimeframe = 'daily';

// Chatbot Flow State
let chatState = {
  step: 'IDLE', // IDLE, SELECT_STALL, SELECT_CATEGORY, SELECT_ITEMS, SELECT_SLOT, CONFIRM_ORDER, AWAITING_PAYMENT
  selectedStall: null,
  selectedCategory: null,
  cartItems: [],
  selectedSlot: null
};

// DOM Elements
const viewBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view-section');
const chatBody = document.getElementById('chat-body');
const chatOptionsContainer = document.getElementById('chat-options-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const regInput = document.getElementById('reg-number');
const resetChatBtn = document.getElementById('reset-chat-btn');
const startChatBtn = document.getElementById('start-chat-btn');

// Vendor DOM
const vendorLoginForm = document.getElementById('vendor-login-form');
const vendorLoginCard = document.getElementById('vendor-login-card');
const vendorDashboard = document.getElementById('vendor-dashboard');
const vendorLogoutBtn = document.getElementById('vendor-logout-btn');
const vendorOrdersTbody = document.getElementById('vendor-orders-tbody');
const stallNameTitle = document.getElementById('stall-name-title');

// Vendor Registration & QR Modals
const openRegisterBtn = document.getElementById('open-register-btn');
const vendorRegisterModal = document.getElementById('vendor-register-modal');
const closeRegisterModalBtn = document.getElementById('close-register-modal-btn');
const vendorRegisterForm = document.getElementById('vendor-register-form');

const vendorQrSettingsBtn = document.getElementById('vendor-qr-settings-btn');
const updateQrShortcutBtn = document.getElementById('update-qr-shortcut-btn');
const vendorQrSettingsModal = document.getElementById('vendor-qr-settings-modal');
const closeQrSettingsModalBtn = document.getElementById('close-qr-settings-modal-btn');
const vendorQrSettingsForm = document.getElementById('vendor-qr-settings-form');

// Admin DOM
const adminMenuList = document.getElementById('admin-menu-list');
const addItemBtn = document.getElementById('add-menu-item-btn');
const itemModal = document.getElementById('item-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const addItemForm = document.getElementById('add-item-form');
const adminRevenue = document.getElementById('admin-revenue');
const exportReportBtn = document.getElementById('export-report-btn');
const studentSearchInput = document.getElementById('student-search-input');
const studentSearchBtn = document.getElementById('student-search-btn');

// Payment Modal DOM
const paymentModal = document.getElementById('payment-modal');
const closePaymentModalBtn = document.getElementById('close-payment-modal-btn');
const paymentModalContent = document.getElementById('payment-modal-content');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupViewNavigation();
  setupChatListeners();
  setupVendorListeners();
  setupVendorModals();
  setupAdminListeners();
  setupPaymentModalListeners();
  renderVendorDashboard();
  renderAdminView();

  // Listen for storage events across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'campus_orders' || e.key === 'campus_stalls') {
      orders = JSON.parse(localStorage.getItem('campus_orders') || '[]');
      stalls = JSON.parse(localStorage.getItem('campus_stalls') || JSON.stringify(defaultStalls));
      renderVendorDashboard();
      renderAdminView();
      checkOrderStatusChanges();
    }
  });
});

// Theme Toggle Manager (Dark / Light Mode)
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const syncCheckbox = document.getElementById('sync');
  const themeLabelSpan = document.getElementById('theme-label-span');

  const savedTheme = localStorage.getItem('campus_theme') || 'dark';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', 'true');
      if (syncCheckbox) syncCheckbox.checked = true;
      if (themeLabelSpan) themeLabelSpan.innerText = 'Light Mode';
    } else {
      document.body.classList.remove('light-mode');
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', 'false');
      if (syncCheckbox) syncCheckbox.checked = false;
      if (themeLabelSpan) themeLabelSpan.innerText = 'Dark Mode';
    }
  };

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      const newTheme = isLight ? 'dark' : 'light';
      localStorage.setItem('campus_theme', newTheme);
      applyTheme(newTheme);
    });
  }

  if (syncCheckbox) {
    syncCheckbox.addEventListener('change', () => {
      const newTheme = syncCheckbox.checked ? 'light' : 'dark';
      localStorage.setItem('campus_theme', newTheme);
      applyTheme(newTheme);
    });
  }
}

// View Navigation
function setupViewNavigation() {
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      viewBtns.forEach(b => b.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetView).classList.add('active');
      
      if (targetView === 'vendor-view') renderVendorDashboard();
      if (targetView === 'admin-view') renderAdminView();
    });
  });
}

// Save Data Helpers
function saveOrders() {
  localStorage.setItem('campus_orders', JSON.stringify(orders));
  window.dispatchEvent(new Event('ordersUpdated'));
}

function saveStalls() {
  localStorage.setItem('campus_stalls', JSON.stringify(stalls));
  window.dispatchEvent(new Event('stallsUpdated'));
}

window.addEventListener('ordersUpdated', () => {
  renderVendorDashboard();
  renderAdminView();
});

window.addEventListener('stallsUpdated', () => {
  renderAdminView();
});

// ================= CHATBOT LOGIC =================

function setupChatListeners() {
  sendBtn.addEventListener('click', handleUserSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserSendMessage();
  });

  const demoStudentSelect = document.getElementById('demo-student-select');
  const studentNameInput = document.getElementById('student-name-input');
  const regStatusBadge = document.getElementById('registration-status-badge');

  if (demoStudentSelect) {
    demoStudentSelect.addEventListener('change', (e) => {
      const selectedOpt = e.target.options[e.target.selectedIndex];
      regInput.value = selectedOpt.value;
      if (studentNameInput) studentNameInput.value = selectedOpt.dataset.name || 'Vignesh Reddy';
    });
  }

  if (startChatBtn) {
    startChatBtn.addEventListener('click', () => {
      const regNo = regInput.value.trim() || '12204891';
      const studentName = studentNameInput ? studentNameInput.value.trim() : 'Vignesh Reddy';

      if (!regNo || !studentName) {
        alert('Please enter a valid Student Registration Number and Student Name.');
        return;
      }

      // Light up registration button & show verified status badge
      startChatBtn.classList.add('glow-pulse');
      if (regStatusBadge) regStatusBadge.classList.remove('hidden');

      // Scroll to WhatsApp simulator
      const simulator = document.querySelector('.whatsapp-container');
      if (simulator) {
        simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        simulator.style.boxShadow = '0 0 35px rgba(37, 211, 102, 0.6)';
        setTimeout(() => {
          simulator.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
        }, 2000);
      }

      // Append personalized verification bot message
      chatState = { step: 'SELECT_STALL', selectedStall: null, selectedCategory: null, cartItems: [], selectedSlot: null };
      
      let stallOptions = stalls.map(s => ({ label: `📍 ${s.name}`, value: s.name }));
      appendBotBubble(
        `🎉 <strong>Student Information Verified & Registered!</strong><br><br>` +
        `👤 <strong>Student Name:</strong> ${studentName}<br>` +
        `🎴 <strong>Reg Number:</strong> <code>${regNo}</code><br><br>` +
        `✅ Your student profile is activated for direct vendor pre-orders!<br>` +
        `Please select a food stall to pre-book from:`,
        stallOptions
      );
    });
  }

  resetChatBtn.addEventListener('click', () => {
    chatState = { step: 'IDLE', selectedStall: null, selectedCategory: null, cartItems: [], selectedSlot: null };
    chatBody.innerHTML = `
      <div class="wa-date-divider">Today</div>
      <div class="chat-bubble bot-bubble">
        <div class="message-content">
          Welcome to the <strong>LPU Food Pre-Booking Assistant</strong>! 🪅<br>
          How can I help you today?
        </div>
        <div class="message-meta">${getCurrentTime()}</div>
      </div>
      <div class="chat-options" id="chat-options-container">
        <button class="opt-btn" onclick="sendQuickOption('1. 🥪 Pre-book Food')">1. 🥪 Pre-book Food</button>
        <button class="opt-btn" onclick="sendQuickOption('2. 📋 View Menu')">2. 📋 View Menu</button>
        <button class="opt-btn" onclick="sendQuickOption('3. 📦 Track Order')">3. 📦 Track Order</button>
        <button class="opt-btn" onclick="sendQuickOption('4. ❓ Help')">4. ❓ Help</button>
      </div>
    `;
  });
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function handleUserSendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';

  appendUserBubble(text);
  processBotResponse(text);
}

function sendQuickOption(text) {
  appendUserBubble(text);
  processBotResponse(text);
}

function createRipple(e) {
  if (!e || !e.currentTarget) return;
  const btn = e.currentTarget;
  const ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${(e.clientX || rect.left) - rect.left - size / 2}px`;
  ripple.style.top = `${(e.clientY || rect.top) - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function appendUserBubble(text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user-bubble';
  bubble.innerHTML = `
    <div class="message-content">${escapeHTML(text)}</div>
    <div class="message-meta">${getCurrentTime()} <i class="fa-solid fa-check-double text-green"></i></div>
  `;
  chatBody.appendChild(bubble);
  scrollToBottom();

  const optContainer = document.getElementById('chat-options-container');
  if (optContainer) optContainer.innerHTML = '';
}

function appendBotBubble(htmlContent, options = []) {
  typingIndicator.classList.remove('hidden');
  scrollToBottom();

  setTimeout(() => {
    typingIndicator.classList.add('hidden');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot-bubble';
    bubble.innerHTML = `
      <div class="message-content">${htmlContent}</div>
      <div class="message-meta">${getCurrentTime()}</div>
    `;
    chatBody.appendChild(bubble);

    if (options && options.length > 0) {
      const optDiv = document.createElement('div');
      optDiv.className = 'chat-options';
      optDiv.id = 'chat-options-container';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerHTML = escapeHTML(opt.label);
        btn.onclick = (e) => {
          createRipple(e);
          sendQuickOption(opt.value);
        };
        optDiv.appendChild(btn);
      });
      chatBody.appendChild(optDiv);
    }

    scrollToBottom();
  }, 600);
}

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

function processBotResponse(userText) {
  const lower = userText.toLowerCase();

  // Reset / Greeting / Help
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('menu main') || userText.includes('4. ❓ Help')) {
    chatState.step = 'IDLE';
    appendBotBubble(
      `Welcome to the LPU Food Pre-Booking Assistant! 🪅<br>Select an option to get started:`,
      [
        { label: '1. 🥪 Pre-book Food', value: '1. 🥪 Pre-book Food' },
        { label: '2. 📋 View Menu', value: '2. 📋 View Menu' },
        { label: '3. 📦 Track Order', value: '3. 📦 Track Order' },
        { label: '4. ❓ Help', value: '4. ❓ Help' }
      ]
    );
    return;
  }

  // Pre-book trigger
  if (userText.includes('1. 🥪 Pre-book Food') || lower.includes('pre-book') || lower.includes('order food')) {
    chatState.step = 'SELECT_STALL';
    let stallOptions = stalls.map(s => ({ label: `📍 ${s.name}`, value: s.name }));
    appendBotBubble(`Please select a food stall to pre-book from:`, stallOptions);
    return;
  }

  // View Menu trigger
  if (userText.includes('2. 📋 View Menu') || lower.includes('view menu')) {
    let menuHtml = `<strong>Digital Menu Card</strong> 📋<br><br>`;
    stalls.forEach(s => {
      menuHtml += `<strong>📍 ${s.name}</strong><br>`;
      const categories = [...new Set(s.menu.map(i => i.category))];
      categories.forEach(cat => {
        menuHtml += `<em>[${cat}]</em><br>`;
        s.menu.filter(i => i.category === cat).slice(0, 5).forEach(item => {
          menuHtml += `• ${item.name} - ₹${item.price}<br>`;
        });
      });
      menuHtml += `<br>`;
    });
    appendBotBubble(menuHtml, [
      { label: '🥪 Start Pre-Booking', value: '1. 🥪 Pre-book Food' }
    ]);
    return;
  }

  // Track Order trigger
  if (userText.includes('3. 📦 Track Order') || lower.includes('track')) {
    const studentReg = regInput.value || '12204891';
    const studentOrders = orders.filter(o => o.studentReg === studentReg);

    if (studentOrders.length === 0) {
      appendBotBubble(`No active pre-orders found for Reg No: <strong>${studentReg}</strong>.<br>Would you like to pre-book food now?`, [
        { label: '🥪 Pre-book Food', value: '1. 🥪 Pre-book Food' }
      ]);
    } else {
      let trackHtml = `<strong>Your Recent Orders (${studentReg}):</strong><br><br>`;
      studentOrders.slice(-3).reverse().forEach(o => {
        let statusBadge = o.status === 'PREPARING' ? '🔵 Preparing' : o.status === 'READY' ? '🟢 Ready for Pickup' : o.status === 'DELIVERED' ? '⚪ Delivered' : '🟡 Confirmed';
        trackHtml += `<strong>ID: ${o.id}</strong> (${o.stallName})<br>Items: ${o.items.map(i => i.name).join(', ')}<br>Pickup Time: ${o.pickupSlot}<br>Payment: <strong style="color: #25D366;">${o.paymentStatus || 'PAID'} (Direct to Vendor)</strong><br>Status: <strong>${statusBadge}</strong><br><br>`;
      });
      appendBotBubble(trackHtml, [{ label: '🥪 Order More', value: '1. 🥪 Pre-book Food' }]);
    }
    return;
  }

  // Flow State 1: SELECT_STALL
  if (chatState.step === 'SELECT_STALL') {
    const selected = stalls.find(s => userText.includes(s.name));
    if (selected) {
      chatState.selectedStall = selected;
      chatState.step = 'SELECT_CATEGORY';

      const categories = [...new Set(selected.menu.map(i => i.category))];
      let catOptions = categories.map(c => ({ label: `📂 ${c}`, value: `CAT_${c}` }));
      appendBotBubble(`Great! Selected <strong>${selected.name}</strong>.<br>Select a category to view items:`, catOptions);
    } else {
      appendBotBubble(`Please choose a valid stall from the list.`);
    }
    return;
  }

  // Flow State 2: SELECT_CATEGORY
  if (chatState.step === 'SELECT_CATEGORY') {
    const stall = chatState.selectedStall;
    const categories = [...new Set(stall.menu.map(i => i.category))];
    const chosenCat = categories.find(c => userText.includes(`CAT_${c}`) || lower.includes(c.toLowerCase()));

    if (chosenCat) {
      chatState.selectedCategory = chosenCat;
      chatState.step = 'SELECT_ITEMS';

      const allItemsInCat = stall.menu.filter(i => i.category === chosenCat);
      let itemOptions = allItemsInCat.map(i => {
        if (i.available !== false) {
          return { label: `➕ ${i.name} (₹${i.price})`, value: i.name };
        } else {
          return { label: `❌ ${i.name} (Out of Stock)`, value: `OUT_OF_STOCK_${i.name}` };
        }
      });
      itemOptions.push({ label: '📂 Switch Category', value: 'SWITCH_CAT' });

      appendBotBubble(`Items in <strong>${chosenCat}</strong>:`, itemOptions);
    } else {
      appendBotBubble(`Please select a valid category.`);
    }
    return;
  }

  // Flow State 3: SELECT_ITEMS
  if (chatState.step === 'SELECT_ITEMS') {
    const stall = chatState.selectedStall;

    if (userText.includes('SWITCH_CAT') || lower.includes('switch category')) {
      chatState.step = 'SELECT_CATEGORY';
      const categories = [...new Set(stall.menu.map(i => i.category))];
      let catOptions = categories.map(c => ({ label: `📂 ${c}`, value: `CAT_${c}` }));
      appendBotBubble(`Select a category:`, catOptions);
      return;
    }

    if (userText.includes('OUT_OF_STOCK_')) {
      appendBotBubble(`⚠️ Sorry! That item is currently <strong>Out of Stock</strong> at ${stall.name}. Please select another item or category!`);
      return;
    }

    const foundItem = stall.menu.find(i => userText.includes(i.name));

    if (foundItem) {
      if (foundItem.available === false) {
        appendBotBubble(`⚠️ Sorry! <strong>${foundItem.name}</strong> is currently <strong>Out of Stock</strong> at ${stall.name}. Please select an item that is in stock.`);
        return;
      }

      chatState.cartItems.push(foundItem);
      const itemsListStr = chatState.cartItems.map(i => i.name).join(', ');
      const total = chatState.cartItems.reduce((acc, curr) => acc + curr.price, 0);

      let options = [
        { label: '📂 Add More Items', value: 'SWITCH_CAT' },
        { label: '⏰ Select Pickup Time Slot', value: 'PROCEED_SLOT' }
      ];

      appendBotBubble(`Added <strong>${foundItem.name}</strong>! 🛒<br>Current Cart: ${itemsListStr} (Total: ₹${total})<br><br>What would you like to do next?`, options);
      return;
    } else if (userText.includes('PROCEED_SLOT') || lower.includes('proceed') || lower.includes('checkout') || lower.includes('slot')) {
      if (chatState.cartItems.length === 0) {
        appendBotBubble(`Your cart is empty! Please select an item to pre-book.`);
        return;
      }
      chatState.step = 'SELECT_SLOT';
      renderTimeSlotListPicker();
      return;
    }
  }

  // Flow State 4: SELECT_SLOT (Pickup Time List)
  if (chatState.step === 'SELECT_SLOT') {
    const slots = ['11:45 AM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:30 PM', '1:45 PM'];
    const chosenSlot = slots.find(s => userText.includes(s));

    if (chosenSlot) {
      chatState.selectedSlot = chosenSlot;
      chatState.step = 'CONFIRM_ORDER';
      renderOrderConfirmationStep();
    } else {
      appendBotBubble(`Please select a valid time slot from the list above.`);
    }
    return;
  }

  // Flow State 5: CONFIRM_ORDER
  if (chatState.step === 'CONFIRM_ORDER') {
    if (userText.includes('CONFIRM_ORDER_NOW') || lower.includes('confirm') || lower.includes('pay')) {
      chatState.step = 'AWAITING_PAYMENT';
      renderVendorQRPaymentCard();
      return;
    } else if (userText.includes('CHANGE_SLOT') || lower.includes('change time')) {
      chatState.step = 'SELECT_SLOT';
      renderTimeSlotListPicker();
      return;
    } else if (userText.includes('CANCEL_ORDER') || lower.includes('cancel')) {
      chatState = { step: 'IDLE', selectedStall: null, selectedCategory: null, cartItems: [], selectedSlot: null };
      appendBotBubble(`❌ Pre-booking cancelled. Feel free to start a new order anytime!`, [
        { label: '🥪 Start New Pre-Booking', value: '1. 🥪 Pre-book Food' }
      ]);
      return;
    }
  }

  // Flow State 6: AWAITING_PAYMENT
  if (chatState.step === 'AWAITING_PAYMENT') {
    if (userText.includes('PAY_NOW_UPI') || lower.includes('upi pin')) {
      openPaymentModal('UPI Direct');
      return;
    } else if (userText.includes('CONFIRM_QR_PAYMENT') || lower.includes('paid')) {
      triggerAnimatedPaymentSuccess({ method: 'Direct Vendor QR UPI', txnId: 'TXN' + Math.floor(10000000 + Math.random() * 90000000) });
      return;
    } else if (userText.includes('CANCEL_ORDER') || lower.includes('cancel')) {
      chatState = { step: 'IDLE', selectedStall: null, selectedCategory: null, cartItems: [], selectedSlot: null };
      appendBotBubble(`❌ Pre-booking cancelled. Feel free to start a new order anytime!`, [
        { label: '🥪 Start New Pre-Booking', value: '1. 🥪 Pre-book Food' }
      ]);
      return;
    }
  }

  // Natural Language Fallbacks for items in Excel sheets
  const allMenuItems = stalls.flatMap(s => s.menu);
  const matchedItem = allMenuItems.find(i => lower.includes(i.name.toLowerCase()));
  if (matchedItem) {
    const parentStall = stalls.find(s => s.menu.some(m => m.id === matchedItem.id));
    chatState.selectedStall = parentStall;
    chatState.cartItems = [matchedItem];
    chatState.step = 'SELECT_SLOT';
    appendBotBubble(`Found <strong>${matchedItem.name}</strong> at ${parentStall.name} (Price: ₹${matchedItem.price})! 😋`);
    renderTimeSlotListPicker();
    return;
  }

  // Fallback response
  appendBotBubble(`I didn't quite catch that. Here are options available:`, [
    { label: '1. 🥪 Pre-book Food', value: '1. 🥪 Pre-book Food' },
    { label: '2. 📋 View Menu', value: '2. 📋 View Menu' },
    { label: '3. 📦 Track Order', value: '3. 📦 Track Order' }
  ]);
}

// Render Pickup Time Slot List Picker
function renderTimeSlotListPicker() {
  const slotHtml = `
    ⏰ <strong>Select Pickup Time Slot</strong><br>
    Choose when you want to collect your meal at the stall:
    <div class="time-slot-container">
      <div class="time-slot-grid">
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('11:45 AM')">
          <span class="slot-time">11:45 AM</span>
          <span class="slot-badge fast">⚡ Fast Prep</span>
        </div>
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('12:15 PM')">
          <span class="slot-time">12:15 PM</span>
          <span class="slot-badge optimal">💚 Optimal</span>
        </div>
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('12:30 PM')">
          <span class="slot-time">12:30 PM</span>
          <span class="slot-badge popular">🔥 Peak Break</span>
        </div>
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('12:45 PM')">
          <span class="slot-time">12:45 PM</span>
          <span class="slot-badge fast">⚡ Express</span>
        </div>
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('1:00 PM')">
          <span class="slot-time">1:00 PM</span>
          <span class="slot-badge optimal">💚 Recommended</span>
        </div>
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('1:30 PM')">
          <span class="slot-time">1:30 PM</span>
          <span class="slot-badge optimal">✨ Quick Pick</span>
        </div>
        <div class="time-slot-card" onclick="selectTimeSlotFromCard('1:45 PM')">
          <span class="slot-time">1:45 PM</span>
          <span class="slot-badge fast">🍃 Relaxed</span>
        </div>
      </div>
    </div>
  `;

  appendBotBubble(slotHtml, [
    { label: '⏰ 12:15 PM (Optimal)', value: '12:15 PM' },
    { label: '⏰ 12:30 PM (Peak Break)', value: '12:30 PM' },
    { label: '⏰ 1:00 PM (Recommended)', value: '1:00 PM' },
    { label: '⏰ 1:30 PM (Quick Pick)', value: '1:30 PM' }
  ]);
}

window.selectTimeSlotFromCard = function(slotTime) {
  sendQuickOption(`Selected Time: ${slotTime}`);
};

// Render Order Confirmation Step
function renderOrderConfirmationStep() {
  const stall = chatState.selectedStall;
  const total = chatState.cartItems.reduce((acc, c) => acc + c.price, 0);
  const itemsSummary = chatState.cartItems.map(i => `• ${i.name} - ₹${i.price}`).join('<br>');

  const confirmMsg = `
    📝 <strong>Review & Confirm Pre-Order</strong><br><br>
    📍 <strong>Vendor Stall:</strong> ${stall.name}<br>
    🍕 <strong>Selected Items:</strong><br>${itemsSummary}<br>
    ⏰ <strong>Pickup Time Slot:</strong> <strong style="color: #128C7E;">${chatState.selectedSlot}</strong><br>
    💰 <strong>Total Amount: ₹${total}</strong><br><br>
    <em>⚡ Click confirm below to lock your pickup time and generate direct vendor payment QR!</em>
  `;

  appendBotBubble(confirmMsg, [
    { label: `✅ Confirm Order & Show Payment QR`, value: 'CONFIRM_ORDER_NOW' },
    { label: `⏰ Change Pickup Time`, value: 'CHANGE_SLOT' },
    { label: `❌ Cancel Order`, value: 'CANCEL_ORDER' }
  ]);
}

// Render Vendor Direct QR Payment with Vendor Specific QR Code & UPI Link
function renderVendorQRPaymentCard() {
  const stall = chatState.selectedStall;
  const total = chatState.cartItems.reduce((acc, c) => acc + c.price, 0);
  const upiId = stall.upiId || 'nepaliswadh@lpu.upi';
  const qrImgSrc = stall.qrImage || 'QR.jpeg';
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(stall.name)}&am=${total}&cu=INR&tn=${encodeURIComponent('PreOrder_' + stall.name)}`;

  const qrHtml = `
    📱 <strong>Direct Vendor UPI Payment QR (${stall.name})</strong><br>
    Scan with phone or <strong>click QR image / button below</strong> to pay via any UPI app:<br>

    <div class="qr-container-animated">
      <div class="qr-laser-scanner"></div>
      <a href="${upiDeepLink}" target="_blank" class="qr-click-wrapper" onclick="handleQRClickToPay(event)" title="Click to open GPay, PhonePe, Paytm, or BHIM">
        <img src="${qrImgSrc}" alt="${stall.name} Payment QR" class="vendor-qr-img">
      </a>
      <span class="qr-click-hint">
        <i class="fa-solid fa-arrow-pointer"></i> Click QR to Open UPI App (${stall.name})
      </span>
    </div>

    <div class="upi-apps-container">
      <a href="${upiDeepLink}" target="_blank" class="upi-app-btn pulse" onclick="handleQRClickToPay(event)">
        <i class="fa-solid fa-mobile-screen-button"></i> Pay ₹${total} Directly to ${stall.name}
      </a>
      <div class="upi-apps-row">
        <span class="upi-pill">Google Pay</span>
        <span class="upi-pill">PhonePe</span>
        <span class="upi-pill">Paytm</span>
        <span class="upi-pill">BHIM</span>
      </div>
    </div>

    <strong>Amount Payable: ₹${total}</strong> (100% Direct Transfer to ${stall.name} - ${upiId})<br>
    <small style="color: #667781;">⚡ Scan or click above, then tap button below after payment!</small>
  `;

  appendBotBubble(qrHtml, [
    { label: `💸 I Have Paid ₹${total} to ${stall.name}`, value: 'CONFIRM_QR_PAYMENT' },
    { label: `🔒 Enter UPI PIN in Modal`, value: 'PAY_NOW_UPI' },
    { label: `❌ Cancel Order`, value: 'CANCEL_ORDER' }
  ]);
}

window.handleQRClickToPay = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  triggerAnimatedPaymentSuccess({
    method: 'Auto-Detected Vendor UPI Direct',
    txnId: 'TXN' + Math.floor(10000000 + Math.random() * 90000000)
  });
};

// Trigger Animated Payment Processing & Direct Redirection to Simulator
function triggerAnimatedPaymentSuccess(paymentData) {
  typingIndicator.classList.remove('hidden');

  setTimeout(() => {
    typingIndicator.classList.add('hidden');
    completeOrderWithPayment(paymentData);

    const simulator = document.querySelector('.whatsapp-container');
    if (simulator) {
      simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
      simulator.style.boxShadow = '0 0 35px rgba(37, 211, 102, 0.6)';
      setTimeout(() => {
        simulator.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
      }, 2000);
    }
  }, 1000);
}

// Payment Modal Controller
function setupPaymentModalListeners() {
  if (closePaymentModalBtn) {
    closePaymentModalBtn.addEventListener('click', () => paymentModal.classList.add('hidden'));
  }
}

function openPaymentModal(methodName) {
  if (!chatState.selectedStall || chatState.cartItems.length === 0) return;

  const stall = chatState.selectedStall;
  const total = chatState.cartItems.reduce((acc, c) => acc + c.price, 0);
  const itemsStr = chatState.cartItems.map(i => i.name).join(', ');

  paymentModalContent.innerHTML = `
    <div class="payment-modal-card-inner">
      <div class="payment-vendor-header">
        <div class="vendor-icon-circle"><i class="fa-solid fa-store"></i></div>
        <div>
          <h4>${stall.name}</h4>
          <span class="direct-pay-badge"><i class="fa-solid fa-shield-halved"></i> Verified Direct Vendor</span>
        </div>
      </div>

      <div class="payment-amount-box">
        <span>Amount Payable to Vendor</span>
        <h2 class="amount-val">₹ ${total}</h2>
        <div class="upi-details">
          <span><i class="fa-solid fa-at"></i> UPI: <strong>${stall.upiId}</strong></span><br>
          <span><i class="fa-solid fa-building-columns"></i> ${stall.bankAccount}</span>
        </div>
      </div>

      <div class="payment-order-summary">
        <p><strong>Items:</strong> ${itemsStr}</p>
        <p><strong>Pickup Slot:</strong> ${chatState.selectedSlot}</p>
      </div>

      <form id="payment-confirm-form">
        <div class="input-group">
          <label><i class="fa-solid fa-key"></i> Enter UPI PIN (Demo PIN: 1234):</label>
          <input type="password" id="upi-pin-input" value="1234" maxlength="6" required class="upi-pin-field">
        </div>
        <button type="submit" class="primary-btn full-btn pulse" id="modal-pay-submit-btn">
          <i class="fa-solid fa-lock"></i> Pay ₹${total} Directly to ${stall.name}
        </button>
      </form>
    </div>
  `;

  paymentModal.classList.remove('hidden');

  document.getElementById('payment-confirm-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('modal-pay-submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Direct Vendor Payment...`;

    setTimeout(() => {
      paymentModal.classList.add('hidden');
      triggerAnimatedPaymentSuccess({
        method: 'Real-Time UPI Direct',
        txnId: 'TXN' + Math.floor(10000000 + Math.random() * 90000000)
      });
    }, 800);
  });
}

function completeOrderWithPayment(paymentData) {
  const regNo = regInput.value || '12204891';
  const orderId = '#LPU' + Math.floor(10000 + Math.random() * 90000);
  const total = chatState.cartItems.reduce((acc, c) => acc + c.price, 0);

  const newOrder = {
    id: orderId,
    studentReg: regNo,
    stallId: chatState.selectedStall.id,
    stallName: chatState.selectedStall.name,
    items: chatState.cartItems,
    total: total,
    pickupSlot: chatState.selectedSlot,
    estReadyTime: getEstReadyTime(chatState.selectedSlot),
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: paymentData.method || 'Real-Time UPI Direct',
    txnId: paymentData.txnId || ('TXN' + Math.floor(10000000 + Math.random() * 90000000)),
    paidToVendor: chatState.selectedStall.name,
    vendorUpi: chatState.selectedStall.upiId,
    createdAt: new Date().toISOString(),
    lastNotifiedStatus: 'CONFIRMED'
  };

  orders.push(newOrder);
  saveOrders();

  const itemsSummary = chatState.cartItems.map(i => i.name).join(', ');
  const confirmationMsg = `
    <div class="payment-success-card">
      <div class="success-checkmark-circle">
        <i class="fa-solid fa-check"></i>
      </div>
      <h3 style="color: #075E54; margin: 0.2rem 0;">Payment Successful! 🎉</h3>
      <p style="font-size: 0.85rem; color: #54656f;">Direct Transfer Completed to ${newOrder.stallName}</p>
    </div>
    ✅ <strong>Pre-Booking Ticket Generated!</strong><br><br>
    💸 <strong>Money Transferred:</strong> ₹${total} sent directly to <strong>${newOrder.stallName}</strong><br>
    🧾 <strong>Transaction ID:</strong> <code>${newOrder.txnId}</code><br>
    🆔 <strong>Order ID:</strong> <strong>${newOrder.id}</strong><br>
    📍 <strong>Food Stall:</strong> ${newOrder.stallName}<br>
    🍕 <strong>Items:</strong> ${itemsSummary}<br>
    ⏰ <strong>Pickup Time Slot:</strong> ${newOrder.pickupSlot}<br>
    ⏱️ <strong>Estimated Ready Time:</strong> ${newOrder.estReadyTime}<br><br>
    <em>📲 Order dispatched in real-time to vendor's kitchen dashboard! Show this ticket at stall for instant pickup.</em>
  `;

  appendBotBubble(confirmationMsg, [
    { label: '📦 Track Order Status', value: '3. 📦 Track Order' },
    { label: '🥪 Order More', value: '1. 🥪 Pre-book Food' }
  ]);

  chatState = { step: 'IDLE', selectedStall: null, selectedCategory: null, cartItems: [], selectedSlot: null };
}

function getEstReadyTime(slotStr) {
  if (slotStr === '12:30 PM') return '12:25 PM';
  if (slotStr === '1:00 PM') return '12:55 PM';
  if (slotStr === '1:30 PM') return '1:25 PM';
  return '10 mins prior';
}

function checkOrderStatusChanges() {
  const currentStudentReg = regInput.value || '12204891';
  orders.forEach(o => {
    if (o.studentReg === currentStudentReg && o.status !== o.lastNotifiedStatus) {
      o.lastNotifiedStatus = o.status;
      let alertText = '';
      if (o.status === 'PREPARING') {
        alertText = `🔵 <strong>Order Status Update!</strong><br>Order <strong>${o.id}</strong> is now being <strong>PREPARED</strong> in kitchen.<br>Estimated Ready Time: ${o.estReadyTime}.`;
      } else if (o.status === 'READY') {
        alertText = `🔔 <strong>HOT & READY FOR PICKUP!</strong> 🎉<br>Order <strong>${o.id}</strong> is <strong>READY</strong> at ${o.stallName}. Please proceed to collect!`;
      } else if (o.status === 'DELIVERED') {
        alertText = `✅ <strong>Order Completed!</strong><br>Order <strong>${o.id}</strong> has been marked as collected. Enjoy your meal!`;
      }

      if (alertText) {
        appendBotBubble(alertText);
      }
    }
  });
  saveOrders();
}

// Timeframe Filter Helper
function filterOrdersByTimeframe(orderList, timeframe) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  if (timeframe === 'daily') {
    return orderList.filter(o => new Date(o.createdAt).getTime() >= todayStart);
  } else if (timeframe === 'weekly') {
    const sevenDaysAgo = todayStart - (7 * 24 * 60 * 60 * 1000);
    return orderList.filter(o => new Date(o.createdAt).getTime() >= sevenDaysAgo);
  } else if (timeframe === 'monthly') {
    const thirtyDaysAgo = todayStart - (30 * 24 * 60 * 60 * 1000);
    return orderList.filter(o => new Date(o.createdAt).getTime() >= thirtyDaysAgo);
  }
  return orderList; // 'all'
}

// ================= VENDOR PORTAL LOGIC =================

function setupVendorListeners() {
  vendorLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('vendor-id').value;
    const pass = document.getElementById('vendor-pass').value;

    const matchedStall = stalls.find(s => s.vendorId === id && s.vendorPass === pass);

    if (matchedStall) {
      currentVendor = matchedStall;
      localStorage.setItem('current_vendor', JSON.stringify(currentVendor));
      renderVendorDashboard();
    } else {
      alert('Invalid Vendor ID or Password. Demo IDs: vendor1 (Nepali Swadh), vendor2 (Pakka Adda) / Pass: pass123');
    }
  });

  vendorLogoutBtn.addEventListener('click', () => {
    currentVendor = null;
    localStorage.removeItem('current_vendor');
    renderVendorDashboard();
  });

  // Timeframe Tab Buttons inside Vendor Dashboard
  const tfBtns = document.querySelectorAll('.tf-btn');
  tfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vendorTimeframe = btn.dataset.tf;
      renderVendorDashboard();
    });
  });

  // Vendor Dashboard Subtabs (Active Orders vs Menu Inventory vs Payment History)
  const tabOrders = document.getElementById('vendor-tab-orders');
  const tabInventory = document.getElementById('vendor-tab-inventory');
  const tabPayments = document.getElementById('vendor-tab-payments');
  
  const secOrders = document.getElementById('vendor-active-orders-section');
  const secInventory = document.getElementById('vendor-inventory-section');
  const secPayments = document.getElementById('vendor-payment-history-section');

  if (tabOrders && tabInventory && tabPayments) {
    tabOrders.addEventListener('click', () => {
      tabOrders.classList.add('active');
      tabInventory.classList.remove('active');
      tabPayments.classList.remove('active');
      secOrders.classList.remove('hidden');
      secInventory.classList.add('hidden');
      secPayments.classList.add('hidden');
    });

    tabInventory.addEventListener('click', () => {
      tabInventory.classList.add('active');
      tabOrders.classList.remove('active');
      tabPayments.classList.remove('active');
      secInventory.classList.remove('hidden');
      secOrders.classList.add('hidden');
      secPayments.classList.add('hidden');
      renderVendorMenuInventory();
    });

    tabPayments.addEventListener('click', () => {
      tabPayments.classList.add('active');
      tabOrders.classList.remove('active');
      tabInventory.classList.remove('active');
      secPayments.classList.remove('hidden');
      secOrders.classList.add('hidden');
      secInventory.classList.add('hidden');
    });
  }
}

function setupVendorModals() {
  // Vendor Registration Modal
  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', () => vendorRegisterModal.classList.remove('hidden'));
  }
  if (closeRegisterModalBtn) {
    closeRegisterModalBtn.addEventListener('click', () => vendorRegisterModal.classList.add('hidden'));
  }

  // Vendor Open Add Item Modal Button
  const vendorOpenAddItemBtn = document.getElementById('vendor-open-add-item-btn');
  const vendorItemModal = document.getElementById('vendor-item-modal');
  const closeVendorItemModalBtn = document.getElementById('close-vendor-item-modal-btn');
  const vendorItemForm = document.getElementById('vendor-item-form');

  if (vendorOpenAddItemBtn) {
    vendorOpenAddItemBtn.addEventListener('click', () => openVendorItemModal(null));
  }
  if (closeVendorItemModalBtn) {
    closeVendorItemModalBtn.addEventListener('click', () => vendorItemModal.classList.add('hidden'));
  }

  if (vendorItemForm) {
    vendorItemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentVendor) return;

      const itemId = document.getElementById('vendor-item-id-input').value;
      const name = document.getElementById('vendor-item-name-input').value.trim();
      const category = document.getElementById('vendor-item-cat-input').value.trim();
      const price = parseInt(document.getElementById('vendor-item-price-input').value);
      const isAvailable = document.getElementById('vendor-item-stock-input').value === 'true';

      const stallIdx = stalls.findIndex(s => s.id === currentVendor.id);
      if (stallIdx === -1) return;

      if (itemId) {
        // Edit existing item
        const itemIdx = stalls[stallIdx].menu.findIndex(i => i.id === itemId);
        if (itemIdx !== -1) {
          stalls[stallIdx].menu[itemIdx] = { id: itemId, category, name, price, available: isAvailable };
        }
      } else {
        // Add new item
        const newItem = { id: 'm_' + Date.now(), category, name, price, available: isAvailable };
        stalls[stallIdx].menu.push(newItem);
      }

      currentVendor = stalls[stallIdx];
      localStorage.setItem('current_vendor', JSON.stringify(currentVendor));
      saveStalls();

      vendorItemModal.classList.add('hidden');
      vendorItemForm.reset();
      alert(`✅ Menu item "${name}" saved successfully!`);
      renderVendorDashboard();
      renderAdminView();
    });
  }

  vendorRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-stall-name').value.trim();
    const vendorId = document.getElementById('reg-vendor-id').value.trim();
    const vendorPass = document.getElementById('reg-vendor-pass').value;
    const upiId = document.getElementById('reg-vendor-upi').value.trim();
    const fileInput = document.getElementById('reg-vendor-qr-file');

    if (stalls.some(s => s.vendorId === vendorId)) {
      alert('Vendor ID already exists! Please choose another Vendor ID.');
      return;
    }

    const processCreation = (qrDataUrl) => {
      const newStall = {
        id: 'stall_' + Date.now(),
        name: name,
        vendorId: vendorId,
        vendorPass: vendorPass,
        upiId: upiId,
        bankAccount: 'Direct Vendor Bank Account',
        qrImage: qrDataUrl || 'QR.jpeg',
        menu: [
          { id: 'm_' + Date.now() + '_1', category: 'Special', name: 'Special Thali', price: 100, available: true },
          { id: 'm_' + Date.now() + '_2', category: 'Special', name: 'Combo Meal', price: 120, available: true }
        ]
      };

      stalls.push(newStall);
      saveStalls();
      currentVendor = newStall;
      localStorage.setItem('current_vendor', JSON.stringify(currentVendor));
      
      vendorRegisterModal.classList.add('hidden');
      vendorRegisterForm.reset();
      alert(`🎉 Stall "${name}" registered successfully! You are now logged in.`);
      renderVendorDashboard();
      renderAdminView();
    };

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => processCreation(evt.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      processCreation('QR.jpeg');
    }
  });

  // Vendor Settings Modal
  if (vendorQrSettingsBtn) {
    vendorQrSettingsBtn.addEventListener('click', () => {
      if (!currentVendor) return;
      document.getElementById('settings-vendor-upi').value = currentVendor.upiId || '';
      vendorQrSettingsModal.classList.remove('hidden');
    });
  }
  if (closeQrSettingsModalBtn) {
    closeQrSettingsModalBtn.addEventListener('click', () => vendorQrSettingsModal.classList.add('hidden'));
  }

  vendorQrSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentVendor) return;

    const newUpi = document.getElementById('settings-vendor-upi').value.trim();
    const fileInput = document.getElementById('settings-vendor-qr-file');

    const updateVendorData = (qrUrl) => {
      const idx = stalls.findIndex(s => s.id === currentVendor.id);
      if (idx !== -1) {
        stalls[idx].upiId = newUpi;
        if (qrUrl) stalls[idx].qrImage = qrUrl;
        currentVendor = stalls[idx];
        localStorage.setItem('current_vendor', JSON.stringify(currentVendor));
        saveStalls();
      }
      vendorQrSettingsModal.classList.add('hidden');
      alert(`✅ Stall QR Code & UPI settings updated!`);
      renderVendorDashboard();
      renderAdminView();
    };

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => updateVendorData(evt.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      updateVendorData(null);
    }
  });
}

function renderVendorDashboard() {
  if (!currentVendor) {
    vendorLoginCard.classList.remove('hidden');
    vendorDashboard.classList.add('hidden');
    return;
  }

  vendorLoginCard.classList.add('hidden');
  vendorDashboard.classList.remove('hidden');

  const allStallOrders = orders.filter(o => o.stallId === currentVendor.id);
  const filteredOrders = filterOrdersByTimeframe(allStallOrders, vendorTimeframe);

  const timeframeRevenue = filteredOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0);

  // Update Stats Header Labels
  let tfLabel = vendorTimeframe === 'daily' ? 'Daily (Today)' : vendorTimeframe === 'weekly' ? 'Weekly (7 Days)' : 'Monthly (30 Days)';
  document.getElementById('stat-revenue-label').innerText = `Revenue (${tfLabel})`;
  document.getElementById('stat-orders-label').innerText = `Orders (${tfLabel})`;

  stallNameTitle.innerHTML = `Stall: ${currentVendor.name} <span style="font-size: 0.85rem; color: var(--accent-green); font-weight: 500;">(${tfLabel} Earnings: ₹${timeframeRevenue})</span>`;

  document.getElementById('stat-timeframe-revenue').innerText = `₹ ${timeframeRevenue}`;
  document.getElementById('stat-total-orders').innerText = filteredOrders.length;
  document.getElementById('stat-pending-orders').innerText = allStallOrders.filter(o => o.status === 'CONFIRMED').length;
  document.getElementById('stat-ready-orders').innerText = allStallOrders.filter(o => o.status === 'READY' || o.status === 'DELIVERED').length;

  // Render Top Selling Items for Vendor
  renderVendorTopItems(filteredOrders);

  // Render Active Orders Queue Table
  vendorOrdersTbody.innerHTML = '';
  if (allStallOrders.length === 0) {
    vendorOrdersTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 2rem;">No orders placed for ${currentVendor.name} yet. Place an order from the Student Chatbot!</td></tr>`;
  } else {
    allStallOrders.slice().reverse().forEach(o => {
      const tr = document.createElement('tr');

      let statusBadgeClass = 'status-pending';
      if (o.status === 'PREPARING') statusBadgeClass = 'status-preparing';
      if (o.status === 'READY') statusBadgeClass = 'status-ready';
      if (o.status === 'DELIVERED') statusBadgeClass = 'status-completed';

      const itemsStr = o.items.map(i => i.name).join(', ');
      const paymentBadge = `<span class="badge-status status-ready" style="display:inline-flex; flex-direction:column; gap:2px;"><i class="fa-solid fa-circle-check"></i> PAID (UPI Direct)<small style="font-size:0.65rem; opacity:0.85;">${o.txnId || 'TXN-DIRECT'}</small></span>`;

      tr.innerHTML = `
        <td><strong>${o.id}</strong></td>
        <td>${o.studentReg}</td>
        <td>${itemsStr} (₹${o.total})</td>
        <td>${paymentBadge}</td>
        <td>${o.pickupSlot}</td>
        <td>${o.estReadyTime}</td>
        <td><span class="badge-status ${statusBadgeClass}">${o.status}</span></td>
        <td>
          <div class="action-btns-group">
            ${o.status === 'CONFIRMED' ? `<button class="act-btn btn-prepare" onclick="updateOrderStatus('${o.id}', 'PREPARING')">Mark Preparing</button>` : ''}
            ${o.status === 'PREPARING' ? `<button class="act-btn btn-ready" onclick="updateOrderStatus('${o.id}', 'READY')">Mark Ready</button>` : ''}
            ${o.status === 'READY' ? `<button class="act-btn btn-deliver" onclick="updateOrderStatus('${o.id}', 'DELIVERED')">Mark Delivered</button>` : ''}
            ${o.status === 'DELIVERED' ? `<span style="font-size:0.75rem; color: var(--text-muted);">Done</span>` : ''}
          </div>
        </td>
      `;
      vendorOrdersTbody.appendChild(tr);
    });
  }

  // Render Payment History Log Table
  const paymentsTbody = document.getElementById('vendor-payments-tbody');
  if (paymentsTbody) {
    paymentsTbody.innerHTML = '';
    const paidOrders = allStallOrders.filter(o => o.paymentStatus === 'PAID');
    if (paidOrders.length === 0) {
      paymentsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 2rem;">No direct vendor payments received yet.</td></tr>`;
    } else {
      paidOrders.slice().reverse().forEach(o => {
        const tr = document.createElement('tr');
        const dateStr = new Date(o.createdAt).toLocaleString();
        tr.innerHTML = `
          <td><code>${o.txnId || 'TXN-DIRECT'}</code></td>
          <td><strong>${o.studentReg}</strong></td>
          <td>${o.id}</td>
          <td>${o.items.map(i => i.name).join(', ')}</td>
          <td><strong style="color: var(--accent-green);">₹ ${o.total}</strong></td>
          <td><small>${dateStr}</small></td>
          <td><span class="badge-status status-ready"><i class="fa-solid fa-shield-halved"></i> VERIFIED DIRECT UPI</span></td>
        `;
        paymentsTbody.appendChild(tr);
      });
    }
  }

  // Render Vendor Menu & Stock Inventory
  renderVendorMenuInventory();
}

function renderVendorMenuInventory() {
  const tbody = document.getElementById('vendor-inventory-tbody');
  if (!tbody || !currentVendor) return;

  tbody.innerHTML = '';
  const vendorMenu = currentVendor.menu || [];

  if (vendorMenu.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 2rem;">No menu items listed for ${currentVendor.name} yet. Click "Add New Item to Menu" above to add food items!</td></tr>`;
    return;
  }

  vendorMenu.forEach(item => {
    const tr = document.createElement('tr');
    const isAvailable = item.available !== false;
    const stockBtnClass = isAvailable ? 'in-stock' : 'out-stock';
    const stockBtnIcon = isAvailable ? 'fa-circle-check' : 'fa-circle-xmark';
    const stockBtnText = isAvailable ? 'In Stock' : 'Out of Stock';

    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td><span class="subtext">${item.category || 'General'}</span></td>
      <td><strong style="color: var(--accent-green);">₹ ${item.price}</strong></td>
      <td>
        <button class="stock-toggle-btn ${stockBtnClass}" onclick="toggleVendorItemStock('${item.id}')">
          <i class="fa-solid ${stockBtnIcon}"></i> ${stockBtnText}
        </button>
      </td>
      <td>
        <div class="action-btns-group">
          <button class="act-btn btn-prepare" onclick="openVendorItemModal('${item.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
          <button class="act-btn btn-deliver" style="background: rgba(239,68,68,0.2); color:#f87171;" onclick="deleteVendorMenuItem('${item.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleVendorItemStock(itemId) {
  if (!currentVendor) return;
  const stallIdx = stalls.findIndex(s => s.id === currentVendor.id);
  if (stallIdx === -1) return;

  const item = stalls[stallIdx].menu.find(i => i.id === itemId);
  if (item) {
    item.available = item.available === false ? true : false;
    currentVendor = stalls[stallIdx];
    localStorage.setItem('current_vendor', JSON.stringify(currentVendor));
    saveStalls();
    renderVendorDashboard();
    renderAdminView();
  }
}

function openVendorItemModal(itemId) {
  if (!currentVendor) return;
  const modal = document.getElementById('vendor-item-modal');
  const title = document.getElementById('vendor-item-modal-title');
  const idInput = document.getElementById('vendor-item-id-input');
  const nameInput = document.getElementById('vendor-item-name-input');
  const catInput = document.getElementById('vendor-item-cat-input');
  const priceInput = document.getElementById('vendor-item-price-input');
  const stockInput = document.getElementById('vendor-item-stock-input');

  if (itemId) {
    const item = currentVendor.menu.find(i => i.id === itemId);
    if (item) {
      title.innerHTML = `<i class="fa-solid fa-pen-to-square text-green"></i> Edit Menu Item (${item.name})`;
      idInput.value = item.id;
      nameInput.value = item.name;
      catInput.value = item.category || 'General';
      priceInput.value = item.price;
      stockInput.value = item.available !== false ? 'true' : 'false';
    }
  } else {
    title.innerHTML = `<i class="fa-solid fa-plus-circle text-green"></i> Add New Menu Item (${currentVendor.name})`;
    idInput.value = '';
    nameInput.value = '';
    catInput.value = 'Special';
    priceInput.value = '80';
    stockInput.value = 'true';
  }

  modal.classList.remove('hidden');
}

function deleteVendorMenuItem(itemId) {
  if (!currentVendor) return;
  const item = currentVendor.menu.find(i => i.id === itemId);
  if (!item) return;

  if (confirm(`Are you sure you want to delete "${item.name}" from your stall menu?`)) {
    const stallIdx = stalls.findIndex(s => s.id === currentVendor.id);
    if (stallIdx !== -1) {
      stalls[stallIdx].menu = stalls[stallIdx].menu.filter(i => i.id !== itemId);
      currentVendor = stalls[stallIdx];
      localStorage.setItem('current_vendor', JSON.stringify(currentVendor));
      saveStalls();
      renderVendorDashboard();
      renderAdminView();
    }
  }
}

function renderVendorTopItems(orderList) {
  const topListElem = document.getElementById('vendor-top-items-list');
  if (!topListElem) return;

  const itemCounts = {};
  orderList.forEach(o => {
    o.items.forEach(item => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, count: 0, totalRevenue: 0 };
      }
      itemCounts[item.name].count += 1;
      itemCounts[item.name].totalRevenue += item.price;
    });
  });

  const sortedItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  const totalItemCount = sortedItems.reduce((acc, i) => acc + i.count, 0) || 1;

  topListElem.innerHTML = '';
  if (sortedItems.length === 0) {
    topListElem.innerHTML = `<p class="subtext" style="padding: 1rem; text-align: center;">No menu item sales recorded for this timeframe yet.</p>`;
    return;
  }

  sortedItems.forEach(item => {
    const pct = Math.round((item.count / totalItemCount) * 100);
    const row = document.createElement('div');
    row.className = 'top-item-row';
    row.innerHTML = `
      <div class="top-item-meta">
        <span>${item.name} (${item.count} sold)</span>
        <span class="top-item-val">₹ ${item.totalRevenue}</span>
      </div>
      <div class="item-progress-track">
        <div class="item-progress-bar" style="width: ${pct}%;"></div>
      </div>
    `;
    topListElem.appendChild(row);
  });
}

function updateOrderStatus(orderId, newStatus) {
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = newStatus;
    saveOrders();
    checkOrderStatusChanges();
  }
}

// ================= ADMIN DASHBOARD LOGIC =================

function setupAdminListeners() {
  addItemBtn.addEventListener('click', () => itemModal.classList.remove('hidden'));
  closeModalBtn.addEventListener('click', () => itemModal.classList.remove('hidden'));

  addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const stallName = document.getElementById('modal-stall').value;
    const itemName = document.getElementById('modal-item-name').value;
    const price = parseInt(document.getElementById('modal-price').value);

    let stall = stalls.find(s => s.name.toLowerCase() === stallName.toLowerCase());
    if (!stall) {
      stall = stalls[0];
    }

    stall.menu.push({
      id: 'm_' + Date.now(),
      category: 'Custom',
      name: itemName,
      price: price,
      available: true
    });

    saveStalls();
    renderAdminView();
    itemModal.classList.add('hidden');
    addItemForm.reset();
  });

  // Admin Timeframe Selector
  const adminTfBtns = document.querySelectorAll('.admin-tf-btn');
  adminTfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminTfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adminTimeframe = btn.dataset.tf;
      renderAdminView();
    });
  });

  // Student Order History Inspector
  if (studentSearchBtn) {
    studentSearchBtn.addEventListener('click', () => {
      const regNo = studentSearchInput.value.trim();
      renderStudentInspector(regNo);
    });
  }

  // Export Sales Report Button
  if (exportReportBtn) {
    exportReportBtn.addEventListener('click', exportSalesReportCSV);
  }
}

function renderAdminView() {
  const filteredOrders = filterOrdersByTimeframe(orders, adminTimeframe);
  const totalRevenue = filteredOrders.reduce((acc, curr) => acc + curr.total, 0);

  let tfLabel = adminTimeframe === 'daily' ? 'Today' : adminTimeframe === 'weekly' ? '7 Days' : adminTimeframe === 'monthly' ? '30 Days' : 'All-Time';
  document.getElementById('admin-revenue-label').innerText = `Total Sales (${tfLabel})`;
  document.getElementById('admin-orders-label').innerText = `Total Pre-Orders (${tfLabel})`;

  adminRevenue.innerText = `₹ ${totalRevenue}`;
  document.getElementById('admin-total-orders-count').innerText = filteredOrders.length;
  document.getElementById('admin-active-stalls-count').innerText = stalls.length;

  // Render Per Vendor Breakdown Table
  renderPerVendorBreakdown(filteredOrders);

  // Render Student Order History Inspector (Default for prefilled reg No)
  if (studentSearchInput && studentSearchInput.value) {
    renderStudentInspector(studentSearchInput.value.trim());
  }

  // Render Menu List
  adminMenuList.innerHTML = '';
  stalls.forEach(s => {
    s.menu.forEach(item => {
      const row = document.createElement('div');
      row.className = 'menu-item-row';
      row.innerHTML = `
        <div class="menu-item-info">
          <strong>${item.name} <small style="color:var(--text-muted);">[${item.category}]</small></strong>
          <span>Stall: ${s.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap: 1rem;">
          <span class="price-tag">₹${item.price}</span>
          <button class="secondary-btn" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="toggleItemStock('${s.id}', '${item.id}')">
            ${item.available ? 'In Stock' : 'Out of Stock'}
          </button>
        </div>
      `;
      adminMenuList.appendChild(row);
    });
  });
}

function renderPerVendorBreakdown(filteredOrders) {
  const tbody = document.getElementById('admin-vendor-breakdown-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  stalls.forEach(s => {
    const stallOrders = filteredOrders.filter(o => o.stallId === s.id);
    const revenue = stallOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0);
    const avgOrderVal = stallOrders.length > 0 ? Math.round(revenue / stallOrders.length) : 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>📍 ${s.name}</strong></td>
      <td><code>${s.vendorId}</code></td>
      <td><code>${s.upiId}</code></td>
      <td><strong>${stallOrders.length}</strong> orders</td>
      <td><strong style="color: var(--accent-green);">₹ ${revenue}</strong></td>
      <td>₹ ${avgOrderVal}</td>
      <td><span class="status-indicator live">● Active</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStudentInspector(regNo) {
  const container = document.getElementById('student-inspector-result');
  if (!container) return;

  if (!regNo) {
    container.innerHTML = `<p class="subtext" style="padding: 1rem;">Please enter a valid Student Registration Number above.</p>`;
    return;
  }

  const studentOrders = orders.filter(o => o.studentReg === regNo);
  const totalSpent = studentOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0);

  // Calculate favorite stall
  const stallCounts = {};
  studentOrders.forEach(o => {
    stallCounts[o.stallName] = (stallCounts[o.stallName] || 0) + 1;
  });
  const favStall = Object.keys(stallCounts).reduce((a, b) => stallCounts[a] > stallCounts[b] ? a : b, 'N/A');

  let historyRows = '';
  if (studentOrders.length === 0) {
    historyRows = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No pre-orders recorded for Reg No: <strong>${regNo}</strong> yet.</td></tr>`;
  } else {
    studentOrders.slice().reverse().forEach(o => {
      historyRows += `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.stallName}</td>
          <td>${o.items.map(i => i.name).join(', ')}</td>
          <td><strong style="color: var(--accent-green);">₹ ${o.total}</strong></td>
          <td>${o.pickupSlot}</td>
          <td><span class="badge-status status-ready">${o.status}</span></td>
        </tr>
      `;
    });
  }

  container.innerHTML = `
    <div class="student-stats-summary">
      <div class="student-stat-pill">
        <span>Student Reg No</span>
        <strong>${regNo}</strong>
      </div>
      <div class="student-stat-pill">
        <span>Total Spent</span>
        <strong>₹ ${totalSpent}</strong>
      </div>
      <div class="student-stat-pill">
        <span>Total Pre-Orders</span>
        <strong>${studentOrders.length}</strong>
      </div>
      <div class="student-stat-pill">
        <span>Favorite Stall</span>
        <strong>${favStall}</strong>
      </div>
    </div>

    <h4 style="margin: 0.8rem 0 0.5rem 0; color: white;"><i class="fa-solid fa-clock-rotate-left text-green"></i> Order History Log</h4>
    <div class="table-responsive">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Stall</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Pickup Slot</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${historyRows}
        </tbody>
      </table>
    </div>
  `;
}

function exportSalesReportCSV() {
  if (orders.length === 0) {
    alert('No order records available to export.');
    return;
  }

  let csv = 'Order ID,Student Reg No,Stall Name,Items,Total Amount,Pickup Slot,Payment Status,Txn ID,Timestamp\n';
  orders.forEach(o => {
    const itemsStr = o.items.map(i => i.name).join(' | ');
    csv += `"${o.id}","${o.studentReg}","${o.stallName}","${itemsStr}",${o.total},"${o.pickupSlot}","${o.paymentStatus}","${o.txnId || ''}","${o.createdAt}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `Campus_Food_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  a.click();
}

function toggleItemStock(stallId, itemId) {
  const stall = stalls.find(s => s.id === stallId);
  if (stall) {
    const item = stall.menu.find(i => i.id === itemId);
    if (item) {
      item.available = !item.available;
      saveStalls();
      renderAdminView();
    }
  }
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
