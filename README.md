# Brew & Bloom Cafe - Advanced Website Project

A multi-page cafe website built with HTML, CSS and vanilla JavaScript (no libraries, no server).
Open `index.html` in a browser to start. Data is stored in the browser's `localStorage`.

## What is new in this version

| Area | Upgrade |
|------|---------|
| Menu | Menu is built from one data file (`js/data.js`), so prices are always the same on the Menu and Order pages. Search box, category filter and a "+ Add" button on every item. |
| Order | Multi-item cart with quantity +/- and remove, automatic Subtotal, 5% GST and Total, validation of name and phone, order saved with an Order ID and shown on `order-success.html`. |
| Booking | Real validation (name, 10-digit phone, email, date not in the past, opening hours 9 AM - 10 PM), slot check (max 5 tables per hour), confirmation page shows the booking details. |
| Reviews | Star-rating form on the Contact page, average rating, reviews saved in the browser. |
| Owner dashboard | `admin.html` shows orders, revenue, reservations, average rating, a top-items bar chart, tables and CSV export. |
| Responsive | Hamburger menu and mobile layouts for every page. |
| Fixes | Pop-up no longer appears before validation, duplicate `<html>` tags removed, price mismatches fixed, page titles added. |

## File structure

```
index.html          Home
about.html          About Us
menu.html           Menu (search, filter, add to order)
order.html          Cart + order form
order-success.html  Order confirmation
book.html           Table reservation
pagebook2.html      Reservation confirmation
contact.html       Contact + reviews
admin.html          Owner dashboard (demo)
style.css, about.css, menu.css, oder.css, reservation.css, book2.css, contact-review.css   original styles
advanced.css        new styles + responsive rules
js/data.js          menu data, storage helpers, validators
js/nav.js           mobile menu + cart badge
js/menu.js          menu rendering, search, filter
js/order.js         cart, totals, order saving
js/booking.js       reservation validation + slots
js/success.js       confirmation pages
js/contact.js       reviews
js/admin.js         dashboard
images/             original images
```

## How to test

1. Menu: search "latte", click category chips, press "+ Add" on two items.
2. Order: change quantities, check the total (Subtotal + 5% GST), try an empty name and a wrong phone number, then place the order.
3. Booking: try a past date and a time after 10 PM to see the messages, then book a table.
4. Contact: submit a review without stars, then with stars.
5. Owner Dashboard (link in the footer): see the numbers and the chart update.

## Limitations (for the viva)

- Data lives only in the browser that was used. A real system needs a backend and a database (Node.js / PHP / Django).
- The dashboard has no login. It is for demonstration.
- No online payment.
