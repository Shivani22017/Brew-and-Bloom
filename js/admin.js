/* admin.js - owner dashboard: totals, top-items chart, tables, CSV export */
(function () {
  const orders = Store.get("bb_orders", []);
  const bookings = Store.get("bb_bookings", []);
  const reviews = Store.get("bb_reviews", []);

  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "-";
  document.getElementById("stats").innerHTML = [
    ["Orders", orders.length], ["Revenue", money(revenue)], ["Reservations", bookings.length], ["Avg. Rating", avg]
  ].map(s => '<div class="stat"><span class="stat-num">' + s[1] + '</span><span class="stat-label">' + s[0] + "</span></div>").join("");

  // top items (units sold)
  const count = {};
  orders.forEach(o => o.items.forEach(i => { count[i.name] = (count[i.name] || 0) + i.qty; }));
  const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const chart = document.getElementById("chart");
  if (!top.length) chart.innerHTML = '<p class="empty-msg">No orders yet. Place an order to see the chart.</p>';
  else {
    const max = top[0][1];
    chart.innerHTML = top.map(t => '<div class="bar-row"><span class="bar-label">' + escapeHtml(t[0]) +
      '</span><span class="bar-track"><span class="bar-fill" style="width:' + Math.round(t[1] / max * 100) + '%"></span></span><span class="bar-val">' + t[1] + "</span></div>").join("");
  }

  function fmt(iso) { const d = new Date(iso); return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  const ot = document.getElementById("ordersTable");
  ot.innerHTML = "<thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Placed</th></tr></thead><tbody>" +
    (orders.length ? orders.slice().reverse().map(o => "<tr><td>" + escapeHtml(o.id) + "</td><td>" + escapeHtml(o.name) + "</td><td>" +
      o.items.map(i => escapeHtml(i.name) + " x" + i.qty).join(", ") + "</td><td>" + money(o.total) + "</td><td>" + fmt(o.time) + "</td></tr>").join("")
      : '<tr><td colspan="5" class="empty-msg">No orders yet.</td></tr>') + "</tbody>";
  const bt = document.getElementById("bookingsTable");
  bt.innerHTML = "<thead><tr><th>ID</th><th>Guest</th><th>Date</th><th>Time</th><th>Guests</th></tr></thead><tbody>" +
    (bookings.length ? bookings.slice().reverse().map(b => "<tr><td>" + escapeHtml(b.id) + "</td><td>" + escapeHtml(b.name) + "</td><td>" + escapeHtml(b.date) +
      "</td><td>" + escapeHtml(b.time) + "</td><td>" + escapeHtml(b.guests) + "</td></tr>").join("")
      : '<tr><td colspan="5" class="empty-msg">No reservations yet.</td></tr>') + "</tbody>";

  document.getElementById("exportOrders").addEventListener("click", function () {
    if (!orders.length) { toast("No orders to export"); return; }
    const q = s => '"' + String(s).replace(/"/g, '""') + '"';
    const rows = [["Order ID", "Customer", "Phone", "Items", "Subtotal", "GST", "Total", "Placed"]].concat(
      orders.map(o => [o.id, o.name, o.phone, o.items.map(i => i.name + " x" + i.qty).join("; "), o.subtotal, o.gst, o.total, o.time]));
    const blob = new Blob([rows.map(r => r.map(q).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "brew-and-bloom-orders.csv";
    document.body.appendChild(a); a.click(); a.remove();
  });
  document.getElementById("clearData").addEventListener("click", function () {
    if (confirm("Delete all demo orders, reservations and reviews from this browser?")) {
      ["bb_orders", "bb_bookings", "bb_reviews", "bb_cart"].forEach(Store.remove); location.reload();
    }
  });
})();
