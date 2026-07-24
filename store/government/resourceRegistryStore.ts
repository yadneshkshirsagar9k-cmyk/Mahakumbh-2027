import { create } from 'zustand';
import { OperationalResource } from '@/types/operational-models';

interface ResourceRegistryState {
  productionResources: OperationalResource[];
  setProductionResources: (resources: OperationalResource[]) => void;
  updateResourceStatus: (id: string, status: OperationalResource['status']) => void;
}

export const useResourceRegistryStore = create<ResourceRegistryState>((set) => ({
  productionResources: [],
  
  setProductionResources: (resources) => set({ productionResources: resources }),
  
  updateResourceStatus: (id, status) => set((state) => ({
    productionResources: state.productionResources.map(res => 
      res.id === id ? { ...res, status, timestamp: Date.now() } : res
    )
  }))
}));
