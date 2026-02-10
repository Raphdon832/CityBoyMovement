# 🇳🇬 Renewed Hope Dashboard — 3 Years of Progress# 🇳🇬 Renewed Hope — 3 Years of Progress# React + Vite



A mobile-first Progressive Web App (PWA) showcasing President Bola Ahmed Tinubu's achievements across 8 key sectors in his first 3 years in office.



**Presented by City Boy Movement** · **Developed by RymeLabs**A comprehensive mobile-first web application showcasing President Bola Ahmed Tinubu's achievements during his first 3 years in office (May 2023 – February 2026).This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## Features



- Interactive sector dashboards with animated Recharts## FeaturesCurrently, two official plugins are available:

- Sector highlight videos

- Real-time report feeds (admin-only posting via Firebase)

- WhatsApp-style community chat with presence indicators

- Google Sign-In authentication- **Intro Video Screen** — Opens with an achievement highlight video; a "Continue" button appears 10 seconds before the end- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- Installable PWA with offline support

- Nigeria green (#006B3F) and gold (#C5960C) branding- **Home Dashboard** — Sector performance cards with quick stats banner (GDP, Jobs, FDI)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



## Tech Stack- **8 Economy Sectors** — Economy, Infrastructure, Security, Education, Healthcare, Agriculture, Energy, Digital & Innovation



- **Frontend:** React 19 + Vite 7- **Sector Detail Pages** — Toggle between video summary and detailed text reports## React Compiler

- **Styling:** CSS-in-JS, Framer Motion animations

- **Icons:** Lucide React- **Animated Charts & Graphs** — Area charts, bar charts, line charts, pie charts, radar charts, and progress bars using Recharts

- **Charts:** Recharts

- **Backend:** Firebase (Auth, Firestore, Analytics)- **Report Feeds** — Official and citizen reports with upvotes and engagementThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **PWA:** vite-plugin-pwa + Workbox

- **Profile Page** — User stats and account settings

## Getting Started

- **Bottom Navigation** — 5-tab navigation similar to the design reference## Expanding the ESLint configuration

```bash

npm install

npm run dev

```## Tech StackIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



## Environment Variables

- **React 19** + **Vite**

Create a `.env` file with your Firebase config:- **React Router DOM** — Client-side routing

- **Framer Motion** — Smooth animations

```- **Recharts** — Animated data visualization

VITE_FB_API_KEY=your_api_key- **Lucide React** — Modern icons

VITE_FB_AUTH_DOMAIN=your_auth_domain

VITE_FB_PROJECT_ID=your_project_id## Getting Started

VITE_FB_STORAGE_BUCKET=your_storage_bucket

VITE_FB_MESSAGING_ID=your_messaging_id```bash

VITE_FB_APP_ID=your_app_idnpm install

VITE_FB_MEASUREMENT_ID=your_measurement_idnpm run dev

``````



## DeploymentOpen `http://localhost:5173`



Deployed on Netlify. Push to `main` triggers auto-deploy.## Project Structure



```bash```

npm run buildsrc/

```├── components/BottomNav.jsx

├── data/sectors.js

## License├── pages/

│   ├── IntroVideo.jsx

© 2026 Federal Republic of Nigeria. All rights reserved.│   ├── Home.jsx

│   ├── Feeds.jsx
│   ├── SectorDetail.jsx
│   └── Profile.jsx
├── App.jsx
├── main.jsx
└── index.css
```
