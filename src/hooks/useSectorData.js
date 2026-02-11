import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sectors as localSectors } from "../data/sectors";

/**
 * Custom hook to load sector data from Firestore with fallback to local sectors.js.
 * Firestore docs in "sectors" collection override the local defaults.
 * Returns { sectors, loading, updateSector }.
 */
export const useSectorData = () => {
  const [firestoreSectors, setFirestoreSectors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sectors"),
      (snapshot) => {
        const map = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data();
        });
        setFirestoreSectors(map);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading sectors from Firestore:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  // Merge: Firestore overrides take precedence over local defaults
  const sectors = localSectors.map((local) => {
    const override = firestoreSectors[local.id];
    if (!override) return local;
    return {
      ...local,
      ...override,
      // Deep merge charts if both exist
      charts: override.charts
        ? { ...local.charts, ...override.charts }
        : local.charts,
    };
  });

  /**
   * Update a sector in Firestore (merge mode).
   * Only saves the fields that are different from local defaults.
   */
  const updateSector = async (sectorId, data) => {
    const ref = doc(db, "sectors", sectorId);
    await setDoc(ref, data, { merge: true });
  };

  return { sectors, loading, updateSector };
};

/**
 * Hook for a single sector by ID with Firestore overrides.
 */
export const useSingleSector = (sectorId) => {
  const { sectors, loading, updateSector } = useSectorData();
  const sector = sectors.find((s) => s.id === sectorId) || null;
  return {
    sector,
    loading,
    updateSector: (data) => updateSector(sectorId, data),
  };
};
