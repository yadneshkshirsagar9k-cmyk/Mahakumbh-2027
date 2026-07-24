import { BaseOperationalEntity } from '@/types/operational-models';
import { SpatialQueryService } from './SpatialQueryService';

export class GovernmentSearchService {
  private static inMemoryIndex: Map<string, BaseOperationalEntity[]> = new Map();

  static indexEntities(type: string, entities: BaseOperationalEntity[]) {
    this.inMemoryIndex.set(type, entities);
  }

  static searchNearby(type: string, center: [number, number], radiusMeters: number = 1000) {
    const collection = this.inMemoryIndex.get(type) || [];
    return SpatialQueryService.getWithinRadius(center, radiusMeters, collection);
  }
  
  static textSearch(query: string) {
    const results: BaseOperationalEntity[] = [];
    const q = query.toLowerCase();
    
    this.inMemoryIndex.forEach((collection) => {
      collection.forEach(item => {
        if (item.metadata && JSON.stringify(item.metadata).toLowerCase().includes(q)) {
          results.push(item);
        }
      });
    });
    return results;
  }
}
