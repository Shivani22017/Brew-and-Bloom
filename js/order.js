/* order.js - cart, automatic total, validation and saving the order */
(function () {
  const form = document.getElementById("orderForm");
  const sel = document.getElementById("item");
  const qty = document.getElementById("qty");
  const body = document.getElementById("cartBody");
  const emptyMsg = document.getElementById("cartEmpty");

  // fill the drop-down from the shared menu data
  CATEGORIES.forEach(function (cat) {
    const g = document.createElement("optgroup"); g.label = cat;
    MENU.filter(m => m.category === cat).forEach(function (m) {
      const o = document.createElement("option"); o.value = m.id; o.textContent = m.name + " - Rs." + m.price; g.appendChild(o);
    });
    sel.appendChild(g);
  });

  function render() {
    const cart = getCart();
    const ids = Object.keys(cart).filter(findItem);
    body.innerHTML = ids.map(function (id) {
      const it = findItem(id), q = cart[id];
      return "<tr><td>" + escapeHtml(it.name) + '</td><td class="qty-cell">' +
        '<button type="button" class="q-btn" data-act="dec" data-id="' + id + '" aria-label="Decrease">-</button> ' + q +
        ' <button type="button" class="q-btn" data-act="inc" data-id="' + id + '" aria-label="Increase">+</button></td>' +
        "<td>Rs." + (it.price * q) + '</td><td><button type="button" class="q-btn del" data-act="del" data-id="' + id + '" aria-label="Remove ' + escapeHtml(it.name) + '">&times;</button></td></tr>';
    }).join("");
    emptyMsg.hidden = ids.length > 0;
    const t = calcTotals(cart);
    document.getElementById("subtotal").textContent = money(t.subtotal);
    document.getElementById("gst").textContent = money(t.gst);
    document.getElementById("grandTotal").textContent = money(t.total);
    document.getElementById("total").value = ids.length ? money(t.total) : "";
    updateCartBadge();
  }

  document.getElementById("addItem").addEventListener("click", function () {
    clearMsg();
    const n = parseInt(qty.value, 10);
    if (!sel.value) { showMsg("Please select an item to add.", false); return; }
    if (!(n >= 1 && n <= 20)) { showMsg("Quantity must be between 1 and 20.", false); return; }
    const cart = getCart();
    cart[sel.value] = Math.min((cart[sel.value] || 0) + n, 20);
    saveCart(cart);
    toast("Added " + findItem(sel.value).name);
    sel.value = ""; qty.value = 1; render();
  });

  body.addEventListener("click", function (e) {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const cart = getCart(), id = b.dataset.id;
    if (b.dataset.act === "inc") cart[id] = Math.min(cart[id] + 1, 20);
    if (b.dataset.act === "dec") cart[id] = cart[id] - 1;
    if (b.dataset.act === "del" || cart[id] <= 0) delete cart[id];
    saveCart(cart); render();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); clearMsg();
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const cart = getCart();
    if (!Validate.name(name)) { showMsg("Please enter a valid name (letters only, at least 3 characters).", false); return; }
    if (!Validate.phone(phone)) { showMsg("Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.", false); return; }
    if (!Object.keys(cart).filter(findItem).length) { showMsg("Your order is empty. Please add at least one item.", false); return; }

    const t = calcTotals(cart);
    const order = {
      id: newId("BB"),
      name: name.trim(), phone: phone.trim(),
      items: Object.keys(cart).filter(findItem).map(id => ({ id: id, name: findItem(id).name, price: findItem(id).price, qty: cart[id] })),
      subtotal: t.subtotal, gst: t.gst, total: t.total,
      notes: document.getElementById("notes").value.trim(),
      time: new Date().toISOString()
    };
    const orders = Store.get("bb_orders", []);
    orders.push(order);
    if (!Store.set("bb_orders", orders)) { showMsg("Could not save the order in this browser. Please allow storage and try again.", false); return; }
    Store.remove("bb_cart");
    location.href = "order-success.html?id=" + encodeURIComponent(order.id);
  });
  render();
})();
