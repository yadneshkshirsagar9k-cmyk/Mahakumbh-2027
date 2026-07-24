import React, { createContext, useContext } from 'react';
import type { RenderingContextData } from '@/types/rendering.types';

const CredentialContext = createContext<RenderingContextData | null>(null);

export function CredentialProvider({ 
  value, 
  children 
}: { 
  value: RenderingContextData; 
  children: React.ReactNode 
}) {
  return (
    <CredentialContext.Provider value={value}>
      {children}
    </CredentialContext.Provider>
  );
}

export function useCredentialContext() {
  const context = useContext(CredentialContext);
  if (!context) {
    throw new Error('useCredentialContext must be used within a CredentialProvider');
  }
  return context;
}
