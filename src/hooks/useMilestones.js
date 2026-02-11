import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// Default milestones (fallback when Firestore is empty)
export const defaultMilestones = [
  {
    id: "ms-1",
    icon: "Route",
    title: "Lagos–Calabar Highway",
    desc: "700km coastal highway flagged off March 2024",
    color: "#E65100",
  },
  {
    id: "ms-2",
    icon: "Factory",
    title: "Dangote Refinery",
    desc: "650,000 bpd — producing petrol domestically",
    color: "#F57F17",
  },
  {
    id: "ms-3",
    icon: "BookOpen",
    title: "NELFUND Student Loans",
    desc: "900,000+ students funded across 238 institutions",
    color: "#6A1B9A",
  },
  {
    id: "ms-4",
    icon: "Fuel",
    title: "Pi-CNG Initiative",
    desc: "100+ CNG conversion centres to cut fuel costs",
    color: "#33691E",
  },
];

/**
 * Custom hook to load milestones from Firestore "milestones" collection.
 * Falls back to defaultMilestones if collection is empty.
 * Returns { milestones, loading, addMilestone, updateMilestone, deleteMilestone }.
 */
export const useMilestones = () => {
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [hasFirestore, setHasFirestore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "milestones"),
      (snapshot) => {
        if (snapshot.empty) {
          setMilestones(defaultMilestones);
          setHasFirestore(false);
        } else {
          const docs = [];
          snapshot.forEach((docSnap) => {
            docs.push({ id: docSnap.id, ...docSnap.data() });
          });
          // Sort by order field if available, otherwise by title
          docs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          setMilestones(docs);
          setHasFirestore(true);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error loading milestones:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addMilestone = async (milestone) => {
    // If Firestore is empty, seed all defaults first, then add new one
    if (!hasFirestore) {
      for (let i = 0; i < defaultMilestones.length; i++) {
        const ms = defaultMilestones[i];
        await setDoc(doc(db, "milestones", ms.id), { ...ms, order: i });
      }
    }
    const newMs = {
      ...milestone,
      order: milestones.length,
    };
    const docRef = await addDoc(collection(db, "milestones"), newMs);
    return docRef.id;
  };

  const updateMilestone = async (milestoneId, data) => {
    // If Firestore is empty, seed all defaults first
    if (!hasFirestore) {
      for (let i = 0; i < defaultMilestones.length; i++) {
        const ms = defaultMilestones[i];
        await setDoc(doc(db, "milestones", ms.id), { ...ms, order: i });
      }
    }
    await setDoc(doc(db, "milestones", milestoneId), data, { merge: true });
  };

  const deleteMilestone = async (milestoneId) => {
    await deleteDoc(doc(db, "milestones", milestoneId));
  };

  return { milestones, loading, addMilestone, updateMilestone, deleteMilestone };
};
