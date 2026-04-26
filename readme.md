# Badee Beauty · Front-end

> *L’éclat commence ici.*  
> The storefront for **Badee Beauty** — Algerian cosmetics, thoughtful UX, and a checkout that respects how people actually shop.

This repository is the **React** face of the brand: catalogue, blog, cart, orders, and the quiet magic that ties it to your API and inbox.

---

## What lives in this app

| Zone | What you get |
|------|----------------|
| **Shop** | Product listing, detail pages, shades & variants, wishlist drawer |
| **Cart & checkout** | Algerian wilayas / communes, delivery logic, order handoff to the backend |
| **Stories** | Blog index, beauty articles, ritual pieces (e.g. mousse) |
| **People** | Login, register, customer dashboard; admin route for the back office |
| **Trust** | FAQ, mission, privacy, terms, contact — plus **EmailJS** for the form and order mails |

Routes are wired in `src/App.js`; layout and chrome live under `src/layouts` and `src/components`.

---

## Tech stack

- **React 18** + **React Router 7**
- **Redux Toolkit** for cart, auth, orders, products
- **Axios** for HTTP
- **EmailJS** (`@emailjs/browser`) for contact & order notifications
- **Create React App** (`react-scripts` 5) — no eject, no drama

---

## Quick start

```bash
git clone <your-repo-url>
cd badee-beauty   # or your local folder name
npm install
```

Create a `.env` in the project root (never commit secrets you wouldn’t put in a postcard):

```env
REACT_APP_API_BASE_URL=https://your-api.example.com

REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_CONTACT_ID=your_contact_template
REACT_APP_EMAILJS_TEMPLATE_ORDER_ID=your_order_template
```

Then:

```bash
npm start
```

Opens the dev server (default [http://localhost:3000](http://localhost:3000)).

**Production build**

```bash
npm run build
```

Output lands in `build/` — static hosting ready.

---

## Deploy notes (Netlify)

This project includes a **`netlify.toml`**: Node 20, publish dir `build`, and settings that avoid half-empty `npm install` runs on CI.  
Set the same `REACT_APP_*` variables in the Netlify UI so the built bundle can talk to your API and EmailJS.

---

## Project map (cheat sheet)

```
src/
  components/     UI building blocks, hero, nav, drawers…
  pages/          Route-level screens
  redux/          Slices & store
  services/       API helpers, EmailJS wrapper
  data/           Static product/business data where needed
  context/        e.g. language
```

---

## Brand touchpoints

- **Site** — this repo  
- **Social** — see `src/data/business.js` for official links and contact details  

---

## License & credits

Private project for **Badee Beauty**.  
Stack and tooling belong to their respective authors; the experience is ours to refine.

---

*Built with care by khadidja.*
