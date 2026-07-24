import { useMemo } from 'react';
import { useICCCStore } from '@/store/government/icccStore';
import { useIncidentStore } from '@/store/command-centre/incidentStore';
import { useCrowdStore } from '@/store/command-centre/crowdStore';
import { useTrafficStore } from '@/store/command-centre/trafficStore';
import { useNotificationStore } from '@/store/command-centre/notificationStore';
import { useTimelineStore } from '@/store/command-centre/timelineStore';
import { useResourceRegistryStore } from '@/store/government/resourceRegistryStore';
import { useSimulationOverlayStore } from '@/store/simulation/simulationOverlayStore';

export const useMergedIncidents = () => {
  const mode = useICCCStore(state => state.operationalMode);
  const prod = useIncidentStore(state => state.incidents);
  const sim = useSimulationOverlayStore(state => state.incidents);
  
  return useMemo(() => {
    return mode === 'Simulation' ? [...prod, ...sim] : prod;
  }, [mode, prod, sim]);
};

export const useMergedCrowdPoints = () => {
  const mode = useICCCStore(state => state.operationalMode);
  const prod = useCrowdStore(state => state.points);
  const sim = useSimulationOverlayStore(state => state.crowdPoints);
  
  return useMemo(() => {
    return mode === 'Simulation' ? [...prod, ...sim] : prod;
  }, [mode, prod, sim]);
};

export const useMergedTrafficSegments = () => {
  const mode = useICCCStore(state => state.operationalMode);
  const prod = useTrafficStore(state => state.segments);
  const sim = useSimulationOverlayStore(state => state.trafficSegments);
  
  return useMemo(() => {
    return mode === 'Simulation' ? [...prod, ...sim] : prod;
  }, [mode, prod, sim]);
};

export const useMergedNotifications = () => {
  const mode = useICCCStore(state => state.operationalMode);
  const prod = useNotificationStore(state => state.notifications);
  const sim = useSimulationOverlayStore(state => state.notifications);
  
  return useMemo(() => {
    const merged = mode === 'Simulation' ? [...prod, ...sim] : [...prod];
    return merged.sort((a, b) => b.timestamp - a.timestamp);
  }, [mode, prod, sim]);
};

export const useMergedResources = () => {
  const mode = useICCCStore(state => state.operationalMode);
  const prod = useResourceRegistryStore(state => state.productionResources);
  const sim = useSimulationOverlayStore(state => state.resources);
  
  return useMemo(() => {
    return mode === 'Simulation' ? [...prod, ...sim] : prod;
  }, [mode, prod, sim]);
};

export const useMergedTimelineEvents = () => {
  const mode = useICCCStore(state => state.operationalMode);
  const prod = useTimelineStore(state => state.productionEvents);
  const sim = useSimulationOverlayStore(state => state.timelineEvents);
  
  return useMemo(() => {
    const merged = mode === 'Simulation' ? [...prod, ...sim] : [...prod];
    return merged.sort((a, b) => b.timestamp - a.timestamp);
  }, [mode, prod, sim]);
};
