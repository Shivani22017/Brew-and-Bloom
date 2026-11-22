/* contact.js - customer reviews with star rating (saved in the browser) */
(function () {
  const DEFAULTS = [
    { name: "Guest", rating: 5, text: "Amazing coffee and peaceful ambience!" },
    { name: "Guest", rating: 4, text: "Best place to chill with friends." },
    { name: "Guest", rating: 5, text: "Loved the cold brew and desserts." }
  ];
  const list = document.getElementById("reviewList");
  const summary = document.getElementById("ratingSummary");
  const stars = n => "⭐".repeat(n);

  function getReviews() { return Store.get("bb_reviews", DEFAULTS); }
  function render() {
    const r = getReviews();
    const avg = r.reduce((a, b) => a + b.rating, 0) / r.length;
    summary.textContent = "Average rating: " + avg.toFixed(1) + " / 5  (" + r.length + " reviews)";
    list.innerHTML = r.slice().reverse().map(x =>
      '<div class="review">"' + escapeHtml(x.text) + '" <span>' + stars(x.rating) + '</span><small>- ' + escapeHtml(x.name) + "</small></div>").join("");
  }
  document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault(); clearMsg();
    const name = document.getElementById("rName").value.trim();
    const text = document.getElementById("rText").value.trim();
    const checked = document.querySelector('input[name="rating"]:checked');
    if (name.length < 2) return showMsg("Please enter your name.", false);
    if (!checked) return showMsg("Please select a star rating.", false);
    if (text.length < 10) return showMsg("Please write at least 10 characters in your review.", false);
    const r = getReviews(); r.push({ name: name, rating: parseInt(checked.value, 10), text: text });
    Store.set("bb_reviews", r);
    this.reset(); render(); showMsg("Thank you for your review!", true);
  });
  render();
})();
