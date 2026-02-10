/**
 * Seed script — Run once to populate Firestore with initial report feeds.
 * Usage: node scripts/seedFeeds.mjs
 *
 * Requires a .env file (or set env vars) with your Firebase config:
 *   VITE_FB_API_KEY, VITE_FB_AUTH_DOMAIN, VITE_FB_PROJECT_ID,
 *   VITE_FB_STORAGE_BUCKET, VITE_FB_MESSAGING_ID, VITE_FB_APP_ID
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Try loading .env manually (no dotenv dependency needed)
try {
  const envPath = resolve(__dirname, "../.env");
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, ...val] = line.split("=");
    if (key && val.length) process.env[key.trim()] = val.join("=").trim();
  });
} catch {
  // .env not found — rely on env vars
}

const firebaseConfig = {
  apiKey: process.env.VITE_FB_API_KEY,
  authDomain: process.env.VITE_FB_AUTH_DOMAIN,
  projectId: process.env.VITE_FB_PROJECT_ID,
  storageBucket: process.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FB_MESSAGING_ID,
  appId: process.env.VITE_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reportFeeds = [
  {
    author: "National Bureau of Statistics",
    handle: "@NaborStats",
    title: "Nigeria's GDP Grows 3.46% in Q3 2025",
    description:
      "Nigeria's real GDP grew by 3.46% year-on-year in Q3 2025, driven by the services and agriculture sectors. The non-oil sector contributed 94.3% of total GDP.",
    upvotes: 2450,
    comments: 312,
    status: "Published",
    isOfficial: true,
    createdAt: new Date("2026-02-10T09:00:00Z").toISOString(),
  },
  {
    author: "Federal Ministry of Works",
    handle: "@FMWH_NG",
    title: "Lagos–Calabar Highway: Section 1 Progress Update",
    description:
      "Construction on Section 1 (Lagos–Epe) of the Lagos-Calabar Coastal Highway is progressing. Over 8,000 workers are engaged on this 700km national project.",
    upvotes: 1890,
    comments: 245,
    status: "Published",
    isOfficial: true,
    createdAt: new Date("2026-02-10T07:00:00Z").toISOString(),
  },
  {
    author: "NELFUND",
    handle: "@NELFUND_NG",
    title: "900,000+ Students Have Received Loans",
    description:
      "The Nigerian Education Loan Fund (NELFUND) has disbursed student loans to over 900,000 beneficiaries across 238 accredited institutions nationwide.",
    upvotes: 3100,
    comments: 428,
    status: "Published",
    isOfficial: true,
    createdAt: new Date("2026-02-09T12:00:00Z").toISOString(),
  },
  {
    author: "Dangote Group",
    handle: "@DangoteGroup",
    title: "Dangote Refinery Now Producing PMS Domestically",
    description:
      "The 650,000 bpd Dangote Refinery in Lagos commenced petrol production, reducing Nigeria's dependency on imported refined petroleum products.",
    upvotes: 4200,
    comments: 589,
    status: "Verified",
    isOfficial: false,
    createdAt: new Date("2026-02-08T15:00:00Z").toISOString(),
  },
];

async function seed() {
  // Check if feeds already exist
  const snap = await getDocs(query(collection(db, "feeds"), limit(1)));
  if (!snap.empty) {
    console.log("⚠️  Feeds collection already has data. Skipping seed.");
    process.exit(0);
  }

  console.log("🌱 Seeding report feeds...");
  for (const feed of reportFeeds) {
    const docRef = await addDoc(collection(db, "feeds"), feed);
    console.log(`  ✅ Added: ${feed.title} (${docRef.id})`);
  }
  console.log("🎉 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
