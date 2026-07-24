import { useFamilyTrackingStore } from '../stores/familyTrackingStore';

export class FamilyTrackingService {
  static processIncomingGPS(pilgrimId: string, lat: number, lng: number, battery: number) {
    // In a real implementation, this passes to SpatialIntelligenceEngine first,
    // which validates distances and zones before updating the tracking store.
    useFamilyTrackingStore.getState().updateLocation(pilgrimId, {
      lat, lng, timestamp: Date.now(), batteryPct: battery, accuracy: 5, isOffline: false
    });
  }
}
