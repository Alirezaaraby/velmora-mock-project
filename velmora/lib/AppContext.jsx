import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

const STYLIST_KEY = 'velmora.stylist.v1';
const BAG_KEY = 'velmora.bag.v1';

const readStored = (key, fallback) => {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const readList = (key) => {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function AppProvider({ children }) {
  const [stylistOpen, setStylistOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [bag, setBag] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setAnswers(readStored(STYLIST_KEY, {}));
      setBag(readList(BAG_KEY));
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STYLIST_KEY, JSON.stringify(answers));
  }, [answers, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  }, [bag, isHydrated]);

  const openStylist = useCallback((preset) => {
    setBagOpen(false);
    if (preset && Object.keys(preset).length) {
      setAnswers((current) => ({ ...current, ...preset }));
    }
    setStylistOpen(true);
  }, []);

  const closeStylist = useCallback(() => setStylistOpen(false), []);

  const clearStylist = useCallback(() => {
    setAnswers({});
    window.localStorage.removeItem(STYLIST_KEY);
  }, []);

  const setAnswer = useCallback((key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  }, []);

  const addToBag = useCallback((item) => {
    setBag((current) => [...current, { ...item, id: `${item.slug}-${item.size}-${item.colour}-${Date.now()}` }]);
  }, []);

  const removeFromBag = useCallback((id) => {
    setBag((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      stylistOpen,
      openStylist,
      closeStylist,
      answers,
      setAnswer,
      clearStylist,
      bag,
      addToBag,
      removeFromBag,
      bagOpen,
      setBagOpen,
      bagCount: bag.length,
      bagTotal: bag.reduce((sum, item) => sum + item.price, 0),
    }),
    [stylistOpen, openStylist, closeStylist, answers, setAnswer, clearStylist, bag, addToBag, removeFromBag, bagOpen],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}