/* success.js - shows the saved order or booking on the confirmation pages */
(function () {
  const id = new URLSearchParams(location.search).get("id");
  const orderBox = document.getElementById("orderSummary");
  const bookBox = document.getElementById("bookingSummary");

  if (orderBox) {
    const o = Store.get("bb_orders", []).find(x => x.id === id);
    if (!o) { orderBox.innerHTML = "<p>We could not find this order on this device.</p>"; return; }
    document.getElementById("orderIntro").innerHTML = "Thank you, <strong>" + escapeHtml(o.name) + "</strong>! Your order <strong>" + escapeHtml(o.id) + "</strong> has been placed successfully.";
    orderBox.innerHTML = '<table class="summary-table"><thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead><tbody>' +
      o.items.map(i => "<tr><td>" + escapeHtml(i.name) + "</td><td>" + i.qty + "</td><td>Rs." + (i.price * i.qty) + "</td></tr>").join("") +
      '</tbody><tfoot><tr><td colspan="2">Subtotal</td><td>' + money(o.subtotal) + '</td></tr><tr><td colspan="2">GST (5%)</td><td>' + money(o.gst) +
      '</td></tr><tr class="grand"><td colspan="2">Total</td><td>' + money(o.total) + "</td></tr></tfoot></table>" +
      (o.notes ? "<p><em>Note: " + escapeHtml(o.notes) + "</em></p>" : "");
  }
  if (bookBox) {
    const b = Store.get("bb_bookings", []).find(x => x.id === id);
    if (!b) return;
    bookBox.innerHTML = '<table class="summary-table"><tbody>' +
      "<tr><td>Booking ID</td><td>" + escapeHtml(b.id) + "</td></tr>" +
      "<tr><td>Name</td><td>" + escapeHtml(b.name) + "</td></tr>" +
      "<tr><td>Date</td><td>" + escapeHtml(b.date) + "</td></tr>" +
      "<tr><td>Time</td><td>" + escapeHtml(b.time) + "</td></tr>" +
      "<tr><td>Guests</td><td>" + escapeHtml(b.guests) + "</td></tr>" +
      (b.request ? "<tr><td>Request</td><td>" + escapeHtml(b.request) + "</td></tr>" : "") + "</tbody></table>";
  }
})();
