import { create } from 'zustand';
import { OperationalEvent } from '@/types/operational-models';

interface TimelineState {
  productionEvents: OperationalEvent[];
  setProductionEvents: (events: OperationalEvent[]) => void;
  addProductionEvent: (event: OperationalEvent) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  productionEvents: [],
  setProductionEvents: (events) => set({ productionEvents: events }),
  addProductionEvent: (event) => set((state) => ({ 
    productionEvents: [event, ...state.productionEvents] 
  }))
}));
