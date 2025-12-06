# 🩺 **Test Strip Marketplace**

### *A modern, role-based classifieds platform for diabetic supply buyers & sellers*

Test Strip Marketplace is a streamlined, Craigslist-style web application designed for the diabetic supplies resale ecosystem.
Buyers, wholesalers, and admin users can post ads, manage listings, and connect with sellers in a clean, mobile-friendly interface.

The platform is built for speed, clarity, and growth — serving as a public marketplace for buyers while offering powerful tools for admin-driven seeding and moderation.

---

## 🚀 **Tech Stack**

**Frontend**

* React 18 + TypeScript
* Vite build engine
* Custom component architecture (no UI library dependencies)
* SPA navigation using internal state-based routing

**Backend (serverless)**

* Firebase Authentication
* Firebase Realtime Database
* Firebase Storage
* Firebase Hosting–ready (optional future)

**State & Logic**

* Custom React context (`authContext`)
* Full role support: `buyer`, `wholesaler`, `seller`, `admin`, and `guest`
* Real-time ads feed synchronized from RTDB
* Multi-step posting wizard
* Admin-only posting flow (“unclaimed ads”)

---

## 🛍️ **Project Purpose**

The diabetic supplies resale market spans the U.S. and relies heavily on unstructured platforms like Craigslist, OfferUp, and Facebook groups.

**Test Strip Marketplace** brings order and centralization by:

* Giving buyers a **publicly visible, easy-to-browse place** to post ads.
* Giving sellers a **simple way to compare buyer offers** in their area.
* Providing admins with the ability to **seed initial marketplace content**, ensuring the site never looks empty.
* Enabling future features such as user profiles, claimable ads, geolocation targeting, role-specific dashboards, and messaging.

This is the first step in creating an **industry-standard marketplace platform**.

---

## 🔐 **User Roles & Access Control**

| Role           | Capabilities                                                    |
| -------------- | --------------------------------------------------------------- |
| **Guest**      | Browse ads, open details, see images                            |
| **Buyer**      | Post ads, manage own ads (future), appear in feed               |
| **Wholesaler** | Similar to Buyer with expanded categories (future)              |
| **Seller**     | View buyer ads; contact buyers                                  |
| **Admin**      | Access Admin Panel, seed unclaimed ads, future moderation tools |

Firebase Realtime Database rules enforce strict role-based writes.

---

## 📦 **Features (Current MVP)**

### ✔ Public Marketplace Feed

* Real-time ad loading from Firebase
* Grid or list view
* Full image gallery modal
* Buyer details, price, location, description

### ✔ Multi-step Posting Wizard

* 4-step guided workflow
* Image uploads (Storage)
* Category selections
* Description & pricing
* **Contact email OR phone (at least one required)**
* Validation & error handling
* Works for buyers, wholesalers, and admin seeding

### ✔ Admin Posting Flow

Admin users can create **“Unclaimed” buyer ads**, which populate the feed and ensure the marketplace is never empty at launch.

### ✔ Firebase Authentication

* Email & password sign-in
* Role detection for UI personalization
* Auth panel modal UI
* Guest posting restrictions

### ✔ Fully Responsive UI

Clean CSS-based design compatible across desktop and mobile browsers.

---

## 📁 **Repository Structure**

```
src/
 ├── components/         # Header, Feed, Modals, Admin, etc.
 ├── authContext.tsx     # Role-aware authentication context
 ├── firebase.ts         # Firebase setup
 ├── adsService.ts       # Posting, uploading, analytics
 ├── App.tsx             # Central UI controller
 ├── PostAdWizard.tsx    # Multi-step wizard
 └── types.ts            # Strongly typed interfaces
```

---

## 🧪 **Running Locally**

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the app

Vite will display a local dev URL, usually:

```
http://localhost:5173/
```

---

## 🔥 **Firebase Setup**

This project includes a **public client configuration** in `src/firebase.ts`.
This is expected — Firebase client apps expose their API keys.
Security is controlled by Firebase **rules**, not by hiding env values.

Before deploying to your own Firebase project:

1. Replace the config block with your own Firebase values.
2. Update your Realtime Database rules to match your role requirements.
3. Enable Authentication → Email/Password.

---

## 🚧 **Roadmap**

The following features are planned and partially scaffolded:

* ⭐ Seller → Buyer messaging system
* ⭐ Claimable ads (buyers take ownership of “unclaimed” posts)
* ⭐ Featured & premium ads for wholesalers
* ⭐ Admin moderation dashboard
* ⭐ City & ZIP-based filtering
* ⭐ Barcode scanning integration
* ⭐ User profiles with ratings

---

## 🤝 **Contributing**

This project will remain open during early development while the marketplace grows.
Feature requests, bug reports, and improvements are welcome via GitHub Issues or Pull Requests.

---

## 📜 **License**

All rights reserved.
This codebase is proprietary and part of the **Test Strip Marketplace** platform.

---

## 🧑‍💼 **About the Founder**

Test Strip Marketplace is developed by **Darshaun Davis**, founder of **Lislal Corporation**, a multi-project ecosystem that includes:

* Flipping Medical Supplies Assistant (FMSA)
* Naiventa AI
* Test Strip Marketplace
* Industry-specific SaaS tools for buy/sell operations

This platform is the foundation for modernizing the diabetic supplies reselling industry.