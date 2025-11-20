import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchStoreStatus } from '@/api';

interface StoreContextType {
  isOpen: boolean;
  refreshStatus: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const refreshStatus = async () => {
    try {
      const status = await fetchStoreStatus();
      setIsOpen(status.isOpen);
    } catch (error) {
      console.error('Error fetching store status:', error);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  return (
    <StoreContext.Provider value={{ isOpen, refreshStatus }}>
      {children}
    </StoreContext.Provider>
  );
};