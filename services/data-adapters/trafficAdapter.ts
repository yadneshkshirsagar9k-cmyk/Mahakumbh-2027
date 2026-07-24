import { UnifiedTrafficSegment } from '@/types/command-centre';

export const trafficAdapter = {
  fromApi: (rawTraffic: any): UnifiedTrafficSegment => ({
    id: rawTraffic.routeId,
    path: rawTraffic.pathCoords,
    speed: rawTraffic.currentSpeed,
    capacity: rawTraffic.maxCapacity,
    status: rawTraffic.status,
  }),
  fromSimulation: (simTraffic: any): UnifiedTrafficSegment => ({
    ...simTraffic
  })
};
