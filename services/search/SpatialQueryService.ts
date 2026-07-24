import { BaseOperationalEntity } from '@/types/operational-models';

export class SpatialQueryService {
  
  static getNearestNeighbors<T extends BaseOperationalEntity>(
    target: [number, number], 
    collection: T[], 
    limit: number = 5
  ): T[] {
    return collection
      .filter(item => item.coordinates)
      .sort((a, b) => {
        const distA = this.calculateDistance(target, a.coordinates!);
        const distB = this.calculateDistance(target, b.coordinates!);
        return distA - distB;
      })
      .slice(0, limit);
  }

  static getWithinRadius<T extends BaseOperationalEntity>(
    center: [number, number], 
    radiusMeters: number, 
    collection: T[]
  ): T[] {
    return collection.filter(item => {
      if (!item.coordinates) return false;
      const dist = this.calculateDistance(center, item.coordinates);
      return dist <= radiusMeters;
    });
  }

  private static calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371e3;
    const lat1 = coord1[1] * Math.PI / 180;
    const lat2 = coord2[1] * Math.PI / 180;
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const deltaLon = (coord2[0] - coord1[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
