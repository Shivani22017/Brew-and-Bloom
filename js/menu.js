/* menu.js - builds the menu from data.js, adds search, filter and "Add" buttons */
(function () {
  const list = document.getElementById("menuList");
  const chips = document.getElementById("menuChips");
  const search = document.getElementById("menuSearch");
  const empty = document.getElementById("menuEmpty");
  let activeCat = "All";

  function chipHtml(label) {
    return '<button type="button" class="chip' + (label === activeCat ? " active" : "") + '" data-cat="' + escapeHtml(label) + '">' + escapeHtml(label) + "</button>";
  }
  function renderChips() { chips.innerHTML = chipHtml("All") + CATEGORIES.map(chipHtml).join(""); }

  function render() {
    const q = search.value.trim().toLowerCase();
    let html = "", shown = 0;
    CATEGORIES.forEach(function (cat, idx) {
      if (activeCat !== "All" && activeCat !== cat) return;
      const items = MENU.filter(m => m.category === cat && m.name.toLowerCase().includes(q));
      if (!items.length) return;
      shown += items.length;
      html += (idx === 0 ? '<h1 class="title">COFFEE</h1>' : '<h2 class="sub-title">' + escapeHtml(cat) + "</h2>");
      html += '<div class="menu-section">' + items.map(function (m) {
        return '<div class="item"><span class="iname">' + escapeHtml(m.name) + '</span><span class="iprice">Rs.' + m.price +
          '</span><button type="button" class="add-btn" data-id="' + m.id + '" aria-label="Add ' + escapeHtml(m.name) + ' to order">+ Add</button></div>';
      }).join("") + "</div>";
    });
    list.innerHTML = html;
    empty.hidden = shown > 0;
  }

  chips.addEventListener("click", function (e) {
    const b = e.target.closest(".chip"); if (!b) return;
    activeCat = b.dataset.cat; renderChips(); render();
  });
  search.addEventListener("input", render);
  list.addEventListener("click", function (e) {
    const b = e.target.closest(".add-btn"); if (!b) return;
    const cart = getCart();
    cart[b.dataset.id] = Math.min((cart[b.dataset.id] || 0) + 1, 20);
    saveCart(cart);
    toast("Added " + findItem(b.dataset.id).name);
  });
  renderChips(); render(); updateCartBadge();
})();
