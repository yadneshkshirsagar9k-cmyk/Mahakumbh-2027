import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { layerRegistry } from './LayerRegistry';
import { UnifiedCrowdPoint } from '@/types/command-centre';

layerRegistry.register({
  id: 'crowd-heatmap',
  name: 'Live Crowd Density',
  generateLayer: (data: UnifiedCrowdPoint[]) => {
    return new HeatmapLayer({
      id: 'crowd-heatmap',
      data,
      getPosition: (d: UnifiedCrowdPoint) => d.coordinates,
      getWeight: (d: UnifiedCrowdPoint) => d.weight,
      radiusPixels: 40,
      intensity: 1,
      threshold: 0.1,
      colorRange: [
        [0, 255, 0, 150],     // Green
        [255, 255, 0, 150],   // Yellow
        [255, 165, 0, 150],   // Orange
        [255, 0, 0, 150]      // Red
      ]
    });
  }
});
