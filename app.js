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

// Always update local storage stalls if Excel menu structure changed
localStorage.setItem('campus_stalls', JSON.stringify(defaultStalls));
let stalls = defaultStalls;
let orders = JSON.parse(localStorage.getItem('campus_orders')) || [];
let currentVendor = JSON.parse(localStorage.getItem('current_vendor')) || null;

// Chatbot Flow State
let chatState = {
  step: 'IDLE', // IDLE, SELECT_STALL, SELECT_CATEGORY, SELECT_ITEMS, SELECT_SLOT
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

// Admin DOM
const adminMenuList = document.getElementById('admin-menu-list');
const addItemBtn = document.getElementById('add-menu-item-btn');
const itemModal = document.getElementById('item-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const addItemForm = document.getElementById('add-item-form');
const adminRevenue = document.getElementById('admin-revenue');

// Payment Modal DOM
const paymentModal = document.getElementById('payment-modal');
const closePaymentModalBtn = document.getElementById('close-payment-modal-btn');
const paymentModalContent = document.getElementById('payment-modal-content');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupViewNavigation();
  setupChatListeners();
  setupVendorListeners();
  setupAdminListeners();
  setupPaymentModalListeners();
  renderVendorDashboard();
  renderAdminView();

  // Listen for storage events across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'campus_orders') {
      orders = JSON.parse(e.newValue || '[]');
      renderVendorDashboard();
      renderAdminView();
      checkOrderStatusChanges();
    }
  });
});

// View Navigation
function setupViewNavigation() {
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      viewBtns.forEach(b => b.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetView).classList.add('active');
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
}

window.addEventListener('ordersUpdated', () => {
  renderVendorDashboard();
  renderAdminView();
});

// ================= CHATBOT LOGIC =================

function setupChatListeners() {
  sendBtn.addEventListener('click', handleUserSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserSendMessage();
  });

  if (startChatBtn) {
    startChatBtn.addEventListener('click', () => {
      document.querySelector('.role-nav .nav-btn[data-view="student-view"]').click();
      chatInput.focus();
      chatInput.scrollIntoView({ behavior: 'smooth' });
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

      const itemsInCat = stall.menu.filter(i => i.category === chosenCat && i.available);
      let itemOptions = itemsInCat.map(i => ({ label: `➕ ${i.name} (₹${i.price})`, value: i.name }));
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

    const foundItem = stall.menu.find(i => userText.includes(i.name));

    if (foundItem) {
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

// Render Vendor Direct QR Payment with Laser Scanner Animation & Clickable UPI Link
function renderVendorQRPaymentCard() {
  const stall = chatState.selectedStall;
  const total = chatState.cartItems.reduce((acc, c) => acc + c.price, 0);
  const upiId = stall.upiId || 'nepaliswadh@lpu.upi';
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(stall.name)}&am=${total}&cu=INR&tn=${encodeURIComponent('PreOrder_' + stall.name)}`;

  const qrHtml = `
    📱 <strong>Direct Vendor UPI Payment QR</strong><br>
    Scan with phone or <strong>click QR image / button below</strong> to pay via any UPI app:<br>

    <div class="qr-container-animated">
      <div class="qr-laser-scanner"></div>
      <a href="${upiDeepLink}" target="_blank" class="qr-click-wrapper" onclick="handleQRClickToPay(event)" title="Click to open GPay, PhonePe, Paytm, or BHIM">
        <img src="QR.jpeg" alt="Vendor UPI QR Code" class="vendor-qr-img">
      </a>
      <span class="qr-click-hint">
        <i class="fa-solid fa-arrow-pointer"></i> Click QR to Open UPI App (GPay / PhonePe / Paytm)
      </span>
    </div>

    <div class="upi-apps-container">
      <a href="${upiDeepLink}" target="_blank" class="upi-app-btn pulse" onclick="handleQRClickToPay(event)">
        <i class="fa-solid fa-mobile-screen-button"></i> Pay ₹${total} via UPI App Direct
      </a>
      <div class="upi-apps-row">
        <span class="upi-pill">Google Pay</span>
        <span class="upi-pill">PhonePe</span>
        <span class="upi-pill">Paytm</span>
        <span class="upi-pill">BHIM</span>
      </div>
    </div>

    <strong>Amount Payable: ₹${total}</strong> (100% Direct Transfer to ${stall.name})<br>
    <small style="color: #667781;">⚡ Scan or click above, then tap button below after payment!</small>
  `;

  appendBotBubble(qrHtml, [
    { label: `💸 I Have Paid ₹${total} to Vendor`, value: 'CONFIRM_QR_PAYMENT' },
    { label: `🔒 Enter UPI PIN in Modal`, value: 'PAY_NOW_UPI' },
    { label: `❌ Cancel Order`, value: 'CANCEL_ORDER' }
  ]);
}

window.handleQRClickToPay = function(e) {
  // If on desktop where deep links might not open natively, provide smooth fallback feedback
  setTimeout(() => {
    openPaymentModal('Direct UPI App Link');
  }, 400);
};

// Trigger Animated Payment Processing & Direct Redirection to Simulator
function triggerAnimatedPaymentSuccess(paymentData) {
  typingIndicator.classList.remove('hidden');

  setTimeout(() => {
    typingIndicator.classList.add('hidden');

    // Append Payment Success card with animation
    completeOrderWithPayment(paymentData);

    // Scroll & focus page directly to WhatsApp simulator
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
      <p style="font-size: 0.85rem; color: #54656f;">Direct Transfer Completed to Vendor</p>
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
}

function renderVendorDashboard() {
  if (!currentVendor) {
    vendorLoginCard.classList.remove('hidden');
    vendorDashboard.classList.add('hidden');
    return;
  }

  vendorLoginCard.classList.add('hidden');
  vendorDashboard.classList.remove('hidden');

  const stallOrders = orders.filter(o => o.stallId === currentVendor.id);
  const totalDirectEarnings = stallOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0);

  stallNameTitle.innerHTML = `Stall: ${currentVendor.name} <span style="font-size: 0.85rem; color: var(--accent-green); font-weight: 500;">(Direct Earnings: ₹${totalDirectEarnings})</span>`;

  document.getElementById('stat-total-orders').innerText = stallOrders.length;
  document.getElementById('stat-pending-orders').innerText = stallOrders.filter(o => o.status === 'CONFIRMED').length;
  document.getElementById('stat-preparing-orders').innerText = stallOrders.filter(o => o.status === 'PREPARING').length;
  document.getElementById('stat-ready-orders').innerText = stallOrders.filter(o => o.status === 'READY').length;

  vendorOrdersTbody.innerHTML = '';
  if (stallOrders.length === 0) {
    vendorOrdersTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 2rem;">No orders placed for ${currentVendor.name} yet. Place an order from the Student Chatbot!</td></tr>`;
    return;
  }

  stallOrders.slice().reverse().forEach(o => {
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
  closeModalBtn.addEventListener('click', () => itemModal.classList.add('hidden'));

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
}

function renderAdminView() {
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  adminRevenue.innerText = `₹ ${totalRevenue}`;

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
