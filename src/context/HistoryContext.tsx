import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HistoryItem {
  vin: string;
  results: any[];
  message?: string;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  loadFromHistory: (item: HistoryItem) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Завантаження з localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vinHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Збереження в localStorage
  useEffect(() => {
    localStorage.setItem('vinHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (newItem: HistoryItem) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.vin !== newItem.vin);
      return [newItem, ...filtered].slice(0, 3);
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    // Можна додати логіку, якщо треба
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, loadFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};