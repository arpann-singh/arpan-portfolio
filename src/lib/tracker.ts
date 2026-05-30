import { db } from "./firebase";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";

export const trackEvent = async (eventType: "resumeDownloads" | "githubClicks") => {
  try {
    const docRef = doc(db, "analytics", "global_stats");
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Initialize the database document if it's the very first click
      await setDoc(docRef, { resumeDownloads: 0, githubClicks: 0, [eventType]: 1 });
    } else {
      // Securely increment the counter by exactly 1
      await updateDoc(docRef, { [eventType]: increment(1) });
    }
  } catch (error) {
    console.error("Telemetry error:", error);
  }
};
