# Badee Beauty — Front-end specification

*Version: living document · audience: builders, future-you, anyone inheriting the keys to the vitrine.*

This file is the **story of what the storefront must do** and **how this codebase chooses to do it**. It is not a legal contract; it is a compass. When code and spec disagree, either fix the code or fix the spec — never both silently.

---

## 1. North star

**Badee Beauty** sells cosmetics online with a calm, editorial feel: discover products, read the blog, fill a cart, confirm an order for delivery in Algeria. The front-end must stay **fast**, **honest** (clear stock, options, and totals), and **reachable** (contact and confirmation paths that work without a CS degree).

**Non-goals for this SPA:** running payments in-browser (COD is the model), replacing the backend’s source of truth for inventory, or becoming a native app.

---

## 2. Voices in the room

| Who | What they need |
|-----|----------------|
| **Visitor** | Browse, filter, fall in love with a shade, maybe leave without buying — no account required to shop. |
| **Customer** | Cart, checkout with real wilaya/commune data, order confirmation, optional account for dashboard. |
| **Admin** | Protected dashboard; reality lives in backend + route guards. |
| **Operations** | Orders hit the API; emails (contact + optional order mail) via EmailJS when configured. |

---

## 3. Experience map (routes)

All public shopping lives under **`MainLayout`** unless noted.

| Path | Intent |
|------|--------|
| `/` | Home, hero, entry to the universe. |
| `/products`, `/product/:id` | Catalogue and detail; variants/options enforced where required. |
| `/checkout` | Algeria-aware address form, totals, place order. |
| `/order-confirmation` | Post-purchase reassurance. |
| `/blog`, `/blog/...`, `/blog-beaute` | Content, SEO-friendly slugs where used. |
| `/about`, `/mission`, `/faq`, `/contact`, `/privacy`, `/terms` | Trust and support. |
| `/login`, `/register` | Auth; **PublicOnlyRoute** keeps logged-in users from circling back awkwardly. |
| `/dashboard` | **AdminRoute** — not for window shoppers. |
| `*` | **NotFound** — a soft landing, not a server error page. |

**Scroll:** `ScrollToTop` resets position on navigation so long pages don’t feel broken.

---

## 4. Functional specification

### 4.1 Catalogue & product detail

- Products are loaded and managed via Redux (`productSlice`) and API services; detail view must respect **options** (e.g. shades) when `productRequiresOptionSelection` says so — **add to cart without a required option is a no-op**.
- Cart lines are keyed by **product id + selected option** (`getCartLineId`) so two shades are two lines, not a collision.
- Wishlist is a first-class drawer experience; persistence follows existing slice rules.

### 4.2 Cart & checkout

- **Subtotal** = Σ (price × quantity). **Delivery fee** follows business rules (e.g. threshold for free delivery — see `Checkout.js`).
- Checkout payload aligns with **backend `orderSchema`**: customer name, phone, wilaya (labelled), commune, amounts, status, note, email, line items (product id, name, price, qty, image, selected option).
- Logged-in users may send **`userId`**; guests checkout without it.
- On success: **clear cart**, navigate to confirmation; optionally send **order confirmation email** via EmailJS when env is complete **and** customer email present (failures are logged, not blocking).

### 4.3 Auth

- JWT stored as **`jt_token`** in `localStorage`; Axios attaches `Authorization: Bearer …` on each request.
- **FormData** uploads must not force a manual `Content-Type` (interceptor strips it so multipart boundaries survive).

### 4.4 Content & language

- UI copy is funnelled through **`LangContext`** with **`LANGS.fr`** as the active dictionary (structure allows growth; today the compass points **FR** and **LTR**).

### 4.5 Contact & notifications

- **Contact form** sends EmailJS payloads: `user_name`, `user_email`, `message`, optional `user_phone`. If EmailJS is not configured, the UI explains that fact instead of fake success.
- **Newsletter / blog** paths may reuse the contact template with a fixed message body — same contract as contact.
- **Order mail** template parameters are documented in `emailjsService.js` (`customer_email`, `customer_name`, `items_lines`, totals, etc.). Templates in the EmailJS dashboard must use **matching variable names**.

---

## 5. Integration contracts

### 5.1 HTTP API

| Concern | Rule |
|---------|------|
| Base URL | `REACT_APP_API_BASE_URL` (no trailing slash). Fallback exists in code for development; production should always set env. |
| Media | Optional `REACT_APP_MEDIA_BASE_URL` pattern for assets if API host ≠ media host. |
| Errors | Normalized handling via shared utilities where present; user-facing messages should stay human in FR. |

### 5.2 EmailJS (browser only)

| Variable | Role |
|----------|------|
| `REACT_APP_EMAILJS_PUBLIC_KEY` | Client init — **never** ship private keys in this app. |
| `REACT_APP_EMAILJS_SERVICE_ID` | Service binding. |
| `REACT_APP_EMAILJS_TEMPLATE_CONTACT_ID` | Contact / newsletter-style sends. |
| `REACT_APP_EMAILJS_TEMPLATE_ORDER_ID` | Post-order confirmation. |

### 5.3 Static hosting (e.g. Netlify)

- **Build output:** `build/`.
- **`netlify.toml`** pins Node 20 and avoids production-only npm installs that starve the tree.
- **Build command** uses a direct `node … react-scripts.js build` path so CI doesn’t trip on `.bin` permission quirks.

---

## 6. Non-functional expectations

- **Performance:** CRA production build, code splitting where the bundler allows; avoid shipping enormous images without lazy strategies where applicable.
- **Accessibility:** Prefer semantic headings, form labels, and focus states consistent with existing components.
- **Security:** Tokens in `localStorage` imply XSS hygiene; don’t inject untrusted HTML; don’t commit `.env`.
- **Brand:** Business identity (phone, email, social, hours) is centralized in **`src/data/business.js`** — one edit updates footer, contact, and legal touchpoints.

---

## 7. How to read this repo next

1. **`src/App.js`** — truth table for URLs.  
2. **`src/services/api.js`** — how the world is reached.  
3. **`src/redux/`** — cart, auth, orders, products.  
4. **`src/pages/Checkout.js`** — the contract with the backend in one place.  
5. **`src/services/emailjsService.js`** — every key the templates must echo.

---

## 8. Closing mantra

*Ship clarity: right total, right wilaya, right shade, right inbox.*

When in doubt, open the contact page, place a test order on staging, and read the network tab like a love letter, if it’s honest, the spec is alive.
