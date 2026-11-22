/* booking.js - validation, slot availability and saving the reservation */
(function () {
  const form = document.getElementById("bookForm");
  const date = document.getElementById("bDate");
  date.min = todayStr();
  const max = new Date(); max.setDate(max.getDate() + 60);
  date.max = max.getFullYear() + "-" + String(max.getMonth() + 1).padStart(2, "0") + "-" + String(max.getDate()).padStart(2, "0");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); clearMsg();
    const v = id => document.getElementById(id).value;
    if (!Validate.name(v("bName"))) return showMsg("Please enter your full name (at least 3 letters).", false);
    if (!Validate.phone(v("bPhone"))) return showMsg("Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.", false);
    if (!Validate.email(v("bEmail"))) return showMsg("Please enter a valid email address.", false);
    if (!v("bDate")) return showMsg("Please choose a date.", false);
    if (v("bDate") < todayStr()) return showMsg("The date cannot be in the past.", false);
    if (!v("bTime")) return showMsg("Please choose a time.", false);
    if (v("bTime") < "09:00" || v("bTime") > "22:00") return showMsg("We are open from 9:00 AM to 10:00 PM. Please pick a time in that range.", false);
    if (v("bDate") === todayStr()) {
      const now = new Date();
      const nowStr = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      if (v("bTime") <= nowStr) return showMsg("That time has already passed today. Please choose a later time.", false);
    }
    if (!v("bGuests")) return showMsg("Please select the number of guests.", false);

    // slot availability: at most MAX_TABLES_PER_HOUR bookings in the same hour
    const bookings = Store.get("bb_bookings", []);
    const hour = v("bTime").slice(0, 2);
    const taken = bookings.filter(b => b.date === v("bDate") && b.time.slice(0, 2) === hour).length;
    if (taken >= MAX_TABLES_PER_HOUR) return showMsg("Sorry, all tables are booked for that hour. Please choose another time.", false);

    const booking = {
      id: newId("TB"),
      name: v("bName").trim(), phone: v("bPhone").trim(), email: v("bEmail").trim(),
      date: v("bDate"), time: v("bTime"), guests: v("bGuests") === "7" ? "7+" : v("bGuests"),
      request: v("bRequest").trim(), created: new Date().toISOString()
    };
    bookings.push(booking);
    if (!Store.set("bb_bookings", bookings)) return showMsg("Could not save the reservation in this browser.", false);
    location.href = "pagebook2.html?id=" + encodeURIComponent(booking.id);
  });
})();
