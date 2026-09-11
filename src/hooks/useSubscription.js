import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Free tier limits
export const FREE_QUESTIONS_PER_DAY = 3;
export const FREE_SUMMARIES_PER_DAY = 5;

// Check if user has premium access.
// Premium is stored in Firestore at /users/{uid}/subscription { active: true }
// For now all logged-in users get free tier; premium upgrades via Stripe later.
export function useSubscription() {
  const [state, setState] = useState({
    user: null,
    isPremium: false,
    questionsUsedToday: 0,
    loading: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        setState({ user: null, isPremium: false, questionsUsedToday: 0, loading: false });
        return;
      }

      // Check premium status
      let isPremium = false;
      try {
        const subRef = doc(db, 'users', u.uid, 'subscription', 'status');
        const subSnap = await getDoc(subRef);
        if (subSnap.exists() && subSnap.data().active === true) {
          isPremium = true;
        }
      } catch (e) {}

      // Check today's AI question usage
      let questionsUsedToday = 0;
      try {
        const today = new Date().toISOString().slice(0, 10);
        const usageRef = doc(db, 'users', u.uid, 'usage', today);
        const usageSnap = await getDoc(usageRef);
        if (usageSnap.exists()) {
          questionsUsedToday = usageSnap.data().questions || 0;
        }
      } catch (e) {}

      setState({ user: u, isPremium, questionsUsedToday, loading: false });
    });
    return () => unsub();
  }, []);

  const canAskQuestion = state.isPremium || state.questionsUsedToday < FREE_QUESTIONS_PER_DAY;
  const questionsRemaining = state.isPremium ? Infinity : Math.max(0, FREE_QUESTIONS_PER_DAY - state.questionsUsedToday);

  return { ...state, canAskQuestion, questionsRemaining };
}
