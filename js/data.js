/* data.js - shared data and helper functions for every page */

// Single source of truth for the menu (used by the Menu page and the Order page)
const CATEGORIES = ["Coffee", "Special Drinks", "Tea & Others"];
const MENU = [
  { id: "espresso", name: "Espresso", price: 50, category: "Coffee" },
  { id: "cappuccino", name: "Cappuccino", price: 70, category: "Coffee" },
  { id: "latte", name: "Latte", price: 100, category: "Coffee" },
  { id: "flat-white", name: "Flat White", price: 120, category: "Coffee" },
  { id: "americano", name: "Americano", price: 130, category: "Coffee" },
  { id: "cold-brew", name: "Cold Brew", price: 130, category: "Coffee" },
  { id: "caramel-latte", name: "Caramel Latte", price: 150, category: "Special Drinks" },
  { id: "mocha", name: "Mocha", price: 170, category: "Special Drinks" },
  { id: "vanilla-cold-brew", name: "Vanilla Cold Brew", price: 170, category: "Special Drinks" },
  { id: "signature", name: "Brew & Bloom Signature Coffee", price: 150, category: "Special Drinks" },
  { id: "masala-chai", name: "Masala Chai", price: 25, category: "Tea & Others" },
  { id: "green-tea", name: "Green Tea", price: 25, category: "Tea & Others" },
  { id: "herbal-tea", name: "Herbal Tea", price: 50, category: "Tea & Others" },
  { id: "hot-chocolate", name: "Hot Chocolate", price: 70, category: "Tea & Others" }
];
const GST_RATE = 0.05;
const MAX_TABLES_PER_HOUR = 5;   // reservation capacity for one hour slot

// Safe wrapper around localStorage (works even if storage is blocked)
const Store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  },
  remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
};

function findItem(id) { return MENU.find(m => m.id === id); }
function money(n) { return "Rs." + Number(n).toFixed(2); }
function newId(prefix) {
  return prefix + "-" + Date.now().toString(36).toUpperCase().slice(-6);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---- cart (stored as { itemId: quantity }) ----
function getCart() { return Store.get("bb_cart", {}); }
function saveCart(cart) { Store.set("bb_cart", cart); updateCartBadge(); }
function cartCount() { return Object.values(getCart()).reduce((a, b) => a + b, 0); }
function calcTotals(cart) {
  let subtotal = 0;
  Object.keys(cart).forEach(id => { const it = findItem(id); if (it) subtotal += it.price * cart[id]; });
  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  const total = Math.round((subtotal + gst) * 100) / 100;
  return { subtotal, gst, total };
}
function updateCartBadge() {
  const n = cartCount();
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = n; el.hidden = n === 0; });
  document.querySelectorAll(".cart-count-inline").forEach(el => { el.textContent = n; });
  const fab = document.getElementById("viewOrder");
  if (fab) fab.hidden = n === 0;
}

// ---- small pop-up message ----
function toast(message) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove("show"), 1800);
}

// ---- form message helper ----
function showMsg(text, ok) {
  const box = document.getElementById("formMsg");
  if (!box) return;
  box.textContent = text;
  box.className = "form-msg " + (ok ? "ok" : "error");
  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}
function clearMsg() { const box = document.getElementById("formMsg"); if (box) box.hidden = true; }

// ---- validators ----
const Validate = {
  name: v => /^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.trim()),
  phone: v => /^[6-9]\d{9}$/.test(v.trim()),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
};
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
